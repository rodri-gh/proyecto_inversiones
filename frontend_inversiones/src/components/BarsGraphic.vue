<template>
  <div>
    <h3>{{ chartLabel }}</h3>
    <Bar :data="chartData" :options="options" />
  </div>
</template>
  
<script setup>
import { Bar } from 'vue-chartjs'; 
import { Chart as ChartJS, BarElement, CategoryScale, Tooltip, Legend, LinearScale, plugins } from 'chart.js';
import { toRefs, defineProps } from 'vue'; 

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const props = defineProps({
  chartData: { type: Object, required: true },
  chartLabel: { type: String, required: true },     
});

const options = { 
  responsive: true, 
  plugins: { legend: { display: false }},
}; 
</script>
  