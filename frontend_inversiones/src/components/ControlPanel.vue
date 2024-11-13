<script setup>
import { computed, markRaw, ref } from "vue";
import { getUserRoleOfLocalStorage } from "@/authService";
import MyProfile from "./MyProfile.vue";
import ProjectsView from "@/views/ProjectsView.vue";
import InvestmentsOfUser from "./InvestmentsOfUser.vue";
import UserWithdrawalRequests from "./UserWithdrawalRequests.vue";
import WithdrawalRequestsView from "@/views/WithdrawalRequestsView.vue";
import ConfigurationAndSecurity from "./Dashboard/ConfigurationAndSecurity.vue";
import Start from "./Dashboard/Start.vue";
import ContactView from "@/views/ContactView.vue";
import UsersView from "@/views/UsersView.vue";
import MineralsView from "@/views/MineralsView.vue";
import CategoryPostView from "@/views/CategoryPostView.vue";
import PostsView from "../views/PostsView.vue";
import FaqAdmin from "../components/FaqAdmin.vue";
import FinanceView from "@/views/FinanceView.vue";
import AnalysisAndReportsView from "@/views/AnalysisAndReportsView.vue";
import ProjectsUserView from "@/views/ProjectsUserView.vue";

const activeComponent = ref(markRaw(MyProfile));
const activeLink = ref("Mi Perfil");

const showComponent = (componentName, linkName) => {
  activeComponent.value = markRaw(componentName);
  activeLink.value = linkName;
};

const componentslinks = computed(() => {
  const userRole = getUserRoleOfLocalStorage();
  let links = [
    { name: "Ir a web", path: "/", divider: true, isDividerWithTitle: false },
    {
      divider: true,
      title: "Menu Principal",
      isDividerWithTitle: true,
    },
    { name: "Mi Perfil", component: MyProfile, isDividerWithTitle: false },
  ];
  if (userRole == "super_user" || userRole == "admin") {
    links.push({ name: "Inicio", component: Start, isDividerWithTitle: false });
    links.push({
      name: "Gestion de Usuarios",
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
    /* links.push({
      name: "Solicitudes de retiro",
      component: WithdrawalRequestsView,
      isDividerWithTitle: false,
    }); */

    links.push({
      name: "Responder Contacto",
      component: ContactView,
      isDividerWithTitle: false,
    });
    links.push({ name: "Reportes", component: AnalysisAndReportsView });
    links.push({ name: "Finanzas", component: FinanceView, divider: true });
    links.push({ name: "Categorias Post", component: CategoryPostView });
    links.push({ name: "Posts", component: PostsView });
    links.push({ name: "FAQs", component: FaqAdmin });

    links.push({
      divider: true,
      title: "Administrar Web",
      isDividerWithTitle: true,
    });
    links.push({
      name: "Categorias Post",
      component: CategoryPostView,
      isDividerWithTitle: false,
    });
    links.push({
      name: "Posts",
      component: PostsView,
      isDividerWithTitle: false,
    });
    links.push({
      name: "FAQs",
      component: FaqAdmin,
      isDividerWithTitle: false,
    });

    /*     links.push({
      name: "Administrar Web",
      component: ContactView,
      isDividerWithTitle: false,
    }); */
  } else if (userRole == "client") {
    links.push({
      name: "Projectos",
      component: ProjectsUserView,
      isDividerWithTitle: false,
    });
    links.push({
      name: "Inversiones",
      component: InvestmentsOfUser,
      isDividerWithTitle: false,
    });
    links.push({
      name: "Solicitudes de Retiro",
      component: UserWithdrawalRequests,
      isDividerWithTitle: false,
    });
  }
  return links;
});
</script>

<template>
  <div>
    <nav
      class="navbar navbar-expand-lg navbar-light px-3"
      style="background-color: var(--secondary-color)"
    >
      <a class="navbar-brand" href="#">
        <img
          src="https://banner2.cleanpng.com/20180331/hre/avishui7k.webp"
          alt="Logo"
          class="brand"
        />
        <b>Minerales</b>
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link to="/login" class="nav-link btn btn-primary"
              >Cerrar Sesión</router-link
            >
          </li>
        </ul>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <div class="col-md-2 sidebar">
          <div v-for="(link, index) in componentslinks" :key="index">
            <div v-if="link.isDividerWithTitle" class="section-divider">
              {{ link.title }}
            </div>

            <router-link
              v-else-if="link.name === 'Ir a web'"
              :to="link.path"
              :class="{ activeSideBar: activeLink === link.name }"
            >
              {{ link.name }}
            </router-link>
            <a
              v-else-if="link.component"
              href="#"
              @click="showComponent(link.component, link.name)"
              :class="{ activeSideBar: activeLink === link.name }"
            >
              {{ link.name }}
            </a>
          </div>
        </div>

        <div class="col-md-10">
          <div class="container">
            <div class="d-flex justify-content-between align-items-center mt-4">
              <component :is="activeComponent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar a.activeSideBar {
  font-weight: bold;
  color: var(--primary-color);
}

.sidebar {
  background-color: #f3f3f3;
  color: var(--text-color);
  min-height: 100vh;
  padding-top: 20px;
  border-right: var(--secondary-color) 1px solid;
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
  background-color: #e0e0e0;
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
</style>