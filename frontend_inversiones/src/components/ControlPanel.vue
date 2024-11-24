<script setup>
import { computed, markRaw, ref, onMounted } from "vue";
import { getUserRoleOfLocalStorage } from "@/authService";
import MyProfile from "./MyProfile.vue";
import ProjectsView from "@/views/ProjectsView.vue";
import UserWithdrawalRequests from "./UserWithdrawalRequests.vue";
import UsersView from "@/views/UsersView.vue";
import MineralsView from "@/views/MineralsView.vue";
import ProjectsUserView from "@/views/ProjectsUserView.vue";
import InvestmentsUserView from "@/views/InvestmentsUserView.vue";
import SettingsLanding from "./SettingsLanding.vue";
import UserSummary from "./UserSummary.vue";
import axios from "axios";
import Balances from "./Balances.vue";
import ReportClienteView from "@/views/ReportClienteView.vue";
import AdminReportView from "@/views/AdminReportView.vue";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Applications from "./Applications.vue";
import WebResources from "./WebResources.vue";
import Banner from "./Banner.vue";

const baseURL = `${import.meta.env.VITE_API_URL}/site-setting`;

const settings = ref([]);

onMounted(() => {
  getSettings();
});

const getSettings = async () => {
  try {
    const response = await axios.get(baseURL);
    settings.value = response.data[0];
    console.log("Setting:", settings.value);
  } catch (error) {
    console.error(error);
  }
};

const activeComponent = ref(markRaw(MyProfile));
const activeLink = ref("Mi Perfil");

const showComponent = (componentName, linkName) => {
  console.log("Cambiando componente:", componentName, "Nombre:", linkName);
  activeComponent.value = markRaw(componentName);
  activeLink.value = linkName;
};

const componentslinks = computed(() => {
  const userRole = getUserRoleOfLocalStorage();
  let links = [
    { name: "Web", component: WebResources },
    { name: "Inicio", component: UserSummary },
  ];
  if (userRole == "super_user" || userRole == "admin") {
    links.push({
      name: "Usuarios",
      component: UsersView,
      isDividerWithTitle: false,
    });
    links.push({
      name: "Proyectos",
      component: ProjectsView,
      isDividerWithTitle: false,
    });
    links.push({
      name: "Minerales",
      component: MineralsView,
      isDividerWithTitle: false,
    });
    links.push({
      name: "Solicitudes",
      component: Applications,
      isDividerWithTitle: false,
    });
    links.push({
      name: "Reportes",
      component: AdminReportView,
      isDividerWithTitle: false,
    });
    //links.push({ name: "Reportes", component: AnalysisAndReportsView });
    //links.push({ name: "Finanzas", component: FinanceView, divider: true });
    links.push({
      name: "Ajustes de la Web",
      component: SettingsLanding,
      isDividerWithTitle: false,
    });
  } else if (userRole == "client") {
    links.push({
      name: "Balances",
      component: Balances,
      isDividerWithTitle: false,
    });
    links.push({
      name: "Inversiones",
      component: InvestmentsUserView,
      isDividerWithTitle: false,
    });
    links.push({
      name: "Proyectos",
      component: ProjectsUserView,
      isDividerWithTitle: false,
    });
    links.push({
      name: "Solicitudes de Retiro",
      component: UserWithdrawalRequests,
      isDividerWithTitle: false,
    });
    links.push({
      name: "Reporte de Inversiones",
      component: ReportClienteView,
      isDividerWithTitle: false,
    });
  }
  return links;
});

const iconMap = {
  "Usuarios": "fas fa-users",
  Proyectos: "fas fa-cubes",
  Minerales: "fas fa-gem",
  Finanzas: "fas fa-dollar-sign",
  FAQs: "fas fa-question-circle",
  "Ajustes de la Web": "fas fa-cog",
  "Web": "fas fa-globe",
  "Mi Perfil": "fas fa-id-badge",
  Inicio: "fas fa-file-alt",
  Solicitudes: "fas fa-paper-plane",
  "Recursos Web": "fas fa-book-open",
  Balances: "fas fa-wallet",
  Inversiones: "fas fa-chart-pie",
  "Solicitudes de Retiro": "fas fa-piggy-bank",
  "Reporte de Inversiones": "fas fa-file-excel",
  Reportes: "fas fa-chart-line",
};
</script>

