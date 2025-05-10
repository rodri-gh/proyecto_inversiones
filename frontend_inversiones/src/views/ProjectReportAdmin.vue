<template>
  <div class="container col-md-12 mt-3">
    <div>
      <!--  <h4 class="card-title text-start mb-3">Reporte de Proyectos</h4> -->

      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <!-- Fecha Inicio -->
            <div class="col-12 col-sm-12 col-md-6 col-lg-3">
              <label class="form-label">Fecha Inicio</label>
              <input
                type="date"
                class="form-control"
                v-model="filters.startDate"
              />
            </div>

            <!-- Fecha Fin -->
            <div class="col-12 col-sm-12 col-md-6 col-lg-3">
              <label class="form-label">Fecha Fin</label>
              <input
                type="date"
                class="form-control"
                v-model="filters.endDate"
                :min="filters.startDate"
              />
            </div>

            <!-- Monto Mínimo -->
            <div class="col-12 col-sm-12 col-md-6 col-lg-2">
              <label class="form-label">Monto Mínimo</label>
              <input
                type="number"
                class="form-control"
                v-model="filters.minAmount"
                min="0"
              />
            </div>

            <!-- Monto Máximo -->
            <div class="col-12 col-sm-12 col-md-6 col-lg-2">
              <label class="form-label">Monto Máximo</label>
              <input
                type="number"
                class="form-control"
                v-model="filters.maxAmount"
              />
            </div>

            <!-- Estado -->
            <div class="col-12 col-sm-12 col-md-6 col-lg-2">
              <label class="form-label">Estado</label>
              <select class="form-select" v-model="filters.status">
                <option value="">Todos</option>
                <option value="open">Abierto</option>
                <option value="closed">Cerrado</option>
              </select>
            </div>

            <!-- Mineral -->
            <div class="col-12 col-sm-12 col-md-6 col-lg-3">
              <label class="form-label">Mineral</label>
              <select class="form-select" v-model="filters.mineralId">
                <option value="">Todos</option>
                <option
                  v-for="mineral in minerals"
                  :key="mineral.id"
                  :value="mineral.id"
                >
                  {{ mineral.name }}
                </option>
              </select>
            </div>

            <!-- Botones -->
            <div class="col-12 text-end">
              <button
                class="btn btn-success me-2 mb-2"
                @click="exportToExcel()"
              >
                <i class="fa fa-book me-1"></i>
                Exportar a Excel
              </button>
              <button
                class="btn btn-primary me-2 mb-2"
                @click="getFilteredReport()"
              >
                <i class="fa fa-search me-1"></i>
                Aplicar Filtros
              </button>
              <button class="btn btn-secondary mb-2" @click="resetFilters()">
                <i class="fa fa-refresh me-1"></i>
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      <TableProjectsReportAdmin
        :headers="headers"
        :items="projects"
        :totals="totals"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import TableProjectsReportAdmin from "@/components/tables/TableProjectsReportAdmin.vue";
import { getHeaderRequest, userNameOfLocalStorage } from "@/authService";

const baseURL = `${import.meta.env.VITE_API_URL}/report-admin/projects`;
const userName = userNameOfLocalStorage();
const date = new Date().toLocaleDateString();
const projects = ref([]);
const minerals = ref([]);
const totals = ref({ totalInvestment: 0, totalExpenses: 0, totalProfit: 0 });
const header = getHeaderRequest();

const filters = ref({
  startDate: "",
  endDate: "",
  minAmount: "",
  maxAmount: "",
  status: "",
  mineralId: "",
});

const headers = [
  "Proyecto",
  "Descripción",
  "Monto Inversión",
  "% Ganancia",
  "Gastos Operativos",
  "Ganancia",
  "Fecha Inicio",
  "Fecha Fin",
  "Estado",
  "Inversores",
  "Minerales",
];

onMounted(() => {
  getMinerals();
  getFilteredReport();
});

const getMinerals = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/mineral`,
      {
        headers: header,
      }
    );
    minerals.value = data;
  } catch (error) {
    console.error("Error al obtener minerales:", error);
  }
};

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
    if (filters.value.mineralId)
      params.append("mineralId", filters.value.mineralId);

    const { data } = await axios.get(`${baseURL}?${params.toString()}`, {
      headers: header,
    });

    projects.value = data.projects;
    totals.value = data.totals;
    //Valores aplicados al filtro por consola
    console.log("Filtros aplicados:", filters.value);
  } catch (error) {
    console.error("Error al obtener reporte:", error);
  }
};

const resetFilters = () => {
  filters.value = {
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    status: "",
    mineralId: "",
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
    if (filters.value.mineralId)
      params.append("mineralId", filters.value.mineralId);

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
    link.setAttribute("download", `reporte_proyectos_${userName}_${date}.xlsx`);
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
.form-label {
  white-space: nowrap;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  height: 45px;
}

@media (max-width: 991.98px) {
  .form-label {
    white-space: normal;
  }

  .form-control,
  .form-select {
    margin-bottom: 0.5rem;
  }

  .card-body {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .btn {
    width: 100%;
    margin-right: 0 !important;
  }
}
</style>