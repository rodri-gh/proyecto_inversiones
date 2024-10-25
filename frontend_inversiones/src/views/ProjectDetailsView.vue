<template>
  <div class="row">
    <div class="col-md-6">
      <h3>Minerales del proyecto</h3>
      <ProjectMineral :idProjectMineral="idProject" />
    </div>

    <div class="col-md-6">
      <h3>Contratos</h3>
    </div>

    <div class="col-md-6">
      <h3>Inversores</h3>
      <p>mostrar todos los inversores con el monto invertido</p>
    </div>

    <div class="col-md-6">
      <h3>Gastos Operativos</h3>
      <OperatingExpenses :idProject="idProject" />
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
import ProjectMineral from "@/components/ProjectMineral.vue";
import OperatingExpenses from "@/components/OperatingExpenses.vue";

const route = useRoute();
const idProject = ref(route.params.id);

const project = ref({});
const urlProject = "http://localhost:3000/projects/";

const operatingExpenses = ref({});
const urlOperatingExpenses = "http://localhost:3000/operatingexpenses/";

onMounted(() => {
  getProject();
  getOperatingExpenses();
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
</script>

<style  scoped>
</style>