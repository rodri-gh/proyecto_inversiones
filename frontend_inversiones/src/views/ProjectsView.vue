<template>
  <div class="container col-md-12 mt-5">
    <div v-if="!showDetails">
      <div>
        <h4 class="card-title text-center">Gestión de proyectos</h4>
        <div class="text-end">
          <Button
            data-bs-toggle="modal"
            data-bs-target="#modalProject"
            text="Nuevo"
            icon="fa fa-plus"
          />
        </div>
        <CardsSummary :items="summaryProjects" />
        <ul class="nav nav-tabs" id="userTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="all-tab"
              data-bs-toggle="tab"
              data-bs-target="#all"
              type="button"
              role="tab"
              aria-controls="all"
              aria-selected="true"
            >
              Todos
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="active-tab"
              data-bs-toggle="tab"
              data-bs-target="#active"
              type="button"
              role="tab"
              aria-controls="active"
              aria-selected="false"
            >
              Activos
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="inactive-tab"
              data-bs-toggle="tab"
              data-bs-target="#inactive"
              type="button"
              role="tab"
              aria-controls="inactive"
              aria-selected="false"
            >
              Finalizados
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="clients-tab"
              data-bs-toggle="tab"
              data-bs-target="#clients"
              type="button"
              role="tab"
              aria-controls="clients"
              aria-selected="false"
            >
              Eliminados
            </button>
          </li>
        </ul>
        <div class="tab-content" id="userTabsContent">
          <div
            class="tab-pane fade show active"
            id="all"
            role="tabpanel"
            aria-labelledby="all-tab"
          >
            <TableProjects
              :headers="headers"
              :items="projects"
              :actions="{
                edit: selectProject,
                delete: deleteProject,
                view: showProjectDetails,
              }"
            />
          </div>
          <div
            class="tab-pane fade"
            id="active"
            role="tabpanel"
            aria-labelledby="active-tab"
          >
            <TableProjects
              :headers="headers"
              :items="activeUsers"
              :actions="{
                edit: selectProject,
                delete: deleteProject,
                view: showProjectDetails,
              }"
            />
          </div>
          <div
            class="tab-pane fade"
            id="inactive"
            role="tabpanel"
            aria-labelledby="inactive-tab"
          >
            <TableProjects
              :headers="headers"
              :items="inactiveUsers"
              :actions="{
                edit: selectProject,
                delete: deleteProject,
                view: showProjectDetails,
              }"
            />
          </div>

          <div
            class="tab-pane fade"
            id="clients"
            role="tabpanel"
            aria-labelledby="clients-tab"
          >
            <TableProjects
              :headers="headers"
              :items="clientUsers"
              :actions="{
                edit: selectProject,
                delete: deleteProject,
                view: showProjectDetails,
              }"
            />
          </div>
        </div>
      </div>
      <!-- Modal -->
      <Modal
        modalId="modalProject"
        title="Datos del Proyecto"
        modalClass="modal-lg"
        :showSaveButton="!selectedProject?.id"
        :showUpdateButton="Boolean(selectedProject?.id)"
        @onClose="reset()"
        @onSave="saveProject()"
      >
        <div class="row">
          <div class="col-md-4">
            <div class="mb-3 mt-3">
              <label for="mineral" class="form-label">
                Selecciona un mineral
              </label>
              <select
                class="form-select"
                id="mineral"
                :disabled="selectedMinerals.length >= 2"
                v-model="selectedMineral"
                @change="addMineral"
              >
                <option value="" disabled>Seleccione un mineral</option>
                <option
                  v-for="mineral in availableMinerals"
                  :key="mineral.id"
                  :value="mineral"
                >
                  {{ mineral.name }}
                </option>
              </select>
            </div>

            <div v-if="selectedMinerals.length > 0">
              <h6>Minerales seleccionados:</h6>
              <ul class="list-group">
                <li
                  v-for="mineral in selectedMinerals"
                  :key="mineral.id"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  {{ mineral.name }}
                  <button
                    class="btn btn-danger btn-sm"
                    @click="removeMineral(mineral)"
                  >
                    <i class="fa fa-times"></i>
                  </button>
                </li>
              </ul>
              <ul class="list-group">
                <li
                  v-for="mineral in selectedMinerals"
                  :key="mineral.id"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  <label for="">{{ mineral.name }}</label>
                  <Input
                    id=""
                    label="Peso en Onzas"
                    type="number"
                    v-model="mineral.weightOunces"
                  />
                </li>
              </ul>
            </div>
          </div>

          <div class="col-md-8">
            <div class="row">
              <div class="col-md-6 mt-3">
                <Input id="name" label="Nombre" type="text" v-model="name" />
              </div>
              <div class="col-md-6 mt-3">
                <Input
                  id="description"
                  label="Descripcion"
                  type="text"
                  v-model="description"
                />
              </div>
              <div class="col-md-6 mt-3">
                <Input
                  id="startDate"
                  label="Fecha de inicio"
                  type="date"
                  v-model="startDate"
                />
              </div>
              <div class="col-md-6 mt-3">
                <Input
                  id="endDate"
                  label="Fecha estimada de fin"
                  type="date"
                  v-model="endDate"
                />
              </div>
              <div class="col-md-6 mt-3">
                <Input
                  id="investmentGoal"
                  label="Meta de inversion"
                  type="number"
                  v-model="investmentGoal"
                />
              </div>
              <div class="col-md-6 mt-3">
                <Input
                  id="profitPercentage"
                  label="% Ganancia Estimada"
                  type="number"
                  v-model="profitPercentage"
                />
              </div>
              <div class="col-md-6 mt-3">
                <Select
                  :options="[
                    { name: 'Abierto', value: 'open' },
                    //{ name: 'En transito', value: 'in_transit' },
                    { name: 'Cerrado', value: 'closed' },
                  ]"
                  label="Estado del Proyecto"
                  value-key="value"
                  label-key="name"
                  v-model="status"
                  select-class=""
                />
              </div>
              <div class="col-md-6">
                <br />
                <label for="">Tipo de Pojecto</label>
                <p><strong>Minero</strong></p>
                <!--<Input
                              id="projectType"
                              label="Tipo de Proyecto"
                              type="text"
                              v-model="projectType"
                          /> -->
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
    <div v-if="showDetails">
      <button type="button" class="btn btn-primary" @click="Back()">
        Atras
      </button>
      <ProjectDetailsView :projectId="idProject" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import ProjectDetailsView from "./ProjectDetailsView.vue";
