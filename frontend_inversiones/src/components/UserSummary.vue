<script setup>
import {
  getHeaderRequest,
  getUserIdOfLocalStorage,
  getUserRoleOfLocalStorage,
} from "@/authService";
import axios from "axios";
import { onMounted, ref } from "vue";
import { Chart, registerables } from "chart.js";
import ClientSummary from "./Analysis/ClientSummary.vue";
import { formatDate } from "@/router/viewFormat";

Chart.register(...registerables);

const userRole = getUserRoleOfLocalStorage();
const header = getHeaderRequest();
const contacsPending = ref([]);
const withdrawalRequestsPending = ref([]);
const movements7days = ref([]);
const userId = getUserIdOfLocalStorage();
const baseURL = `${import.meta.env.VITE_API_URL}/`;

onMounted(() => {
  getNotifications();
  getFinancialSummary();
  if (userRole === "admin") {
    filterSummaryOnlyAdmin();
  }
});

const getNotifications = async () => {
  try {
    const responseContacts = await axios.get(
      baseURL + "contact/pending",
      header
    );
    const responseWithdrawal = await axios.get(
      baseURL + "withdrawal-request/pending",
      header
    );
    const lastMovements7days = await axios.get(
      baseURL + "analysisReport/getMovementsFromLast7Days",
      header
    );
    console.log(responseContacts.data);
    console.log(responseWithdrawal.data);
    console.log(lastMovements7days.data);
    contacsPending.value = responseContacts.data;
    withdrawalRequestsPending.value = responseWithdrawal.data;
    movements7days.value = lastMovements7days.data;
    console.log("movimientos 7 dias", movements7days.value);
    createChart();
  } catch (e) {
    console.error(e);
  }
};

const getFinancialSummary = async () => {
  try {
    const response = await axios.get(
      baseURL + "analysisReport/GetUserClientSummary/" + userId,
      header
    );
    console.log(response.data);
  } catch (e) {
    console.error(e);
  }
};

const filterSummaryOnlyAdmin = () => {
  //filtrar los arrays de resumenes solo de los proyectos que le
  //corresponden al rol admin
};

const createChart = () => {
  const ctx = document.getElementById("activityChart").getContext("2d");
  const translateType = (type) => {
    const translations = {
      Projects: "Proyectos",
      Investments: "Inversiones",
    };
    return translations[type] || type;
  };

  const labels = movements7days.value.map((item) => translateType(item.tipo));
  const data = movements7days.value.map((item) => parseFloat(item.amount));
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Actividad por Tipo",
          data: data,
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: (context) => `Amount: ${context.raw}`,
          },
        },
      },
    },
  });
};
</script>

