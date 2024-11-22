<template>
  <div class="container col-md-10 mt-5">
    <div>
      <h4 class="card-title text-center">Reporte de Inversiones</h4>

      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label">Fecha Inicio</label>
              <input
                type="date"
                class="form-control"
                v-model="filters.startDate"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">Fecha Fin</label>
              <input
                type="date"
                class="form-control"
                v-model="filters.endDate"
              />
            </div>
            <div class="col-md-2">
              <label class="form-label">Monto Mínimo</label>
              <input
                type="number"
                class="form-control"
                v-model="filters.minAmount"
              />
            </div>
            <div class="col-md-2">
              <label class="form-label">Monto Máximo</label>
              <input
                type="number"
                class="form-control"
                v-model="filters.maxAmount"
              />
            </div>
            <div class="col-md-2">
              <label class="form-label">Estado</label>
              <select class="form-select p-2" v-model="filters.status">
                <option value="">Todos</option>
                <!--   <option value="active">Activo</option> -->
                <option value="pending">Pendiente</option>
                <option value="closed">Cerrado</option>
              </select>
            </div>
            <div class="col-12 text-end">
              <button class="btn btn-success me-2" @click="exportToExcel()">
                <i class="fa fa-book me-1"></i>
                Exportar a Excel
              </button>
              <button class="btn btn-primary me-2" @click="getFilteredReport()">
                <i class="fa fa-search me-1"></i>
                Aplicar Filtros
              </button>
              <button class="btn btn-secondary" @click="resetFilters()">
                <i class="fa fa-refresh me-1"></i>
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Resultados -->
      <TableReportClient
        :headers="headers"
        :items="investments"
        :actions="{ view: showContractDetails }"
        :totals="totals"
      />
    </div>

    <!-- Modal Detalles -->
    <div class="modal fade" id="contractModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalles del Contrato</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedContract">
            <div class="mb-3">
              <strong>Código:</strong>
              <p>{{ selectedContract.contractCode }}</p>
            </div>
            <div class="mb-3">
              <strong>Fecha Inicio:</strong>
              <p>{{ selectedContract.startDate }}</p>
            </div>
            <div class="mb-3">
              <strong>Fecha Fin:</strong>
              <p>{{ selectedContract.endDate }}</p>
            </div>
            <div class="mb-3">
              <strong>Monto:</strong>
              <p>
                {{ selectedContract.investmentAmount }}
                {{ selectedContract.currency }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import TableReportClient from "@/components/tables/TableReportClient.vue";
import {
  getHeaderRequest,
  getUserIdOfLocalStorage,
  userNameOfLocalStorage,
} from "@/authService";

const userId = getUserIdOfLocalStorage();
const userName = userNameOfLocalStorage();
const date = new Date().toLocaleDateString();
const baseURL = `${import.meta.env.VITE_API_URL}/report-client/user/${userId}`;
const investments = ref([]);
const totals = ref({ totalInvestment: 0, totalExpenses: 0, totalProfit: 0 });
const selectedContract = ref(null);
const header = getHeaderRequest();

const filters = ref({
  startDate: "",
  endDate: "",
  minAmount: "",
  maxAmount: "",
  status: "",
});

const headers = [
  "Proyecto",
  "Cod. Contrato",
  "Monto",
  "Fecha de Inversión",
  "Porcentaje de Ganancia",
  "Ganancia",
  "Estado",
];

onMounted(() => {
  getFilteredReport();
});
const getFilteredReport = async () => {
  try {
    const params = new URLSearchParams();

    if (filters.value.startDate)
      params.append("startDate", filters.value.startDate);
    if (filters.value.endDate) params.append("endDate", filters.value.endDate);
    if (filters.value.minAmount)
      params.append("minAmount", filters.value.minAmount);
    if (filters.value.maxAmount)
      params.append("maxAmount", filters.value.maxAmount);
    if (filters.value.status) params.append("status", filters.value.status);

    const { data } = await axios.get(`${baseURL}?${params.toString()}`, {
      headers: header,
    });

    investments.value = data.investments;
    totals.value = data.totals;
  } catch (error) {
    console.error("Error al obtener reporte:", error);
  }
};

const showContractDetails = (investment) => {
  selectedContract.value = investment.contract;
  const modal = new bootstrap.Modal(document.getElementById("contractModal"));
  modal.show();
};

const resetFilters = () => {
  filters.value = {
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    status: "",
  };
  getFilteredReport();
};

const exportToExcel = async () => {
  try {
    const params = new URLSearchParams();
    if (filters.value.startDate)
      params.append("startDate", filters.value.startDate);
    if (filters.value.endDate) params.append("endDate", filters.value.endDate);
    if (filters.value.minAmount)
      params.append("minAmount", filters.value.minAmount);
    if (filters.value.maxAmount)
      params.append("maxAmount", filters.value.maxAmount);
    if (filters.value.status) params.append("status", filters.value.status);

    const response = await axios.get(`${baseURL}/export?${params.toString()}`, {
      headers: {
        ...header,
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `reporte_inversiones_${userName}_${date}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error al exportar:", error);
  }
};
</script>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  opacity: 0.9;
}
.btn-success {
  background-color: #198754;
  border-color: #198754;
  border: none;
  border-radius: 1rem !important;
}

.btn-success:hover {
  opacity: 0.9;
}
.btn-secondary {
  background-color: #6c757d !important;
  border-color: #6c757d;
}
.btn-secondary:hover {
  opacity: 0.9;
}
</style>