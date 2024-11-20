<template>
  <div class="container col-md-11 m-3">
    <div v-if="!showDetails">
      <div>
        <h4 class="card-title text-center">Gestion de proyectos</h4>
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
        title="Datos del projecto"
        modalClass="modal-lg"
        :showSaveButton="!selectedProject?.id"
        :showUpdateButton="Boolean(selectedProject?.id)"
        @onClose="reset()"
        @onSave="saveProject()"
      >
        <div class="row">
          <div class="col-md-12">
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
                  label="Porcentange de ganancia Estimada"
                  type="number"
                  v-model="profitPercentage"
                />
              </div>
              <div class="col-md-6 mt-3">
                <Input
                  id="status"
                  label="Estado"
                  type="text"
                  v-model="status"
                />
              </div>
              <div class="col-md-6 mt-3">
                <br />
                <label for="">Tipo de Pojecto</label>
                <p><strong>Minero</strong></p>
                <!--<Input
                              id="projectType"
                              label="Tipo de projecto"
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

const baseURL = `${import.meta.env.VITE_API_URL}/project/`;
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
const userIdoOfProject = getUserIdOfLocalStorage();
const userRole = getUserRoleOfLocalStorage();

const statusOptions = {
  open: "Abierto",
  in_transit: "En curso",
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
});

const showProjectDetails = (project) => {
  idProject.value = project.id;
  showDetails.value = true;
};

const Back = () => {
  idProject.value = "";
  showDetails.value = false;
};

const getProjects = async () => {
  try {
    const { data } = await axios.get(baseURL);
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
      { key: "Projectos Totales", value: userTotals },
      { key: "Projectos Activos", value: userActives },
      { key: "Projectos Finalizados", value: projectFinish },
      { key: "Projectos Eliminados", value: projectDeleted },
    ];
    console.log(summaryProjects.value);
  } else {
    console.log("el array de projects para cards sumary esta vacio");
  }
};

const selectProject = (project) => {
  selectedProject.value = project;

  name.value = project.name;
  description.value = project.description;
  investmentGoal.value = project.investmentGoal;
  profitPercentage.value = project.profitPercentage;
  status.value = project.status;

  openModal("modalProject");
};

const deleteProject = async (id) => {
  console.log(baseURL + id);
  try {
    const data = await axios.patch(baseURL + id);
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
};

const saveProject = async () => {
  const method = selectedProject.value.id ? "put" : "post";
  const url = selectedProject.value.id
    ? `${baseURL}${selectedProject.value.id}`
    : baseURL;
  const formData = createData();
  try {
    await axios[method](url, formData, header);
    getProjects();
    closeModal("modalProject");
    reset();
  } catch (error) {
    console.log(error);
  }
};

const createData = () => {
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