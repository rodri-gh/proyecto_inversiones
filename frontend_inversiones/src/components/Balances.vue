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
    console.log('total invertido: '+response.data);
    totallyInvested.value = response.data;
  } catch (e) { 
    console.error(e)
  }
}

const getProfitOrLosess = async () => { 
  try{
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/analysisReport/profitsOrlosses/${userId}`,
      header
    );
    console.log("rendimiento de las inversiones: "+response.data);
    performanceOfInvestments.value = response.data;
  } catch (e) { 
    console.error(e);
  }
}

const getMovementsOfuser = async () => { 
  try{
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/analysisReport/historyMovementsOfuser/${userId}`,
      header
    );
    console.log("historial de movimientos: "+response.data);
    historMovements.value = response.data;
  } catch (e) { 
    console.error(e);
  }
}
</script>

<template>
  <div>
    <h4>Resumen General del Balance</h4>
    <div class="row">
      <!--
      <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="detail-item shadow">
            <div>
              <h6><i class="bi bi-bar-chart"></i> Gráfico de Actividad</h6>
            </div>
            <div>
              <canvas id="activityChart"></canvas>
            </div>
          </div>
      </div> -->
      <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="detail-item shadow">
            <div>
              <h6>
                <i class="bi bi-person-badge"></i> Total Invertido
              </h6>
            </div>
            <div class="card-body">
              <div v-if="totallyInvested != null && totallyInvested > 0 ">
                <p>${{ totallyInvested }}</p>
              </div> 
              <div v-else class="text-muted">No hay Inversiones.</div>
            </div>
          </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="detail-item shadow">
            <div>
              <h6>
                <i class="bi bi-person-badge"></i> Rendimiento de inversiones
              </h6>
            </div>
            <div class="card-body">
              <div v-if="performanceOfInvestments != null">
                <p>Total de Inversiones Finalizadas: {{ performanceOfInvestments.totallyInvested }}</p>
                <p>Total Rendimiento de esas inversiones: ${{ performanceOfInvestments.profitOrLosess }}</p>
              </div> 
              <div v-else class="text-muted">No hay rendimiento de tus inversiones aun.</div>
            </div>
          </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="detail-item shadow">
            <div>
              <h6><i class="bi bi-clock-history"></i> Historial de Movimientos</h6>
            </div>
            <div class="card-body">
              <div v-if="historMovements.length">
                <ul class="list-group">
                  <li
                    v-for="item in historMovements"
                    :key="item"
                    class="list-group-item"
                  >
                    <div>
                      <strong>{{ item.tipo }}</strong>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span class="text-muted">{{ formatDate(item.fecha ) }}</span>
                      <span class="text-success"
                        ><strong>${{ item.amount }}</strong></span
                      >
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else class="text-muted">No hay movimientos recientes.</div>
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
