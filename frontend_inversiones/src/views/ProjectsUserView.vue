<template>
  <div class="container col-md-10 mt-5">
    <div v-if="!showDetails">
      <div>
        <h4 class="card-title text-center">Gestion de proyectos</h4>

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
              id="projects-tab"
              data-bs-toggle="tab"
              data-bs-target="#projects"
              type="button"
              role="tab"
              aria-controls="projects"
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
            <TableProjectsUsers
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
            <TableProjectsUsers
              :headers="headers"
              :items="activeProjects"
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
            <TableProjectsUsers
              :headers="headers"
              :items="inactiveProjects"
              :actions="{
                edit: selectProject,
                delete: deleteProject,
                view: showProjectDetails,
              }"
            />
          </div>
          <div
            class="tab-pane fade"
            id="projects"
            role="tabpanel"
            aria-labelledby="projects-tab"
          >
            <TableProjectsUsers
              :headers="headers"
              :items="deletedProjects"
              :actions="{
                edit: selectProject,
                delete: deleteProject,
                view: showProjectDetails,
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import TableProjectsUsers from "@/components/tables/TableProjectsUsers.vue";
import { getHeaderRequest } from "@/authService";
import CardsSummary from "@/components/CardsSummary.vue";
import { getUserIdOfLocalStorage } from "@/authService";

const userId = getUserIdOfLocalStorage();
const baseURL = `http://localhost:3000/project/user/${userId}`;
const projects = ref([]);

const idProject = ref("");
const header = getHeaderRequest();
const summaryProjects = ref([]);
const activeProjects = ref([]);
const inactiveProjects = ref([]);
const deletedProjects = ref([]);

const headers = [
  "Fecha de Registro",
  "Fecha Estimada de fin",
  "Nombre",
  "Descripcion",
  /*   "Meta",
  "Ganancia", */
  "Estado del Proyecto",
];

onMounted(() => {
  getProjects();
});

const showProjectDetails = (project) => {
  idProject.value = project;
};

const getProjects = async () => {
  try {
    const { data } = await axios.get(baseURL);
    projects.value = data;
    activeProjects.value = data.filter(
      (project) => project.status === "open" || project.status === "in_transit"
    );
    inactiveProjects.value = data.filter(
      (project) => project.status === "closed"
    );
    deletedProjects.value = data.filter((project) => project.deleted === 1);
    getsummaryProjects();
    console.log("Proyectos del usuario", projects.value);
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