<script setup>
import { getHeaderRequest, getUserIdOfLocalStorage } from '@/authService';
import axios from 'axios';
import { ref } from 'vue';
import { onMounted } from 'vue';

const baseURL = `${import.meta.env.VITE_API_URL}/`;
const header = getHeaderRequest();
const investmentOpportunities = ref([]);
const userId = getUserIdOfLocalStorage();
const projectPayments = ref([]);
const acountBalances = ref(0);
const financialTransactions = ref ([]);

onMounted(() => {
    getInvestmentOpportunities();
    getProjectPayments();
    getFinancialTransactions();
})

const getInvestmentOpportunities = async () => {
  try {
    const response = await axios.get(baseURL+'analysisReport/investmentOpportunities', header);
    investmentOpportunities.value = response.data.filter(project => project.amountMissingForGoal > 0);
    console.log(investmentOpportunities.value);
  } catch (e) {
    console.error(e);
  }
};

const getFinancialTransactions = async () => {
  try {
    const response = await axios.get(baseURL+'financialTransactions/last7days/user/'+userId, header);
    financialTransactions.value = response.data;
    console.log(financialTransactions.value);
  } catch (e) {
    console.error(e);
  }
};

const getProjectPayments = async () => {
  try {
    const response = await axios.get(baseURL+'projectPayment/pending/user/'+userId, header);
    console.log(response.data);
    projectPayments.value = response.data;
    calculateBalances();
  } catch (e) {
    console.error(e);
  }
};

const calculateBalances = () => {
    if (Array.isArray(projectPayments.value)) {
        const totalInvestment = projectPayments.value.reduce((acc, item) => {
            const amount = parseFloat(item.amountInvested);
            return acc + (isNaN(amount) ? 0 : amount);
        }, 0);
        const totalPerformance = projectPayments.value.reduce((acc, item) => {
            const amount = parseFloat(item.amountEarned);
            return acc + (isNaN(amount) ? 0 : amount);
        }, 0);
        acountBalances.value = totalInvestment + totalPerformance;
        console.log(acountBalances.value);
    } else {
        console.error('El formato de inversiones no es válido o no existe.');
    }
}

</script>

<template>
        <!--
      <p>
        Mis Inversiones: Lista de proyectos en los que ha invertido, con
        detalles sobre el progreso y los retornos. Indicadores de rendimiento de
        las inversiones (ganancias, pérdidas, ROI).
      </p> -->
      <div>
        <div class="">
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="detail-item shadow">
                    <div>
                    <h6>
                        <i class="bi bi-person-badge"></i> Oportunidades de Inversion
                    </h6>
                    </div>
                    <div class="card-body">
                    <div v-if="investmentOpportunities.length > 0">
                        <ul class="list-group">
                        <li
                            v-for="item in investmentOpportunities"
                            :key="item"
                            class="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <span><strong>Proyecto :</strong> {{ item.name }} </span>
                            <span><strong>Monto para Invertir:</strong> $1 - ${{ item.amountMissingForGoal }}</span>
                        </li>
                        </ul>
                    </div>
                    <div v-else class="text-muted">No hay contactos pendientes.</div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="detail-item shadow">
                    <h6>Saldo Cuenta</h6>
                    <p>
                        <strong>${{ acountBalances }}</strong>
                    </p>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="detail-item shadow">
                    <div>
                    <h6>
                        <i class="bi bi-person-badge"></i> Transacciones recientes
                    </h6>
                    </div>
                    <div class="card-body">
                    <div v-if="financialTransactions.length">
                        <ul class="list-group">
                        <li
                            v-for="item in financialTransactions"
                            :key="item"
                            class="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <span>{{ item.transactionType }} {{ item.amount }}</span>
                            <span>{{ item.description }}</span>
                        </li>
                        </ul>
                    </div>
                    <div v-else class="text-muted">No hay transacciones recientes.</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
</template>

<style scoped>
.detail-item {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 10px;
}
</style>