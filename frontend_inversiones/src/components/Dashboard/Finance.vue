<script setup>
import BarsGraphic from './BarsGraphic.vue';

const flowData = {
  labels: ['Ingresos Totales', 'Egresos Totales'],
  datasets: [
    {
      label: 'Flujo de Efectivo',
      data: [150000, 50000],
      backgroundColor: ['#4CAF50', '#F44336'],
    },
  ],
};
</script>

<template>
    <div>
        <h2>-Estado Financiero</h2> 
        <br>
        <BarsGraphic
             :chartData="flowData" 
             chartLabel="Flujo de Efectivo " />
        <p>Flujo de efectivo Neto: <strong>{{ flowData.datasets[0].data[0] - flowData.datasets[0].data[1] }} Bs.</strong></p>
        <p>Estado de ingresos: xxxxx</p>
        <p>Pagos pendientes: xxxxx</p>
        <br>
        <h2>-Ganancias por Proyecto</h2>
        <p>Rendimiento econimico de cada proyecto: xxxxx</p>
        <br>
        <h2>-Control de Fondos</h2>
        <p>Fondos disponibles</p>
        <p>Fondos asignados a cada proyecto</p>
    </div>
</template>

<style scoped>
</style>