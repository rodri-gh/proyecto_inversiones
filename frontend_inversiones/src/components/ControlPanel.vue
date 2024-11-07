<script setup>
import { computed, markRaw, ref } from "vue";
import { getUserRoleOfLocalStorage } from "@/authService";
import MyProfile from "./MyProfile.vue";
import ProjectsView from "@/views/ProjectsView.vue";
import InvestmentsOfUser from "./InvestmentsOfUser.vue";
import UserWithdrawalRequests from "./UserWithdrawalRequests.vue";
import UserViewCopy from "@/views/UserViewCopy.vue";
import WithdrawalRequestsView from "@/views/WithdrawalRequestsView.vue";
import ConfigurationAndSecurity from "./Dashboard/ConfigurationAndSecurity.vue";
import Start from "./Dashboard/Start.vue";
import ContactView from "@/views/ContactView.vue";
import UsersView from "@/views/UsersView.vue";

const activeComponent = ref(markRaw(MyProfile));
const activeLink = ref("Mi Perfil");

const showComponent = (componentName, linkName) => {
  activeComponent.value = markRaw(componentName);
  activeLink.value = linkName;
};

const componentslinks = computed(() => {
  const userRole = getUserRoleOfLocalStorage();
  let links = [{ name: "Mi Perfil", component: MyProfile }];
  if (userRole == "super_user" || userRole == "admin") {
    links.push({ name: "Inicio", component: Start });
    links.push({ name: "Gestion de Usuarios", component: UsersView });
    links.push({ name: "Projectos", component: ProjectsView });
    links.push({ name: "Retiro de Fondos", component: WithdrawalRequestsView });
    links.push({ name: "Responder Contacto", component: ContactView });
  } else if (userRole == "client") {
    links.push({ name: "Projectos", component: ProjectsView });
    links.push({ name: "Inversiones", component: InvestmentsOfUser });
    links.push({
      name: "Solicitudes de Retiro",
      component: UserWithdrawalRequests,
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
        <!-- Barra lateral -->
        <div class="col-md-2 sidebar">
          <a
            v-for="(item, index) in componentslinks"
            :key="index"
            @click="() => showComponent(item.component, item.name)"
            :class="{ active: activeLink === item.name }"
          >
            {{ item.name }}
          </a>
        </div>
        <!-- Contenido principal -->
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
.sidebar a.active {
  font-weight: bold;
  color: var(--primary-color);
}

/* Estilos de la barra lateral */
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
}
.sidebar a:hover {
  background-color: #e0e0e0;
  border-radius: 25px;
}
</style>