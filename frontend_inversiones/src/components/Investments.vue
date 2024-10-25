<template>
    <div class="container col-md-8 mt-5">
      <div class="card shadow border-0">
        <div class="card-body">
          <h4 class="card-title">Inversiones del Proyecto</h4>
          
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Inversionista</th>
                  <th scope="col">Monto</th>
                  <th scope="col">Fecha de Inversión</th>
                  <th scope="col">Porcentaje de Ganancia</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="projectInvestments.length === 0">
                  <td colspan="4" class="text-center">
                    No hay inversiones registradas para este proyecto
                  </td>
                </tr>
  
                <tr v-for="investment in projectInvestments" :key="investment.id">
                  <td>{{ investment.user_name }}</td>
                  <td>${{ formatAmount(investment.amount) }}</td>
                  <td>{{ formatDate(investment.investment_date) }}</td>
                  <td>{{ investment.profit_percentage }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from "vue";
  import axios from "axios";
  
  const props = defineProps({
    idInvestments: {
      type: String,
      required: true
    }
  });
  
  const projectInvestments = ref([]);
  
  onMounted(() => {
    getProjectInvestments();
  });
  
  // Observar cambios en el ID del proyecto
  watch(() => props.idInvestments, (newId) => {
    if (newId) {
      getProjectInvestments();
    }
  });
  
  const getProjectInvestments = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/investments/`);
      // Filtrar las inversiones por el ID del proyecto
      projectInvestments.value = response.data.data.filter(
        investment => investment.project_id === parseInt(props.idInvestments)
      );
    } catch (error) {
      console.error("Error al obtener inversiones del proyecto:", error);
    }
  };
  
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  </script>
  
  <style scoped>
  .container-fluid {
    padding: 0;
  }
  </style>