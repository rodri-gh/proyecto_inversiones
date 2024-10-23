<template>
  <div>
    <h3>Detalles del proyecto</h3>
    <h5><strong>Nombre:</strong> {{ project.name }}</h5>
    <p><strong>Descripcion:</strong> {{ project.description }}</p>
    <p v-if="project.status == 'open'"><strong>Estado:</strong> Abierto</p>
    <p v-else-if="project.status == 'closed'">
      <strong>Estado:</strong> Cerrado
    </p>
    <p v-else><strong>Estado:</strong> En curso</p>
    <p><strong>Meta de recaudacion:</strong> {{ project.investment_goal }}</p>
    <p>
      <strong>Porcentaje de ganancia:</strong> {{ project.profit_percentage }}
    </p>
    <p><strong>Fecha de creacion:</strong> {{ project.created_at }}</p>
    <h1>
      Esto no es un diseño, pero ya aqui pueden usar el id de proyecto para
      crear gastos operativos, asignar minerales al proyecto, etc, clientes,
      contratos, inversiones, todo lo que tiene que ver con proyectos desde la
      vista del admin
    </h1>
    <div>
      <h3>Gastos Operativos</h3>
      <OperatingExpenses :idProject="idProject" />
    </div>
    <div>
      <h3>Inversiones</h3>
      <Investments :idProject="idProject" />
    </div>
    <div>
      <h3>Linea de tiempo</h3>
      <TimeLine :idProject="idProject" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import TimeLine from "@/components/TimeLine.vue";
import OperatingExpenses from "@/components/OperatingExpenses.vue";
import Investments from "@/components/Investments.vue";

const route = useRoute();
const idProject = ref(route.params.id);

const project = ref({});
const urlProject = "http://localhost:3000/projects/";

const investments = ref({});
const urlInvestments = "http://localhost:3000/investments/";

const operatingExpenses = ref({});
const urlOperatingExpenses = "http://localhost:3000/operatingexpenses/";

onMounted(() => {
  getProject();
  getOperatingExpenses();
  getInvestments();
  console.log(idProject);
});

const getProject = async () => {
  try {
    const { data } = await axios.get(urlProject + idProject.value);
    project.value = data.data;
    console.log(project.value);
  } catch (error) {
    console.error(error);
  }
};

const getOperatingExpenses = async () => {
  try {
    const { data } = await axios.get(urlOperatingExpenses + idProject.value);
    operatingExpenses.value = data.data;
    console.log(operatingExpenses.value);
  } catch (error) {
    console.error(error);
  }
};

const getInvestments = async () => {
  try {
    const { data } = await axios.get(urlInvestments + idProject.value);
    investments.value = data.data;
    console.log(investments.value);
  } catch (error) {
    console.error(error);
  }
};
</script>

<style  scoped>
</style>