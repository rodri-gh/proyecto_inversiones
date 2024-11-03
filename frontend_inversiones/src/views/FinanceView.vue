<script setup>
import { getHeaderRequest } from '@/authService';
import BarsGraphic from '@/components/BarsGraphic.vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const header = getHeaderRequest();
const baseUrl = 'http://localhost:3000/analysisReport/cash-flow'
const cashFlow = ref([]);

const flowData = ref({
  labels: [],
  datasets: [
    {
      label: '',
      data: [],
      backgroundColor: [],
    },
  ],
});

onMounted( async () => {
    getCashFlow();
})

const getCashFlow = async () => {
    try { 
        const response = await axios.get(baseUrl, header);
        cashFlow.value = response.data.data;
        const total_expenses = cashFlow.value[0].total_expenses;
        const total_income = cashFlow.value[0].total_income;
        console.log(cashFlow.value);
        flowData.value = {
            labels: ['Ingresos Totales', 'Egresos Totales'],
            datasets: [
                {
                label: 'Flujo de Efectivo',
                data: [total_income, total_expenses],
                backgroundColor: ['#4CAF50', '#F44336'],
                },
            ],
        };
    } catch (e ) {
        console.error(e); 
    }
}
</script>

<template>
    <div class="view-container">
        <h2 class="text-center">Estado Financiero</h2> 
        <div class="chart m-5">
            <BarsGraphic
             :chartData="flowData" 
             chartLabel="Flujo de Efectivo " />
             <div v-for="item in cashFlow" 
                :key="item"
             >
                <p>Flujo de efectivo Neto: <strong>{{ item.total_income - item.total_expenses }} Bs.</strong></p>
                <br>
                <p>Ingresos de inversiones: {{ item.total_investments }} Bs.</p>
                <p>Egresos de movimientos: {{ item.total_movements_expense }} Bs.</p>
                <p>Ingresos de movimientos: {{ item.total_movements_income }} Bs.</p>
                <p>Egresos de Operacion: {{ item.total_operating_expenses }} Bs.</p>
                <hr>
                <p>Total Ingresos: {{ item.total_income }} Bs.</p>
                <p>Total Egresos: {{ item.total_expenses }} Bs.</p>
             </div>
             <br>
             <h4>Estado de Resultados</h4>
             <br>
             <h4>Pagos pendientes</h4>
             <br>
        </div>
        <h2 class="text-center">Ganancias por Proyecto</h2>
        <div class="m-5">
            <p>- Rendimiento econimico de cada proyecto</p>
        </div>
        <h2 class="text-center">Control de Fondos</h2>
        <div class="m-5">
            <p>-Fondos disponibles</p>
            <p>-Fondos asignados a cada proyecto</p>
        </div>
    </div>
</template>

<style scoped>
.view-container { 
    padding: 10%;
}
</style>