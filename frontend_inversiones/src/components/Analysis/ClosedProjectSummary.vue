<script setup>
import { getHeaderRequest } from "@/authService";
import axios from "axios";
import { ref } from "vue";
import { onMounted } from "vue";
import { formatDate } from "@/router/viewFormat";
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ProjectMineral from "../ProjectMineral.vue";
import Investments from "../Investments.vue";
import { Bar } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
);

const project = ref({});
const baseURL = `${import.meta.env.VITE_API_URL}/`;
const header = getHeaderRequest();

const props = defineProps({
  idProject: {
    type: Number,
    required: true,
  },
});

const cumplimientoMetaData = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: ["#4CAF50", "#F44336"],
      hoverOffset: 4,
    },
  ],
});

const gananciaData = ref({
  labels: [],
  datasets: [
    {
      label: "Ganancia inversion",
      data: [],
      backgroundColor: "#4E8E8E",
      borderColor: "#4E8E8E",
      borderWidth: 1,
    },
    {
      label: "Promedio de ganancia",
      data: [],
      backgroundColor: "#D3D3D3",
      borderColor: "#D3D3D3",
      borderWidth: 1,
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

onMounted(() => {
  console.log(props.idProject);
  getDetailsProject();
});

const getDetailsProject = async () => {
  try {
    const response = await axios.get(
      baseURL + "project/" + props.idProject,
      header
    );
    project.value = response.data;
    addDetailsProyectobject();
    console.log(project.value);
  } catch (e) {
    console.log(e);
  }
};

const addDetailsProyectobject = () => {
  if (Array.isArray(project.value.investments)) {
    const totalInvestment = project.value.investments.reduce((acc, item) => {
      const amount = parseFloat(item.amount);
      return acc + (isNaN(amount) ? 0 : amount);
    }, 0);

    project.value.totalInvestment = totalInvestment;
  } else {
    console.error("El formato de inversiones no es válido o no existe.");
    project.value.totalInvestment = 0;
  }
  if (Array.isArray(project.value.operatingExpenses)) {
    const totalExpenses = project.value.operatingExpenses.reduce(
      (acc, item) => {
        const amount = parseFloat(item.expenses);
        return acc + (isNaN(amount) ? 0 : amount);
      },
      0
    );
    project.value.totalExpenses = totalExpenses;
  } else {
    console.error("El formato de inversiones no es válido o no existe.");
    project.value.totalExpenses = 0;
  }
  if (Array.isArray(project.value.projectMinerals)) {
    const totalSale = project.value.projectMinerals.reduce((acc, item) => {
      const amount = parseFloat(item.salePrice) * parseFloat(item.weightOunces);
      return acc + (isNaN(amount) ? 0 : amount);
    }, 0);

    project.value.totalSale = totalSale;
  } else {
    console.error("El formato de inversiones no es válido o no existe.");
    project.value.totalSale = 0;
  }

  if (Array.isArray(project.value.investments)) {
    const earnings = project.value.investments.map((investment) =>
      parseFloat(investment.earnings)
    );
    const totalearnings = earnings.reduce((acc, amount) => acc + amount, 0);
    const averageEarnings = totalearnings / earnings.length || 0;
    const repeatedAverages = Array(earnings.length).fill(averageEarnings);
    project.value.earnings = earnings;
    project.value.repeatedAverages = repeatedAverages;
  } else {
    console.error("El formato de inversiones no es válido o no existe.");
  }
  const netProfit = project.value.totalSale - project.value.totalExpenses;
  const reuturnInvestment = (netProfit / project.value.totalInvestment) * 100;
  project.value.netProfit = netProfit;
  project.value.reuturnInvestment = reuturnInvestment;

  cumplimientoMetaData.value = {
    labels: ["Cumplido", "No Cumplido"],
    datasets: [
      {
        data: [
          project.value.netProfit,
          calculatePerformance(
            parseFloat(project.value.investmentGoal) *
              parseFloat(project.value.profitPercentage / 100) -
              project.value.netProfit
          ),
        ],
        backgroundColor: ["#4CAF50", "#F44336"],
        hoverOffset: 4,
      },
    ],
  };
  const users = project.value.investments.map(
    (investment) => investment.user.name
  );
  console.log(users);
  gananciaData.value = {
    labels: users,
    datasets: [
      {
        label: "Ganancia inversion",
        data: Object.values(project.value.earnings),
        backgroundColor: "#4E8E8E",
        borderColor: "#4E8E8E",
        borderWidth: 1,
      },
      {
        label: "Promedio de ganancia",
        data: Object.values(project.value.repeatedAverages),
        backgroundColor: "#D3D3D3",
        borderColor: "#D3D3D3",
        borderWidth: 1,
      },
    ],
  };
};

const calculatePerformance = (number) => {
  if (number <= 0) {
    return 0;
  }
  return number;
};
</script>

<template>
  <div>
    <div class="row mt-4">
      <h3>Resumen del Proyecto : {{ project.name }}</h3>
      <br /><br />
      <div class="col-12 col-md-6 col-lg-5 mb-4">
        <div class="detail-item shadow">
          <div>
            <h6><i class="bi bi-bar-chart"></i> Cumplimiento de la meta</h6>
          </div>
          <div class="chart-container">
            <Doughnut :data="cumplimientoMetaData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-6 mb-4">
        <div class="detail-item shadow">
          <div>
            <h6><i class="bi bi-bar-chart"></i> Ganancia Total y Promedio</h6>
          </div>
          <div class="chart-container">
            <Bar :data="gananciaData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-5 mb-4">
        <div class="detail-item shadow">
          <h4>Detalles del Proyecto</h4>
          <ul>
            <li>
              <strong>Duración:</strong> {{ formatDate(project.startDate) }} -
              {{ formatDate(project.endDate) }}
            </li>
            <li>
              <strong>Inversión Total:</strong> ${{ project.totalInvestment }}
            </li>
            <li>
              <strong>Rentabilidad del Proyecto:</strong>
              {{ project.reuturnInvestment }}%
            </li>
            <li>
              <strong>Ganancia total del Proyecto:</strong>
              {{ project.netProfit }}
            </li>
            <li>
              <strong>Estado:</strong>
              {{ project.status === "closed" ? "Cerrado" : project.status }}
            </li>
            <li>
              <strong>Porcentage de Rendimiento Estimado:</strong>
              {{ project.profitPercentage }}%
            </li>
          </ul>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-6 mb-4">
        <div class="detail-item shadow">
          <h4>Inversiones y Gastos</h4>
          <div class="investment-summary">
            <p>
              <strong>Total Inversiones:</strong> ${{ project.totalInvestment }}
            </p>
            <p>
              <strong>Gastos Operativos Totales:</strong> ${{
                project.totalExpenses
              }}
            </p>
          </div>
        </div>
      </div>
      <br /><br /><br /><br />
      <div class="summary-section">
        <ProjectMineral :idProjectMineral="idProject" />
      </div>

      <div class="summary-section">
        <Investments :idProjectInvestment="idProject" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
.summary-section {
  margin-bottom: 20px;
}

.investment-summary p {
  margin: 5px 0;
}
.detail-item {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 10px;
}
</style>