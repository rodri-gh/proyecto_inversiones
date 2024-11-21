<!-- InvestmentReportAdmin.vue -->
<template>
  <div class="container col-md-12 mt-3">
    <div>
      <h4 class="card-title text-center mb-3">Reporte de Inversiones</h4>

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
            <div class="col-md-3">
              <label class="form-label">Monto Mínimo</label>
              <input
                type="number"
                class="form-control"
                v-model="filters.minAmount"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">Monto Máximo</label>
              <input
                type="number"
                class="form-control"
                v-model="filters.maxAmount"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">Usuario</label>
              <Multiselect
                v-model="filters.userId"
                :options="users"
                :searchable="true"
                :createTag="false"
                placeholder="Buscar usuario..."
                label="fullName"
                track-by="id"
                @search-change="searchUsers"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label">Proyecto</label>
              <Multiselect
                v-model="filters.projectId"
                :options="projects"
                :searchable="true"
                :createTag="false"
                placeholder="Buscar proyecto..."
                label="name"
                track-by="id"
                @search-change="searchProjects"
              />
            </div>
            <div class="col-md-2">
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
            <div class="col-md-2">
              <label class="form-label">Estado</label>
              <select class="form-select" v-model="filters.status">
                <option value="">Todos</option>
                <option value="closed">Cerrado</option>
                <option value="pending">Pendiente</option>
              </select>
            </div>
            <div class="col-12 text-end">
              <button class="btn btn-success me-2" @click="exportToExcel">
                <i class="fa fa-book me-1"></i>
                Exportar a Excel
              </button>
              <button class="btn btn-primary me-2" @click="getFilteredReport">
                <i class="fa fa-search me-1"></i>
                Aplicar Filtros
              </button>
              <button class="btn btn-secondary" @click="resetFilters">
                <i class="fa fa-refresh me-1"></i>
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      <TableInvestmentsReportAdmin
        :headers="headers"
        :items="investments"
        :totals="totals"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import TableInvestmentsReportAdmin from "@/components/tables/TableInvestmentsReportAdmin.vue";
import { getHeaderRequest, userNameOfLocalStorage } from "@/authService";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";

const baseURL = `${import.meta.env.VITE_API_URL}/report-admin`;
const userName = userNameOfLocalStorage();
const date = new Date().toLocaleDateString();
const investments = ref([]);
const minerals = ref([]);
const users = ref([]);
const projects = ref([]);
const totals = ref({ totalInvestment: 0, totalEarnings: 0 });
const header = getHeaderRequest();

const filters = ref({
  startDate: "",
  endDate: "",
  minAmount: "",
  maxAmount: "",
  mineralId: "",
  projectId: "",
  userId: "",
  status: "",
});

const headers = [
  "Usuario",
  "Proyecto",
  "Monto Inversión",
  "Fecha Inversión",
  "Estado",
  "Ganancia",
  "Minerales",
];

onMounted(() => {
  getMinerals();
  getFilteredReport();
});

const getMinerals = async () => {
  try {
    const { data } = await axios.get(`${baseURL}/minerals`, {
      headers: header,
    });
    minerals.value = data;
  } catch (error) {
    console.error("Error al obtener minerales:", error);
  }
};

const searchUsers = async (search) => {
  if (search.length < 2) return;
  try {
    const { data } = await axios.get(
      `${baseURL}/users/search?search=${search}`,
      {
        headers: header,
      }
    );
    users.value = data.map((user) => ({
      ...user,
      fullName: `${user.name} ${user.lastName}`,
    }));
  } catch (error) {
    console.error("Error buscando usuarios:", error);
  }
};

const searchProjects = async (search) => {
  if (search.length < 2) return;
  try {
    const { data } = await axios.get(
      `${baseURL}/projects/search?search=${search}`,
      {
        headers: header,
      }
    );
    projects.value = data;
  } catch (error) {
    console.error("Error buscando proyectos:", error);
  }
};

const getFilteredReport = async () => {
  try {
    const params = new URLSearchParams();

    if (filters.value.startDate) {
      const start = new Date(filters.value.startDate);
      start.setHours(0, 0, 0, 0);
      params.append("startDate", start.toLocaleString("sv").replace(" ", "T"));
    }

    if (filters.value.endDate) {
      const end = new Date(filters.value.endDate);
      end.setHours(23, 59, 59, 999);
      params.append("endDate", end.toLocaleString("sv").replace(" ", "T"));
    }

    if (filters.value.minAmount)
      params.append("minAmount", filters.value.minAmount);
    if (filters.value.maxAmount)
      params.append("maxAmount", filters.value.maxAmount);
    if (filters.value.mineralId)
      params.append("mineralId", filters.value.mineralId);
    if (filters.value.projectId)
      params.append("projectId", filters.value.projectId);
    if (filters.value.userId) params.append("userId", filters.value.userId);
    if (filters.value.status) params.append("status", filters.value.status);

    const { data } = await axios.get(
      `${baseURL}/investments?${params.toString()}`,
      {
        headers: header,
      }
    );

    investments.value = data.investments;
    totals.value = data.totals;
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
    mineralId: "",
    projectId: "",
    userId: "",
    status: "",
  };
  getFilteredReport();
};

const exportToExcel = async () => {
  try {
    const params = new URLSearchParams();

    if (filters.value.startDate) {
      const start = new Date(filters.value.startDate);
      start.setHours(0, 0, 0, 0);
      params.append("startDate", start.toLocaleString("sv").replace(" ", "T"));
    }

    if (filters.value.endDate) {
      const end = new Date(filters.value.endDate);
      end.setHours(23, 59, 59, 999);
      params.append("endDate", end.toLocaleString("sv").replace(" ", "T"));
    }

    if (filters.value.minAmount)
      params.append("minAmount", filters.value.minAmount);
    if (filters.value.maxAmount)
      params.append("maxAmount", filters.value.maxAmount);
    if (filters.value.mineralId)
      params.append("mineralId", filters.value.mineralId);
    if (filters.value.projectId)
      params.append("projectId", filters.value.projectId);
    if (filters.value.userId) params.append("userId", filters.value.userId);
    if (filters.value.status) params.append("status", filters.value.status);

    const response = await axios.get(
      `${baseURL}/investments/export?${params.toString()}`,
      {
        headers: {
          ...header,
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        responseType: "blob",
      }
    );

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
.multiselect-wrapper {
  width: 100%;
}

.multiselect {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
}

.multiselect-search {
  padding: 0.375rem 0.75rem;
}

.multiselect-option {
  padding: 0.375rem 0.75rem;
}

.multiselect-option.is-selected {
  background-color: var(--primary-color);
  color: white;
}

.multiselect-option.is-pointed {
  background-color: #e9ecef;
  color: #212529;
}
</style>