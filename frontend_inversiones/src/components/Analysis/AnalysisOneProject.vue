<script setup>
import { getHeaderRequest, getPhaseOfProject } from '@/authService';
import axios from 'axios';
import { onMounted, ref } from 'vue';



const header = getHeaderRequest();
const phasesOfFormat = getPhaseOfProject();
const baseUrl = 'http://localhost:3000/project-timeline/project/'
const percentageOfProject = ref(0.0);
const phaseOfProject = ref('');
const baseUrlAnalisiReport = 'http://localhost:3000/analysis-report/totalInvestmentVsReturn/'
const baseUrlOperatingExp = 'http://localhost:3000/operating-expenses/project/'
const ROI = ref(0);
const operatingExpe = ref(0);

const props = defineProps({
  idProject: {
    type: String,
    required: true
  }
});

onMounted(() => { 
  getAnalisysOneProject(); 
  getInvestmentsVsReturn();
  getOperatingExpenses(); 
})

const getAnalisysOneProject = async () => { 
  try { 
    const projectTimelinesData = await axios.get(baseUrl + '1', header); 
    console.log(projectTimelinesData);
    console.log(phasesOfFormat);

    for (const item of projectTimelinesData.data) { 
      console.log(item.phase);
      
      // Usa un nombre diferente en el callback de find
      const phase1 = phasesOfFormat.find(phase => phase.key === item.phase);
      console.log(phase1);
      console.log(percentageOfProject.value);

      if (phase1.value > percentageOfProject.value) {
        percentageOfProject.value = phase1.value;
        phaseOfProject.value = item.phase;
      }
    }
  } catch (e) { 
    console.error(e);
  }
};

const getInvestmentsVsReturn = async () => {
  try { 
    const response = await axios.get(baseUrlAnalisiReport + '1', header); 
    console.log(response.data);
    const data = response.data[0];
    const investments = parseFloat(data.totalInvestmentsAmount);
    console.log(investments);
    const transactionIncomes = parseFloat(data.totalTransactionsIncome);
    console.log(transactionIncomes);
    const operatingExpense = data.totalOperatingExpenses;
    console.log(operatingExpense);
    const investmentsPlusOperting = investments + operatingExpense;
    console.log(investmentsPlusOperting);
    if (investmentsPlusOperting !== 0) {
      ROI.value = ((transactionIncomes - investmentsPlusOperting) / investmentsPlusOperting) * 100;
    } else {
      ROI.value = 0;
    }
    console.log(ROI.value)
  } catch (e) { 
    console.error(e);
  }
};

const getOperatingExpenses = async () => {
  try{
    const response = await axios.get(baseUrlOperatingExp+'1', header); 
    console.log(response.data);
    operatingExpe.value = response.data[0].expenses;
  } catch(e) { 
    console.error(e);
  }
}

</script>

<template>
  <div class="m-5">
    <h3>Análisis de Proyectos</h3>
    <div class="m-5">
      <h6>Estado de avance del projecto</h6>
      <p>{{ phaseOfProject }}</p>
      <p>{{ percentageOfProject }}  %</p>
      <p>los hitos alcanzados pueden ser los phases cumplidos</p>
    </div>
    <div class="m-5">
      <h6>Análisis Financiero de los Proyectos</h6>
      <p>Inversión total vs. retorno (Rentabilidad):</p>
      <p> ---ROI retorno de inversion</p>
      <p>{{ ROI }} %</p>
      <p>---Costos operativos</p>
      <p>{{ operatingExpe }}</p>
      <p>---Proyecciones</p>
    </div>
  </div>
</template>

<style scoped> 
</style>