<template>
  <div class="summary-container">
    <h4 class="">
      Resumen para tu rol:
      <strong v-if="userRole === 'super_user'"> Super Usuario</strong>
      <strong v-if="userRole === 'admin'">Administrador</strong>
      <strong v-if="userRole === 'client'">Cliente</strong>
    </h4>
    <br />
    <div v-if="userRole === 'super_user'" class="container">
      <div class="row">
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="detail-item shadow">
            <div>
              <h6><i class="bi bi-bar-chart"></i> Gráfico de Actividad</h6>
            </div>
            <div>
              <canvas id="activityChart"></canvas>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="detail-item shadow">
            <div>
              <h6>
                <i class="bi bi-person-badge"></i> Solicitudes de Contactos
                Pendientes
              </h6>
            </div>
            <div class="card-body">
              <div v-if="contacsPending.length">
                <ul class="list-group">
                  <li
                    v-for="item in contacsPending"
                    :key="item"
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>{{ item.name }} {{ item.lastname }}</span>
                    <span class="badge bg-warning text-dark">{{
                      item.answer
                    }}</span>
                  </li>
                </ul>
              </div>
              <div v-else class="text-muted">No hay contactos pendientes.</div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="detail-item shadow">
            <div>
              <h6>
                <i class="bi bi-cash-stack"></i> Solicitudes de Retiro
                Pendientes
              </h6>
            </div>
            <div class="card-body">
              <div v-if="withdrawalRequestsPending.length">
                <ul class="list-group">
                  <li
                    v-for="item in withdrawalRequestsPending"
                    :key="item"
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>ID Usuario: {{ item.id }}</span>
                    <span class="badge bg-info text-dark">{{
                      item.status
                    }}</span>
                  </li>
                </ul>
              </div>
              <div v-else class="text-muted">
                No hay solicitudes de retiro pendientes.
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="detail-item shadow">
            <div>
              <h6><i class="bi bi-clock-history"></i> Últimos Movimientos</h6>
            </div>
            <div class="card-body">
              <div v-if="movements7days.length">
                <ul class="list-group">
                  <li
                    v-for="item in movements7days"
                    :key="item"
                    class="list-group-item"
                  >
                    <div>
                      <strong>{{
                        item.tipo === "Projects"
                          ? "Proyectos"
                          : item.tipo === "Investments"
                          ? "Inversiones"
                          : item.tipo
                      }}</strong>
                      - {{ item.descripcion }}
                    </div>
                    <div class="d-flex justify-content-between">
                      <span class="text-muted">{{
                        formatDate(item.fecha)
                      }}</span>
                      <span class="text-success"
                        ><strong>{{ item.amount }}</strong></span
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

    <div v-if="userRole === 'admin'">
      <div class="row">
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="detail-item shadow">
            <div>
              <h6><i class="bi bi-bar-chart"></i> Gráfico de Actividad</h6>
            </div>
            <div>
              <canvas id="activityChart"></canvas>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="detail-item shadow">
            <div>
              <h6>
                <i class="bi bi-person-badge"></i> Solicitudes de Contactos
                Pendientes
              </h6>
            </div>
            <div class="card-body">
              <div v-if="contacsPending.length">
                <ul class="list-group">
                  <li
                    v-for="item in contacsPending"
                    :key="item"
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>{{ item.name }} {{ item.lastname }}</span>
                    <span class="badge bg-warning text-dark">{{
                      item.answer
                    }}</span>
                  </li>
                </ul>
              </div>
              <div v-else class="text-muted">No hay contactos pendientes.</div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="detail-item shadow">
            <div>
              <h6>
                <i class="bi bi-cash-stack"></i> Solicitudes de Retiro
                Pendientes
              </h6>
            </div>
            <div class="card-body">
              <div v-if="withdrawalRequestsPending.length">
                <ul class="list-group">
                  <li
                    v-for="item in withdrawalRequestsPending"
                    :key="item"
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>ID Usuario: {{ item.id }}</span>
                    <span class="badge bg-info text-dark">{{
                      item.status
                    }}</span>
                  </li>
                </ul>
              </div>
              <div v-else class="text-muted">
                No hay solicitudes de retiro pendientes.
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="detail-item shadow">
            <div>
              <h6><i class="bi bi-clock-history"></i> Últimos Movimientos</h6>
            </div>
            <div class="card-body">
              <div v-if="movements7days.length">
                <ul class="list-group">
                  <li
                    v-for="item in movements7days"
                    :key="item"
                    class="list-group-item"
                  >
                    <div>
                      <strong>{{
                        item.tipo === "Projects"
                          ? "Proyectos"
                          : item.tipo === "Investments"
                          ? "Inversiones"
                          : item.tipo
                      }}</strong>
                      - {{ item.descripcion }}
                    </div>
                    <div class="d-flex justify-content-between">
                      <span class="text-muted">{{ item.fecha }}</span>
                      <span class="text-success"
                        ><strong>{{ item.amount }}</strong></span
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

    <div v-if="userRole === 'client'">
      <ClientSummary />
    </div>
  </div>
</template>

<style scoped>
.summary-container {
  max-height: 850px;
  overflow-y: auto;
}
.detail-item {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 10px;
}
</style>