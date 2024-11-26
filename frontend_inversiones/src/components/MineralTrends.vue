<script setup>
import { getHeaderRequest } from '@/authService';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { formatDate } from '@/router/viewFormat';

const baseUrl = `${import.meta.env.VITE_API_URL}/`;
const header = getHeaderRequest();
const selectedMineral = ref('');
const mineralObject = ref({});
const minerals = ref([]); 

const chartOptions = ref({
    chart: {
        type: 'line',
        backgroundColor: '#1b1b1b',
        borderColor: '#333',
        borderWidth: 1,
        plotBackgroundColor: '#1b1b1b',
        plotBorderWidth: 1,
        plotBorderColor: '#333',
    },
    title: {
        text: 'Tendencia de Precios',
        style: {
            color: '#fff',
            fontSize: '20px',
            fontWeight: 'bold',
        },
    },
    xAxis: {
        categories: [],
        labels: {
            style: {
                color: '#ccc',
                fontSize: '12px',
            },
        },
        gridLineColor: '#333', 
        gridLineWidth: 1,
    },
    yAxis: {
        title: {
            text: 'Precio en USD',
            style: {
                color: '#ccc', 
            },
        },
        labels: {
            style: {
                color: '#ccc',
            },
        },
        gridLineColor: '#333', 
        gridLineWidth: 1,
    },
    series: [
        {
            name: '',
            data: [],
            color: '#42a5f5',
            lineWidth: 3, 
            marker: {
                enabled: false, 
            },
            tooltip: {
                backgroundColor: '#333', 
                style: {
                    color: '#fff',
                },
            },
        },
    ],
    tooltip: {
        shared: true,
        crosshairs: true,
        backgroundColor: '#333', 
        borderWidth: 0,
        style: {
            color: '#fff', 
        },
    },
    legend: {
        itemStyle: {
            color: '#ccc', 
        },
        itemHoverStyle: {
            color: '#fff',
        },
    },
    responsive: {
        rules: [
            {
                condition: {
                    maxWidth: 600,
                },
                chartOptions: {
                    chart: {
                        height: 'auto',
                    },
                    xAxis: {
                        labels: {
                            style: {
                                fontSize: '10px',
                            },
                        },
                    },
                    yAxis: {
                        labels: {
                            style: {
                                fontSize: '10px',
                            },
                        },
                    },
                },
            },
        ],
    },
});


onMounted(() => { 
    getMineralPricesHistory();
})

const getMineralPricesHistory = async () => { 
    try{ 
        const response = await axios.get(baseUrl+'apiMineralPrices/historyOfAMonth', header);
        console.log(response.data);
        const mineralNames = Array.from(
            new Set(response.data.map(item => item.mineral.name))
        );
        minerals.value = mineralNames; 
        console.log(mineralNames);
        const groupedByMineral = response.data.reduce((acc, item) => {
            if (!acc[item.mineral.name]) {
                acc[item.mineral.name] = { prices: [], dates: [] };
            }
            acc[item.mineral.name].prices.push(parseFloat(item.price));
            acc[item.mineral.name].dates.push(formatDate(item.datePrice));
            return acc;
             }, {});
         console.log(groupedByMineral);
         mineralObject.value = groupedByMineral;
         const initGraphic = minerals.value[0];
         updateMineralPricesGraphic(initGraphic);
        console.log(mineralObject.value);
    } catch(e) { 
        console.error(e); 
    }
}

const updateMineralPricesGraphic = (selectMineral) => { 
    console.log(mineralObject.value.Cobre);
    const dates = [...mineralObject.value[selectMineral].dates];
    const prices = [...mineralObject.value[selectMineral].prices];
    console.log(dates); 
    console.log(prices);
    chartOptions.value.xAxis.categories = dates;
    chartOptions.value.series = [
        {
            name: selectMineral, 
            data: prices,
        },
    ];
}

watch(selectedMineral, (newValue) => {
    updateMineralPricesGraphic(newValue);
});

</script>  

<template>
    <div>
        <div class="filter-container">
            <select
                id="mineral-select"
                v-model="selectedMineral"
                class="mineral-dropdown"
            >
                <option value="" disabled selected>Selecciona un Mineral</option>
                <option v-for="mineral in minerals" :key="mineral" :value="mineral">
                {{ mineral }}
                </option>
            </select>
        </div>
        <highcharts :options="chartOptions" :key="selectedMineral" />
    </div>
</template>

<style scoped>
.filter-container {
  margin-bottom: 30px;
}

.mineral-dropdown {
  padding: 12px 20px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 15px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  width: 20%;
}

.mineral-dropdown:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

label {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  text-align: left;
}
</style>