import Button from "@/components/base/Button.vue";
import TableProjects from "@/components/tables/TableProjects.vue";
import Modal from "@/components/base/Modal.vue";
import { openModal, closeModal } from "@/utils/modal";
import Input from "@/components/base/Input.vue";
import {
  getHeaderRequest,
  getUserIdOfLocalStorage,
  getUserRoleOfLocalStorage,
} from "@/authService";
import CardsSummary from "@/components/CardsSummary.vue";
import Select from "@/components/base/Select.vue";
import { validateInputs } from "@/utils/validateInputs";
import { formatDate, standardFormatDate } from "@/router/viewFormat";
import { handleErrorSwal } from "@/errorMixin";

const baseURL = `${import.meta.env.VITE_API_URL}/`;
const projects = ref([]);
const name = ref("");
const description = ref("");
const investmentGoal = ref(0);
const status = ref("open");
const startDate = ref("");
const endDate = ref("");
const projectType = ref("Minero");
const profitPercentage = ref(0);
const showDetails = ref(false);
const selectedProject = ref({});
const idProject = ref("");
const header = getHeaderRequest();
const summaryProjects = ref([]);
const activeUsers = ref([]);
const inactiveUsers = ref([]);
const clientUsers = ref([]);
const availableMinerals = ref([]);
const selectedMinerals = ref([]);
const selectedMineral = ref("");

const userIdoOfProject = getUserIdOfLocalStorage();
const userRole = getUserRoleOfLocalStorage();

const statusOptions = {
  open: "Abierto",
  //in_transit: "En curso",
  closed: "Cerrado",
};

const headers = [
  "Registro",
  "Finalizacion",
  "Nombre",
  "Descripcion",
  "Meta",
  "Ganancia",
  "Eliminado",
  "Estado",
  "Acciones",
];

onMounted(() => {
  getProjects();
  getMinerals();
});

const showProjectDetails = (project) => {
  idProject.value = project.id;
  showDetails.value = true;
};

const Back = () => {
  idProject.value = "";
  showDetails.value = false;
};

