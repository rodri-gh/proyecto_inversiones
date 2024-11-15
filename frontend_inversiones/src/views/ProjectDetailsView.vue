<template>
  <div>
    <div v-if="statusProject === 'open' || statusProject === 'in-transit'">
      <div class="navbar-tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="selectedTab = tab"
          :class="{ active: selectedTab === tab }"
        >
          {{ tab }}
        </button>
      </div>

      <div class="tab-content mt-3">
        <div v-if="selectedTab === 'Inicio'">
          <div class="project-intro">
            <h2 class="project-title">Proyecto: {{ project.name }}</h2>
            <div class="project-image">
              <img src="@/assets/iconMineralProject.png" alt="Imagen del Proyecto" />
            </div>

            <div class="project-summary">
              <p>{{ project.description }}</p>
              <div class="project-details">
                <div class="detail-item">
                  <strong>Objetivo de Inversión:</strong> ${{ project.investmentGoal }} 
                </div>
                <div class="detail-item">
                  <strong>Estado:</strong> {{ project.status }}
                </div>
                <div class="detail-item">
                  <strong>Duración:</strong> {{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}
                </div>
                <div class="detail-item">
                  <strong>Rentabilidad Esperada:</strong> {{ project.profitPercentage }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedTab === 'Inversiones'">
          <h3>Contratos del Proyecto</h3>
          <Contract :idProject="idProject" />
          <h4>Inversiones del Proyecto</h4>
          <Investments :idProjectInvestment="idProject" />
        </div>

        <div v-if="selectedTab === 'Minerales'">
          <h3>Minerales del Proyecto</h3>
          <ProjectMineral :idProjectMineral="idProject" />
        </div>

        <div v-if="selectedTab === 'Gastos Operativos'">
          <h3>Gastos Operativos del Proyecto</h3>
          <OperatingExpenses :idProject="idProject" />
        </div>

        <div v-if="selectedTab === 'Linea de Tiempo'">
          <h3>Linea de Tiempo del Proyecto</h3>
          <TimeLine :idProject="idProject" />
        </div>
      </div>
    </div>

    <div v-else>
      El proyecto está cerrado
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { eventBus } from "@/eventBus";
import TimeLine from "@/components/TimeLine.vue";
import ProjectMineral from "@/components/ProjectMineral.vue";
import OperatingExpenses from "@/components/OperatingExpenses.vue";
import Investments from "@/components/Investments.vue";
import Contract from "@/components/Contract.vue";
import axios from "axios";
import { getHeaderRequest } from "@/authService";

const header = getHeaderRequest();

const statusProject = ref('');
const project = ref({});
const selectedTab = ref('Inicio');
const tabs = ['Inicio', 'Inversiones', 'Minerales', 'Gastos Operativos', 'Linea de Tiempo'];
 
const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  },
});

const idProject = ref(props.projectId || route.params.id);

const reloadData = () => {
  idProject.value = props.projectId;
};

const getProjectData = async () => { 
  try {
    const response = await axios.get('http://localhost:3000/project/'+props.projectId, header);
    console.log(response.data);
    statusProject.value = response.data.status;
    project.value = response.data;
    console.log(response.data);
  } catch(e) { 
    console.error(e);
  }
}

onMounted(() => {
  eventBus.on('data-updated', reloadData);
  getProjectData();
});

onUnmounted(() => {
  eventBus.off('data-updated', reloadData);
});

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};
</script>

<style scoped>
.navbar-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  border-radius: 30px;
}

.navbar-tabs button {
  padding: 10px 20px;
  border: none;
  border-radius: 30px !important;
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 5px;
}

.navbar-tabs button.active {
  background-color: #204d7c;
  border-radius: 30px;
  color: white;
}

.navbar-tabs button:hover {
  background-color: #e0e0e0;
  border-radius: 10px;
}

.tab-content {
  padding: 10px;
  border-radius: 5px;
}
.project-intro {
  padding: 10px;
  border-radius: 10px;
  background-color: #f9f9f9;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 50px;
}

.project-title {
  font-size: 2rem;
  color: #04090e;
  margin-bottom: 15px;
}

.project-summary {
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.project-details {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.detail-item {
  background-color: #e0e0e0;
  padding: 20px;
  border-radius: 50px;
  width: 200px;
  text-align: left;
}

.project-image img {
  max-width: 100%;
  border-radius: 10px;
  margin-top: 20px;
}

</style>