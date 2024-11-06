<template>
  <div class="row config-container">
    <div class="d-flex flex-column justify-content-center 
      align-items-center">

      <div class="m-5">
        <h3>Minerales del proyecto</h3>
        <ProjectMineral :idProjectMineral="idProject" />
      </div>

      <div class="m-5">
        <h3>Contratos del Poyecto</h3>
      </div>

      <div class="m-5">
        <h3>Inversores del Proyecto</h3>
        <Investments :idProjectInvestment="idProject" />
      </div>

      <div class="m-5">
        <h3>Gastos Operativos del Proyecto</h3>
        <OperatingExpenses :idProject="idProject" />
      </div>

      <div>
        <h3>Linea de tiempo Del proyecto</h3>
        <TimeLine :idProject="idProject" />
      </div>

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
import { getHeaderRequest } from "@/authService";

const route = useRoute();
const idProject = ref(route.params.id);

const project = ref({});
const urlProject = "http://localhost:3000/project/";

const operatingExpenses = ref({});
const urlOperatingExpenses = "http://localhost:3000/operating-expenses/";

const investments = ref({});
const urlInvestments = "http://localhost:3000/investment/";

const header = getHeaderRequest();

onMounted(() => {
  getProject();
  getOperatingExpenses();
  getInvestments();
  console.log(idProject);
});

const getProject = async () => {
  try {
    const data = await axios.get(urlProject + idProject.value, header);
    project.value = data.data;
    console.log(project.value);
  } catch (error) {
    console.error(error);
  }
};

const getOperatingExpenses = async () => {
  try {
    const data = await axios.get(urlOperatingExpenses + idProject.value, header);
    operatingExpenses.value = data.data;
    console.log(operatingExpenses.value);
  } catch (error) {
    console.error(error);
  }
};

const getInvestments = async () => {
  try{
    const data = await axios.get(urlInvestments + idProject.value, header);
    investments.value = data.data;
    console.log(investments.value);
  }catch (error) {
    console.error(error);
  }
}
</script>

<style  scoped>
.config-container { 
  margin: 4%;
}
</style>