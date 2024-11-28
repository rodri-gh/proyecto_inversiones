<script setup>
import { getHeaderRequest, getUserIdOfLocalStorage } from "@/authService";
import axios from "axios";
import { ref } from "vue";
import { onMounted } from "vue";

const baseURL = `${import.meta.env.VITE_API_URL}/`;
const header = getHeaderRequest();
const investmentOpportunities = ref([]);
const userId = getUserIdOfLocalStorage();
const projectPayments = ref([]);
const acountBalances = ref(0);
const financialTransactions = ref([]);

onMounted(() => {
  getInvestmentOpportunities();
  getProjectPayments();
  getFinancialTransactions();
});

const getInvestmentOpportunities = async () => {
  try {
    const response = await axios.get(
      baseURL + "analysisReport/investmentOpportunities",
      header
    );
    investmentOpportunities.value = response.data.filter(
      (project) => project.amountMissingForGoal > 0
    );
    console.log(investmentOpportunities.value);
  } catch (e) {
    console.error(e);
  }
};

const getFinancialTransactions = async () => {
  try {
    const response = await axios.get(
      baseURL + "financialTransactions/last7days/user/" + userId,
      header
    );
    financialTransactions.value = response.data;
    console.log(financialTransactions.value);
  } catch (e) {
    console.error(e);
  }
};

const getProjectPayments = async () => {
  try {
    const response = await axios.get(
      baseURL + "projectPayment/pending/user/" + userId,
      header
    );
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
    console.error("El formato de inversiones no es válido o no existe.");
  }
};
</script>
<template>
  <div class="dashboard-container">
    <div class="cards-grid">
      <div class="card balance-card">
        <div class="card-header">
          <i class="fa fa-wallet"></i>
          <h6>Saldo Cuenta</h6>
        </div>
        <div class="card-amount">
          <span class="currency">$</span>
          <span class="amount">{{ acountBalances }}</span>
        </div>
      </div>
      <div class="card opportunities-card">
        <div class="card-header">
          <i class="fa fa-line-chart text-black"></i>
          <h6>Oportunidades de Inversión</h6>
        </div>
        <div class="card-body">
          <div v-if="investmentOpportunities.length > 0">
            <ul class="opportunities-list">
              <li
                v-for="item in investmentOpportunities"
                :key="item"
                class="opportunity-item"
              >
                <div class="opportunity-info">
                  <span class="project-name">{{ item.name }}</span>
                  <span class="investment-range"
                    >$1 - ${{ item.amountMissingForGoal }}</span
                  >
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="empty-state">No hay oportunidades disponibles</div>
        </div>
      </div>
      <div class="card transactions-card">
        <div class="card-header">
          <i class="fa fa-history text-black"></i>
          <h6>Transacciones Recientes</h6>
        </div>
        <div class="card-body">
          <div v-if="financialTransactions.length">
            <ul class="transactions-list">
              <li
                v-for="item in financialTransactions"
                :key="item"
                class="transaction-item"
              >
                <div class="transaction-info">
                  <span class="transaction-type">{{
                    item.transactionType
                  }}</span>
                  <span class="transaction-amount">${{ item.amount }}</span>
                </div>
                <span class="transaction-description">{{
                  item.description
                }}</span>
              </li>
            </ul>
          </div>
          <div v-else class="empty-state">No hay transacciones recientes</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.dashboard-container {
  padding: 20px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
  max-width: 1400px;
  margin: 0 auto;
}

.card {
  background: var(--secondary-color);
  border-radius: 25px;
  box-shadow: 0 4px 20px var(--shadow-color);
  transition: all 0.3s ease;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px var(--shadow-color);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: var(--navbar-bg);
  border-bottom: 1px solid var(--navbar-bg-hover);
}

.card-header i {
  font-size: 1.5rem;
  margin-right: 12px;
  color: var(--primary-light);
}

.card-header h6 {
  margin: 0;
  font-weight: 600;
  color: black !important;
}

.card-body {
  padding: 20px;
}
.balance-card {
  background: var(--secondary-color);
}

.balance-card .card-header {
  background: var(--navbar-bg);
  border-bottom: 1px solid var(--navbar-bg-hover);
}

.balance-card .card-header i,
.balance-card .card-header h6 {
  color: var(--text-primary);
}

.card-amount {
  padding: 20px;
  font-size: 2.5rem;
  font-weight: 700;
  color: black !important;
}

.opportunities-list {
  list-style: none;
  padding: 0;
}

.opportunity-item {
  padding: 15px;
  border-bottom: 1px solid var(--navbar-bg-hover);
}

.opportunity-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-name {
  font-weight: 600;
  color: var(--text-primary);
}

.investment-range {
  color: black !important;
  font-weight: 500;
}

.transactions-list {
  list-style: none;
  padding: 0;
}

.transaction-item {
  padding: 15px;
  border-bottom: 1px solid var(--navbar-bg-hover);
  transition: background-color 0.2s ease;
}

.transaction-item:hover {
  background-color: var(--navbar-bg);
}

.transaction-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.transaction-type {
  font-weight: 600;
  color: var(--text-primary);
}

.transaction-amount {
  color: var(--primary-light);
  font-weight: 500;
}

.transaction-description {
  color: var(--text-color);
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  color: var(--text-color);
  padding: 20px;
  font-style: italic;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .card-amount {
    font-size: 2rem;
  }

  .opportunity-info,
  .transaction-info {
    flex-direction: column;
    gap: 8px;
  }
}
</style>