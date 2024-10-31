<script setup>
import { ref } from 'vue';
import MyProfile from './MyProfile.vue';
import ProjectsView from '@/views/ProjectsView.vue';
import InvestmentsOfUser from './InvestmentsOfUser.vue';
import WithdrawalRequestsView from '@/views/WithdrawalRequestsView.vue';

const activeComponent = ref(MyProfile);
const showComponent = (componentName) => { 
  activeComponent.value = componentName;
};

</script>

<template>
  <div class="row">
    <div class="col-3 vh-100 panel-control 
      d-flex flex-column justify-content-center 
      align-items-center"
      >
      <a @click="showComponent(MyProfile)">Mi Perfil</a>
      <a @click="showComponent(ProjectsView)">Proyectos</a>
      <a @click="showComponent(InvestmentsOfUser)">Inversiones</a>
      <a @click="showComponent(WithdrawalRequestsView)">Solicitudes de Retiro</a>
    </div>
    <div class="col-9 vh-100 d-flex flex-column justify-content-center 
      align-items-center">
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
</style>