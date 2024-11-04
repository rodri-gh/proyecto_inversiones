<script setup>
import { computed, markRaw, ref } from 'vue';
import { getUserRoleOfLocalStorage } from '@/authService';
import MyProfile from './MyProfile.vue';
import ProjectsView from '@/views/ProjectsView.vue';
import InvestmentsOfUser from './InvestmentsOfUser.vue';
import UserWithdrawalRequests from './UserWithdrawalRequests.vue';
import UsersView from '@/views/UsersView.vue';
import WithdrawalRequestsView from '@/views/WithdrawalRequestsView.vue';
import ConfigurationAndSecurity from './Dashboard/ConfigurationAndSecurity.vue';
import Finance from './Dashboard/Finance.vue';
import AnalysisAndReports from './Dashboard/AnalysisAndReports.vue';
import Start from './Dashboard/Start.vue';
import ContactView from '@/views/ContactView.vue';

const activeComponent = ref(markRaw(MyProfile));
const showComponent = (componentName) => {
  activeComponent.value = markRaw(componentName);
};

const componentslinks = computed(() => {
  const userRole = getUserRoleOfLocalStorage();
  console.log(userRole);
  let links = [
    { name: 'Mi Perfil', component: MyProfile },
  ]
  if (userRole == 'super_user') {
    links.push({ name: 'Inicio', component: Start });
    links.push({ name: 'Gestion de Usuarios', component: UsersView });
    links.push({ name: 'Projectos', component: ProjectsView });
    links.push({ name: 'Finanzas', component: Finance });
    links.push({ name: 'Retiro de Fondos', component: WithdrawalRequestsView });
    links.push({ name: 'Analisis y Reportes', component: AnalysisAndReports });
    links.push({ name: 'Configuracion y Seguridad', component: ConfigurationAndSecurity });
    links.push({ name: 'Responder Contacto', component: ContactView });
  } else if (userRole == 'admin') {
    links.push({ name: 'Inicio', component: Start });
    links.push({ name: 'Gestion de Usuarios', component: ProjectsView });
    links.push({ name: 'Projectos', component: ProjectsView });
    links.push({ name: 'Finanzas', component: Finance });
    links.push({ name: 'Retiro de Fondos', component: ProjectsView });
    links.push({ name: 'Analisis y Reportes', component: AnalysisAndReports });
    links.push({ name: 'Configuracion y Seguridad', component: ConfigurationAndSecurity });
  } else if (userRole == 'client') {
    links.push({ name: 'Projectos', component: ProjectsView });
    links.push({ name: 'Inversiones', component: InvestmentsOfUser });
    links.push({ name: 'Solicitudes de Retiro', component: UserWithdrawalRequests });
    links.push({ name: 'Responder Contacto', component: ContactView });
  }
  return links;
});
</script>

<template>
  <div class="row">
    <div class="col-3 vh-100 panel-control 
      d-flex flex-column justify-content-center 
      align-items-center">
      <a v-for="(item, index) in componentslinks" :key="index" @click="showComponent(item.component)">
        {{ item.name }}
      </a>
    </div>
    <div class="col-9 d-flex flex-column justify-content-center 
      align-items-center flex-fill">
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<style scoped>
.panel-control {
  background-color: #f8f9fa;
  border-right: 1px solid #ddd;
  color: black;
}

a {
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2em;
}

a:hover {
  background-color: #df6621;
  border-radius: 60%;
}

.flex-fill {
  margin-top: 2%;
}
</style>