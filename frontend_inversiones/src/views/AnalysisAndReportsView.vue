<script setup>
import { onMounted, ref } from "vue";
import BarsGraphic from "@/components/BarsGraphic.vue";
import axios from "axios";
import { getHeaderRequest } from "@/authService";
import AnalysisOneProject from "@/components/Analysis/AnalysisOneProject.vue";

const investmentData = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [],
    },
  ],
});

const investmentFromProjets = ref([]);

const generateColors = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const hue = ((i * 360) / numColors + Math.random() * 30) % 360;
    const saturation = 70 + Math.random() * 30;
    const lightness = 40 + Math.random() * 20;
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
};

onMounted(async () => {
  try {
    const baseUrl = `${
      import.meta.env.VITE_API_URL
    }/analysis-report/projectsStatus`;
    const header = getHeaderRequest();
    const response = await axios.get(baseUrl, header);
    console.log(response);
    const results = response.data;
    console.log(results);
    investmentFromProjets.value = results;
    const projectNames = results.map((result) => result.project.name);
    const totalInvestmentData = results.map((result) => result.amount);
    const colors = generateColors(projectNames.length);
    investmentData.value = {
      labels: projectNames,
      datasets: [
        {
          label: "Total Investment Bs",
          data: totalInvestmentData,
          backgroundColor: colors,
        },
      ],
    };
  } catch (e) {
    console.error(e);
  }
});
</script>

<template>
  <div class="view-container">
    <div class="chart">
      <!--conponentes-->
      <BarsGraphic
        :chartData="investmentData"
        chartLabel="Estado de las Inversiones en Proyectos "
      />
      <div v-for="item in investmentFromProjets" :key="item">
        <p>
          <strong>{{ item.project.name }}:</strong> {{ item.amount }} Bs
        </p>
      </div>
    </div>
    <div class="chart">
      <!--conponentes-->
    </div>
    <AnalysisOneProject />
    <br />
    <p>Reportes Financieros</p>
    <p>Reportes de Usuarios</p>
  </div>
</template>

<style scoped>
.view-container {
  padding: 10%;
}
</style>