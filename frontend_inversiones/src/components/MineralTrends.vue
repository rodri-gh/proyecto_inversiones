<script setup>
import { getHeaderRequest } from "@/authService";
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { formatDate } from "@/router/viewFormat";

const baseUrl = `${import.meta.env.VITE_API_URL}/`;
const baseUrlAnalisys = `${import.meta.env.VITE_ANALISYS_API_URL}/`;
const header = getHeaderRequest();
const selectedMineral = ref("");
const mineralObject = ref({});
const minerals = ref([]); 
const mineralMap = ref({});
const predictions = ref({});

const chartOptions = ref({
  chart: {
    type: "line",
    backgroundColor: "#1b1b1b",
    borderColor: "#333",
    borderWidth: 1,
    plotBackgroundColor: "#1b1b1b",
    plotBorderWidth: 1,
    plotBorderColor: "#333",
  },
  title: {
    text: "Precios Historicos",
    style: {
      color: "#fff",
      fontSize: "20px",
      fontWeight: "bold",
    },
  },
  xAxis: {
    categories: [],
    labels: {
      style: {
        color: "#ccc",
        fontSize: "12px",
      },
    },
    gridLineColor: "#333",
    gridLineWidth: 1,
  },
  yAxis: {
    title: {
      text: "Precio en USD",
      style: {
        color: "#ccc",
      },
    },
    labels: {
      style: {
        color: "#ccc",
      },
    },
    gridLineColor: "#333",
    gridLineWidth: 1,
  },
  series: [
    {
      name: "",
      data: [],
      color: "#42a5f5",
      lineWidth: 3,
      marker: {
        enabled: false,
      },
      tooltip: {
        backgroundColor: "#333",
        style: {
          color: "#fff",
        },
      },
    },
  ],
  tooltip: {
    shared: true,
    crosshairs: true,
    backgroundColor: "#333",
    borderWidth: 0,
    style: {
      color: "#fff",
    },
  },
  legend: {
    itemStyle: {
      color: "#ccc",
    },
    itemHoverStyle: {
      color: "#fff",
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
            height: "auto",
          },
          xAxis: {
            labels: {
              style: {
                fontSize: "10px",
              },
            },
          },
          yAxis: {
            labels: {
              style: {
                fontSize: "10px",
              },
            },
          },
        },
      },
    ],
  },
});

const chartOptionsPredictable = ref({
  chart: {
    type: "line",
    backgroundColor: "#1b1b1b",
    borderColor: "#333",
    borderWidth: 1,
    plotBackgroundColor: "#1b1b1b",
    plotBorderWidth: 1,
    plotBorderColor: "#333",
  },
  title: {
    text: "Analisis Prediccion de Precios Futuros",
    style: {
      color: "#fff",
      fontSize: "20px",
      fontWeight: "bold",
    },
  },
  xAxis: {
    categories: [],
    labels: {
      style: {
        color: "#ccc",
        fontSize: "12px",
      },
    },
    gridLineColor: "#333",
    gridLineWidth: 1,
  },
  yAxis: {
    title: {
      text: "Precio en USD",
      style: {
        color: "#ccc",
      },
    },
    labels: {
      style: {
        color: "#ccc",
      },
    },
    gridLineColor: "#333",
    gridLineWidth: 1,
  },
  series: [
    {
      name: "",
      data: [],
      color: "#42a5f5",
      lineWidth: 3,
      marker: {
        enabled: false,
      },
      tooltip: {
        backgroundColor: "#333",
        style: {
          color: "#fff",
        },
      },
    },
  ],
  tooltip: {
    shared: true,
    crosshairs: true,
    backgroundColor: "#333",
    borderWidth: 0,
    style: {
      color: "#fff",
    },
  },
  legend: {
    itemStyle: {
      color: "#ccc",
    },
    itemHoverStyle: {
      color: "#fff",
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
            height: "auto",
          },
          xAxis: {
            labels: {
              style: {
                fontSize: "10px",
              },
            },
          },
          yAxis: {
            labels: {
              style: {
                fontSize: "10px",
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
});

const getMineralPricesHistory = async () => { 
    try{ 
        const response = await axios.get(baseUrl+'apiMineralPrices/historyOfAMonth', header);
        console.log(response.data);
        const mineralNames = Array.from(
            new Set(response.data.map(item => item.mineral.name))
        );
        mineralMap.value = response.data.reduce((acc, item) => {
                acc[item.mineral.name] = item.mineral.id;
                return acc;
            }, {});
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
         await updateMineralPricesGraphic(initGraphic);
        console.log(mineralObject.value);
    } catch(e) { 
        console.error(e); 
    }
}

const updateMineralPricesGraphic = async (selectMineral) => { 
    console.log(mineralObject.value[selectMineral]);
    const dates = [...mineralObject.value[selectMineral].dates];
    const prices = [...mineralObject.value[selectMineral].prices];
    chartOptions.value.xAxis.categories = dates;
    chartOptions.value.series = [
        {
            name: selectMineral, 
            data: prices,
        },
    ];
    await updatePredictableMineralPricesGraphic(selectMineral);
}

const updatePredictableMineralPricesGraphic = async (selectMineral) => { 
    try { 
        console.log(mineralMap.value);
        const mineralId = mineralMap.value[selectMineral];
        const response = await axios.get(baseUrlAnalisys+'predictMineralPrice/'+mineralId); 
        console.log(response.data);
        predictions.value = response.data;
        const dates = predictions.value.predictionsPrices.map(item => formatDate(item.date));
        const prices = predictions.value.predictionsPrices.map(item => parseFloat(item.predicted_price.toFixed(2)));
        chartOptionsPredictable.value.xAxis.categories = dates;
        chartOptionsPredictable.value.series = [
            {
                name: selectMineral, 
                data: prices,
            },
        ];
    } catch (e) { 
        console.error(e);
    }
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
        <div>
            <highcharts :options="chartOptions" :key="selectedMineral" />
        </div>
        <div class="prediction-container">
          <div v-if="!predictions.percentageErrorsPrediction" class="text-center">
              <p class="text-sm">Calculando predicción de precios...</p>
          </div>
          <div v-if="predictions.percentageErrorsPrediction">
              <p class="text-sm mb-2">
                  <span class="font-semibold">Porcentaje de Error en la Prediccion:</span>
                  <span class="text-red-400"><strong>{{ predictions.percentageErrorsPrediction.toFixed(2) }}%</strong></span>
              </p>
              <div>
                  <highcharts :options="chartOptionsPredictable" :key="selectedMineral" />
              </div>
          </div>
        </div>
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
  width: 220px;
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

.prediction-container {
  margin-top: 2rem; /* mt-8 equivalente */
  background-color: #2d3748; /* bg-gray-800 */
  color: #ffffff; /* text-white */
  padding: 1.5rem; /* p-6 */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-md */
}

.text-center {
  text-align: center;
}

.text-small {
  font-size: 0.875rem; /* text-sm */
}

.header {
  font-size: 1.25rem; /* text-xl */
  font-weight: bold; /* font-bold */
  margin-bottom: 0.5rem; /* mb-2 */
}

.bold {
  font-weight: bold; /* font-semibold */
}

.error-percentage {
  color: #f56565; /* text-red-400 */
}

.prediction-list {
  list-style-type: disc; /* list-disc */
  padding-left: 1.25rem; /* list-inside */
  margin-top: 0.5rem; /* mt-2 */
}

.price {
  font-family: monospace; /* font-mono */
  color: #48bb78; /* text-green-400 */
}
</style>