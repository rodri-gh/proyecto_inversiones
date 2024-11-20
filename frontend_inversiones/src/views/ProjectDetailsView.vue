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
            <h3>Proyecto: {{ project.name }}</h3>
            <div class="project-image">
              <img src="@/assets/iconMineralProject.png" alt="Imagen del Proyecto" />
            </div>

            <div class="project-summary">
              <div class="project-details">
                <div class="detail-item shadow">
                  <strong>Objetivo de Inversión:</strong> ${{ project.investmentGoal }} 
                </div>
                <div class="detail-item shadow">
                  <strong>Estado:</strong> {{ project.status }}
                </div>
                <div class="detail-item shadow">
                  <strong>Duración:</strong> {{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}
                </div>
                <div class="detail-item shadow">
                  <strong>Rentabilidad Esperada:</strong> {{ project.profitPercentage }}%
                </div>
              </div>
              <br>
              <br>
              <p><strong>Descripcion:</strong> {{ project.description }}</p>
            </div>
          </div>
        </div>

        <div v-if="selectedTab === 'Inversiones'">
          <h3>Contratos del Proyecto</h3>
          <Contract :idProject="idProject" :project="project"/>
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

    <div v-else-if="statusProject === 'closed'">
      <div class="project-summary-closed">
        <h3>Resumen del Proyecto Cerrado: {{ project.name }}</h3>
        <br>  
        <div class="summary-section">
          <h4>Detalles del Proyecto</h4>
          <ul>
            <li><strong>Duración:</strong> {{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}</li>
            <li><strong>Inversión Total:</strong> ${{ project.totalInvestment }}</li>
            <li><strong>Rentabilidad del Projecto:</strong> {{ project.actualProfitPercentage }}%</li>
            <li><strong>Estado:</strong> {{ project.status }}</li>
          </ul>
        </div>

        <div class="summary-section">
          <h4>Estadísticas de Rendimiento</h4>
          <div class="chart-container">
            <p>aqui podria agregar grafico para el porjecto</p>
            <canvas id="profitChart"></canvas>
          </div>
        </div>

        <div class="summary-section">
          <h4>Inversiones y Gastos</h4>
          <div class="investment-summary">
            <p><strong>Total Inversiones:</strong> ${{ project.totalInvestments }}</p>
            <p><strong>Gastos Operativos Totales:</strong> ${{ project.totalOperatingExpenses }}</p>
          </div>
        </div>

        <div class="summary-section">
          <h4>Minerales Extraídos</h4>
          <ProjectMineral :idProjectMineral="idProject" />
        </div>

        <div class="summary-section">
          <h4>Historial de Inversiones</h4>
          <Investments :idProjectInvestment="idProject" />
        </div>
      </div>
    </div>

    <div v-else>
      <p>El estado del proyecto no es válido.</p>
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
  }
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
  background-color: #ffffff;
  cursor: pointer;
  border-radius: 5px;
}

.navbar-tabs button.active {
  background-color: #204d7c;
  border-radius: 30px;
  color: white;
}

.navbar-tabs button:hover {
  background-color: #879dda;
  color: #04090e;
  border-radius: 10px;
}

.tab-content {
  padding: 10px;
  border-radius: 5px;
}
.project-intro {
  padding: 10px;
  text-align: center;
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
  background-color: #ffffff;
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

.project-summary-closed {
  padding: 20px;
  border-radius: 10px;
}

.summary-section {
  margin-bottom: 20px;
}

.chart-container {
  max-width: 600px;
  margin: auto;
}

.investment-summary p {
  margin: 5px 0;
}

</style>