<template>
  <div class="content-div">
    <nav class="navbar navbar-expand-lg bg-color-navbar px-3 shadow" style="background-color: var(--secondary-color)">
      <a class="navbar-brand" href="#">
        <img :src="settings.logo" alt="Logo" class="brand me-1 navbar-logo" width="100" height="50" />
        <b>{{ settings.name }}</b>
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link to="/login" class="nav-link btn btn-primary">Cerrar Sesión</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <div class="col-md-2 sidebar shadow">
          <div v-for="(link, index) in componentslinks" :key="index">
            <div v-if="link.isDividerWithTitle" class="section-divider">
              {{ link.title }}
            </div>

            <router-link v-else-if="link.name === 'Ir a web'" :to="link.path"
              :class="{ activeSideBar: activeLink === link.name }" class="sidebar-link">
              <i :class="iconMap[link.name]" class="icon-large"></i>
              <span>{{ link.name }}</span>
            </router-link>
            <a v-else-if="link.component" href="#" @click="showComponent(link.component, link.name)"
              :class="{ activeSideBar: activeLink === link.name }" class="sidebar-link">
              <i :class="iconMap[link.name]" class="icon-large"></i>
              <span>{{ link.name }}</span>
            </a>
          </div>
        </div>

        <div class="col-md-10">
          <div class="container">
            <div class="mt-4">
              <component :is="activeComponent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-color-navbar {
  background: linear-gradient(to left, #006d72, #82afb8, #AFB0B5, #C7C4CB, #DFC7C5, #E49A5B, #EE7C3E, #922B26);

  /* background: linear-gradient(to left, #02696E, #63B2C1, #a3a3a4, #C7C4CB, #cdbaaf, #E49A5B, #EE7C3E, #A62F14); */
}

.btn-primary {
  /* background: linear-gradient(#d2d2d2, #eb7e1e, #993b04) !important; */
  background: linear-gradient(#ffa43b, #dc7234, #bb4500) !important;
  border-radius: 25px !important;
  border: 2px solid #909090 !important;
  padding-left: 15px !important;
  padding-right: 15px !important;
  /* box-shadow: inset 0 5px 1px rgba(0, 0, 0, 0.35), 0 5px 5px rgba(0, 0, 0, 0.5) !important; */
  color: #ffffff !important;
}

.btn-primary:hover {
  background: linear-gradient(#c2b6a7, #95918f, #4a4a4a) !important;
  border-radius: 25px !important;
  border: 2px solid #5e5e5e !important;
  padding-left: 15px !important;
  padding-right: 15px !important;
  color: #fffaf0 !important;
}

.content-div {
  background-color: rgb(240, 240, 240);
}

.sidebar a.activeSideBar {
  font-weight: bold;
  background: linear-gradient(#ffa43b, #dc7234, #bb4500) !important;
}

.navbar-banner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 0px;
  top: 0;
  left: 0;
}

@media (max-width: 768px) {
  .navbar-banner-container {
    display: block;
    text-align: center;
    margin-top: 0px;
  }

  .navbar-brand {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.navbar-gradient {
  background: linear-gradient(to right, white 20%, #ffad4f 70%, #0a6b61 100%);
}

.sidebar {
  color: var(--text-color);
  padding-top: 20px;
  border-right: var(--secondary-color) 1px solid;
  /* background: linear-gradient(135deg, #fdaa4a, #ea8951); */
  background: linear-gradient(135deg, rgb(201, 198, 195), #dcd8d8);
}

.sidebar a {
  color: var(--text-color);
  text-decoration: none;
  display: block;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 5px;
}

.sidebar a:hover {
  background: linear-gradient(#ece3d8, #c1bbb8, #8e8d8d) !important;
  border-radius: 25px;
}

.divider-with-title {
  position: relative;
  text-align: center;
  margin: 15px 0;
}

.divider-with-title hr {
  margin: 0;
}

.divider-title {
  position: relative;
  background: white;
  padding: 0 10px;
  color: #6c757d;
  font-size: 0.9em;
}

.simple-divider {
  text-align: center;
  color: #6c757d;
  margin: 15px 0;
  font-size: 0.9em;
}

.section-divider {
  text-align: center;
  color: #2c3e50;
  margin: 20px 0;
  font-weight: 600;
  text-transform: uppercase;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
  font-size: 0.9em;
  letter-spacing: 1px;
}

.icon-large {
  font-size: 3rem;
}

.icon-perfil {
  font-size: 2rem;
}

.perfil-icon-container {
  background-color: #ffffff;
  color: black;
  border-radius: 50%;
}

.perfil-icon-container:hover {
  background-color: #d66d26;
  color: rgb(255, 255, 255);
  border-radius: 50%;
}

.sidebar-link {
  display: flex !important;
  flex-direction: column !important;
  align-items: center;
}

.navbar-logo {
  width: 100px;
  height: 50px;
  object-fit: contain;
  border-radius: 70px;
  transition: transform 0.3s ease;
}

@media (max-width: 480px) {
  .navbar-logo {
    width: 80px;
    height: 40px;
  }
}
</style>