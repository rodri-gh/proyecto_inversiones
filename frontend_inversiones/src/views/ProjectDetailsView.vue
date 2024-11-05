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
      <Investments :idProjectInvestment="idProject" />
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
import Investments from "@/components/Investments.vue";

const route = useRoute();
const idProject = ref(route.params.id);

const project = ref({});
const urlProject = "http://localhost:3000/project/";

const operatingExpenses = ref({});
const urlOperatingExpenses = "http://localhost:3000/operating_expenses/";

const investments = ref({});
const urlInvestments = "http://localhost:3000/investment/";

onMounted(() => {
  getProject();
  getOperatingExpenses();
  getInvestments();
  console.log(idProject);
});

const getProject = async () => {
  try {
    const { data } = await axios.get(urlProject + idProject.value);
    project.value = data;
    console.log(project.value);
  } catch (error) {
    console.error(error);
  }
};

const getOperatingExpenses = async () => {
  try {
    const { data } = await axios.get(urlOperatingExpenses + idProject.value);
    operatingExpenses.value = data;
    console.log(operatingExpenses.value);
  } catch (error) {
    console.error(error);
  }
};

const getInvestments = async () => {
  try{
    const { data } = await axios.get(urlInvestments + idProject.value);
    investments.value = data;
    console.log(investments.value);
  }catch (error) {
    console.error(error);
  }
}
</script>

<style  scoped>
</style>