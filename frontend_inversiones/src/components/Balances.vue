<script setup>
import { getHeaderRequest, getUserIdOfLocalStorage } from "@/authService";
import axios from "axios";
import { onMounted, ref } from "vue";
import { formatDate } from "@/router/viewFormat";

const financialSummary = ref({});
const userId = getUserIdOfLocalStorage();
const header = getHeaderRequest();
const totallyInvested = ref(0);
const performanceOfInvestments = ref({});
const historMovements = ref([]);

onMounted(() => {
  getTotallyInvested();
  getProfitOrLosess();
  getMovementsOfuser();
});

const getTotallyInvested = async () => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/analysisReport/totallyInvested/${userId}`,
      header
    );
    console.log("total invertido: " + response.data);
    totallyInvested.value = response.data;
  } catch (e) {
    console.error(e);
  }
};

const getProfitOrLosess = async () => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/analysisReport/profitsOrlosses/${userId}`,
      header
    );
    console.log("rendimiento de las inversiones: " + response.data);
    performanceOfInvestments.value = response.data;
  } catch (e) {
    console.error(e);
  }
};

const getMovementsOfuser = async () => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/analysisReport/historyMovementsOfuser/${userId}`,
      header
    );
    console.log("historial de movimientos: " + response.data);
    historMovements.value = response.data;
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div class="dashboard-container">
    <h4>Resumen General del Balance</h4>
    <div class="cards-grid">
      <div class="card">
        <div class="card-header">
          <i class="fa fa-user text-black"></i>
          <h6>Total Invertido</h6>
        </div>
        <div class="card-body">
          <div v-if="totallyInvested != null && totallyInvested > 0">
            <div class="card-amount">${{ totallyInvested }}</div>
          </div>
          <div v-else class="empty-state">No hay Inversiones.</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <i class="fa fa-line-chart text-black"></i>
          <h6>Rendimiento de inversiones</h6>
        </div>
        <div class="card-body">
          <div v-if="performanceOfInvestments != null" class="performance-info">
            <div class="info-item">
              <span class="info-label">Inversiones Finalizadas:</span>
              <span class="info-value text-black">{{
                performanceOfInvestments.totallyInvested
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Rendimiento Total:</span>
              <span class="info-value text-black"
                >${{ performanceOfInvestments.profitOrLosess }}</span
              >
            </div>
          </div>
          <div v-else class="empty-state">
            No hay rendimiento de tus inversiones aun.
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <i class="fa fa-history text-black"></i>
          <h6>Historial de Movimientos</h6>
        </div>
        <div class="card-body">
          <div v-if="historMovements.length">
            <ul class="movements-list">
              <li
                v-for="item in historMovements"
                :key="item"
                class="movement-item"
              >
                <div class="movement-type">{{ item.tipo }}</div>
                <div class="movement-details">
                  <span class="movement-date">{{
                    formatDate(item.fecha)
                  }}</span>
                  <span class="movement-amount">${{ item.amount }}</span>
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="empty-state">No hay movimientos recientes.</div>
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
  color: var(--text-primary);
}

.card-body {
  padding: 20px;
}

.card-amount {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  padding: 10px 0;
}

.performance-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--navbar-bg-hover);
}

.info-label {
  color: var(--text-primary);
  font-weight: 500;
}

.info-value {
  color: var(--primary-color);
  font-weight: 600;
}

.movements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.movement-item {
  padding: 15px;
  border-bottom: 1px solid var(--navbar-bg-hover);
}

.movement-type {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.movement-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.movement-date {
  color: var(--text-color);
  font-size: 0.9rem;
}

.movement-amount {
  color: var(--primary-color);
  font-weight: 600;
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

  .movement-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>