const getMinerals = async () => {
  try {
    const response = await axios.get(baseURL + "mineral");
    console.log("minerales: " + response.data);
    availableMinerals.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const getProjects = async () => {
  try {
    const { data } = await axios.get(baseURL + "project");
    if (userRole === "admin") {
      projects.value = data.filter((item) => item.userId === userIdoOfProject);
    } else {
      projects.value = data;
    }
    activeUsers.value = projects.value.filter(
      (user) => user.status === "open" || user.status === "in_transit"
    );
    inactiveUsers.value = projects.value.filter(
      (user) => user.status === "closed"
    );
    clientUsers.value = projects.value.filter((user) => user.deleted === 1);
    getsummaryProjects();
    console.log(projects.value);
  } catch (error) {
    console.log(error);
  }
};

const addMineral = () => {
  if (selectedMineral.value && selectedMinerals.value.length < 2) {
    console.log(selectedMineral.value);
    selectedMinerals.value.push(selectedMineral.value);
  }
};

const removeMineral = async (mineral) => {
  const method = mineral.idProjectMineral ? "remove" : "update";
  if (method === "remove") {
    try {
      await axios.patch(
        baseURL + "projectMinerals/" + mineral.idProjectMineral,
        header
      );
      console.log("mineral eliminado para el Proyecto!");
    } catch (e) {
      console.error(e);
    }
  }
  selectedMinerals.value = selectedMinerals.value.filter(
    (m) => m.id !== mineral.id
  );
  selectedMineral.value = {};
};

const getsummaryProjects = () => {
  if (projects.value.length > 0) {
    let userTotals = projects.value.length;
    let userActives = 0;
    let projectFinish = 0;
    let projectDeleted = 0;
    for (var item of projects.value) {
      if (item.status === "open" || item.status === "in_transit") {
        userActives++;
      }
      if (item.status === "closed") {
        projectFinish++;
      }
      if (item.deleted === 1) {
        projectDeleted++;
      }
    }
    summaryProjects.value = [
      { key: "Proyectos Totales", value: userTotals },
      { key: "Proyectos Activos", value: userActives },
      { key: "Proyectos Finalizados", value: projectFinish },
      { key: "Proyectos Eliminados", value: projectDeleted },
    ];
    console.log(summaryProjects.value);
  } else {
    console.log("el array de projects para cards sumary esta vacio");
  }
};

const selectProject = (project) => {
  console.log(project.endDate);
  selectedProject.value = project;
  name.value = project.name;
  description.value = project.description;
  investmentGoal.value = project.investmentGoal;
  profitPercentage.value = project.profitPercentage;
  status.value = project.status;
  startDate.value = standardFormatDate(project.startDate);
  endDate.value = standardFormatDate(project.endDate);
  project.projectMinerals.forEach((projectMineral) => {
    const mineralWithId = {
      name: projectMineral.mineral.name,
      id: projectMineral.mineral.id,
      weightOunces: projectMineral.weightOunces,
      idProjectMineral: projectMineral.id,
      operatingExpenseId: projectMineral.operatingExpenseId,
    };
    selectedMinerals.value.push(mineralWithId);
  });
  console.log(selectedMinerals.value);
  openModal("modalProject");
};

const deleteProject = async (id) => {
  console.log(baseURL + id);
  try {
    const data = await axios.patch(baseURL + "project/" + id);
    console.log(baseURL + id);
    getProjects();
  } catch (error) {
    console.log(error);
  }
};

const reset = () => {
  name.value = "";
  description.value = "";
  investmentGoal.value = 0;
  profitPercentage.value = 0;
  selectedProject.value = {};
  selectedMinerals.value = [];
  selectedMineral.value = "";
};

const saveProject = async () => {
  if (!validateDates()) {
    return;
  }
  if (
    !validateInputs([
      { value: name.value, name: "Nombre", type: "text" },
      { value: description.value, name: "Descripcion", type: "text" },
      {
        value: investmentGoal.value,
        name: "Meta de inversion",
        type: "number",
      },
      {
        value: profitPercentage.value,
        name: "Ganancia estimada",
        type: "number",
      },
      { value: startDate.value, name: "Fecha de inicio", type: "date" },
      { value: endDate.value, name: "Fecha estimada de fin", type: "date" },
      {
        value: selectedMinerals.value.length,
        name: "Minerales",
        type: "minerals",
      },
    ])
  ) {
    return;
  }

  const method = selectedProject.value.id ? "put" : "post";
  const url = selectedProject.value.id
    ? `${baseURL + "project/"}${selectedProject.value.id}`
    : baseURL + "project/";
  const formData = createDataProject();
  try {
    const response = await axios[method](url, formData, header);
    console.log(response);
    await saveProjectMinerals(response.data.message.id);
    getProjects();
    closeModal("modalProject");
    reset();
  } catch (error) {
    console.log(error);
  }
};

const saveProjectMinerals = async (projectId) => {
  try {
    if (selectedMinerals.value.length > 0) {
      console.log(selectedMinerals.value);
      for (var item of selectedMinerals.value) {
        console.log(item);
        const method = item.idProjectMineral ? "put" : "post";
        const url = item.idProjectMineral
          ? `${baseURL + "projectMinerals/"}${item.idProjectMineral}`
          : baseURL + "projectMinerals/";
        console.log(url);
        var data = createDataMineralProject(item, projectId);
        var response = await axios[method](url, data, header);
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const createDataMineralProject = (mineral, idProject) => {
  const data = {
    projectId: idProject,
    mineralId: mineral.id,
    userId: null,
    operatingExpenseId: mineral.operatingExpenseId ?? null,
    weightOunces: mineral.weightOunces,
    purchasePrice: 0,
    prePurchase: 0,
    estimatedPurchasePrice: 0,
    exitPrice: 0,
    salePrice: 0,
  };
  return data;
};

const createDataProject = () => {
  const data = {
    userId: userIdoOfProject,
    name: name.value,
    description: description.value,
    investmentGoal: investmentGoal.value,
    status: status.value,
    startDate: startDate.value,
    endDate: endDate.value,
    projectType: projectType.value,
    profitPercentage: profitPercentage.value,
  };
  return data;
};

const validateDates = () => {
  if (new Date(startDate.value) > new Date(endDate.value)) {
    handleErrorSwal(
      "",
      "La Fecha de inicio no puede ser menor a la fecha de fin!"
    );
    return false;
  }
  return true;
};
</script>


<style scoped>
.nav-tabs .nav-link {
  color: #495057;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-bottom-color: transparent;
}
.nav-link {
  border-radius: 0;
}
.nav-tabs .nav-link.active {
  color: white;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.tab-content > .tab-pane {
  display: none;
}

.tab-content > .active {
  display: block;
}
</style>