<script setup>
import { getHeaderRequest } from '@/authService';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { formatDate } from '@/router/viewFormat';

const baseUrl = `${import.meta.env.VITE_API_URL}/`;
const header = getHeaderRequest();

const chartOptions = ref({
chart: {
    type: 'line',
},
title: {
    text: 'Tendencia de Precios',
},
xAxis: {
    categories: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
},
yAxis: {
    title: {
    text: 'Precio (USD)',
    },
},
series: [
    {
    name: 'Mineral A',
    data: [120, 135, 130, 140, 145],
    },
    {
    name: 'Mineral B',
    data: [110, 125, 120, 135, 140],
    },
],
});

onMounted(() => { 
    getMineralPricesHistory();
})

const getMineralPricesHistory = async () => { 
    try{ 
        const response = await axios.get(baseUrl+'apiMineralPrices/historyOfAMonth', header);
        console.log(response.data);
        const dates = response.data
            .filter(item => item.mineralId === 1) 
            .map(item => formatDate(item.datePrice));
        console.log(dates);
        const groupedByMineral = response.data.reduce((acc, item) => {
        if (!acc[item.mineral.name]) {
            acc[item.mineral.name] = [];
            }
            acc[item.mineral.name].push(item.price);
            return acc;
         }, {});
        const groupedArray = Object.entries(groupedByMineral).map(([name, prices]) => ({
            name: name,  
            data: prices, }));
            
        console.log(groupedArray);

        chartOptions.value = {
            chart: {
                type: 'line',
            },
            title: {
                text: 'Tendencia de Precios',
            },
            xAxis: {
                categories: dates,
            },
            yAxis: {
                title: {
                text: 'Precio (USD)',
                },
            },
            series: groupedArray,
        }
    } catch(e) { 
        console.error(e); 
    }
}
</script> 

<template>
    <div class="shadow">
        <highcharts :options="chartOptions" />
    </div>
</template>