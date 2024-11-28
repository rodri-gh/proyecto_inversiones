<!-- InvestmentReportAdmin.vue -->
<template>
  <div class="container col-md-12 mt-3">
    <div>
      <!--    <h4 class="card-title text-center mb-3">Reporte de Inversiones</h4> -->

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
                :min="filters.startDate"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">Monto Mínimo</label>
              <input
                type="number"
                class="form-control"
                v-model="filters.minAmount"
                min="0"
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
              <v-select
                v-model="filters.userId"
                :options="users"
                :reduce="(option) => option.id"
                label="fullName"
                :filterable="false"
                @search="searchUsers"
                placeholder="Buscar usuario..."
              >
                <template #no-options>
                  Escriba para buscar usuarios...
                </template>
              </v-select>
            </div>

            <div class="col-md-4">
              <label class="form-label">Proyecto</label>
              <v-select
                v-model="filters.projectId"
                :options="projects"
                :reduce="(option) => option.id"
                label="name"
                :filterable="false"
                @search="searchProjects"
                placeholder="Buscar proyecto..."
              >
                <template #no-options>
                  Escriba para buscar proyectos...
                </template>
              </v-select>
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
import VSelect from "vue-select";
import "vue-select/dist/vue-select.css";

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
const searchUsers = async (search, loading) => {
  if (search.length < 2) return;

  loading(true);
  try {
    const { data } = await axios.get(
      `${baseURL}/users/search?search=${encodeURIComponent(search)}`,
      { headers: header }
    );

    users.value = data.map((user) => ({
      id: user.id,
      fullName: `${user.name} ${user.lastName}`,
      name: user.name,
      lastName: user.lastName,
    }));

    // Si hay un usuario seleccionado, asegurarse de mantenerlo en las opciones
    if (filters.value.userId) {
      const selectedUser = users.value.find(
        (u) => u.id === filters.value.userId
      );
      if (!selectedUser) {
        const currentUser = users.value.find(
          (u) => u.id === filters.value.userId
        );
        if (currentUser) {
          users.value = [...users.value, currentUser];
        }
      }
    }
  } catch (error) {
    console.error("Error buscando usuarios:", error);
  } finally {
    loading(false);
  }
};

const searchProjects = async (search, loading) => {
  if (search.length < 2) return;

  loading(true);
  try {
    const { data } = await axios.get(
      `${baseURL}/projects/search?search=${encodeURIComponent(search)}`,
      { headers: header }
    );

    projects.value = data.map((project) => ({
      id: project.id,
      name: project.name,
    }));

    // Si hay un proyecto seleccionado, asegurarse de mantenerlo en las opciones
    if (filters.value.projectId) {
      const selectedProject = projects.value.find(
        (p) => p.id === filters.value.projectId
      );
      if (!selectedProject) {
        const currentProject = projects.value.find(
          (p) => p.id === filters.value.projectId
        );
        if (currentProject) {
          projects.value = [...projects.value, currentProject];
        }
      }
    }
  } catch (error) {
    console.error("Error buscando proyectos:", error);
  } finally {
    loading(false);
  }
};

const getFilteredReport = async () => {
  try {
    console.log("Enviando filtros:", filters.value); // Debug
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
    mineralId: "",
    projectId: null,
    userId: null,
    status: "",
  };
  users.value = [];
  projects.value = [];
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
.chosen-container {
  width: 100% !important;
}
.v-select {
  border-radius: 25px;
  --vs-border-color: #ced4da;
  --vs-dropdown-bg: #fff;
  --vs-dropdown-color: #333;
  --vs-selected-bg: var(--primary-color);
  --vs-selected-color: black;
}

.v-select .vs__dropdown-toggle {
  border-radius: 25px;
  padding: 4px 0;
}

.v-select .vs__search {
  padding-left: 20px;
}

.v-select .vs__selected {
  padding-left: 20px;
}
</style>