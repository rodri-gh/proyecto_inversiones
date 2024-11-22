<script setup>
import {
  getHeaderRequest,
  getUserIdOfLocalStorage,
  getUserRoleOfLocalStorage,
} from "@/authService";
import axios from "axios";
import { onMounted, ref } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const userRole = getUserRoleOfLocalStorage();
const header = getHeaderRequest();
const contacsPending = ref([]);
const withdrawalRequestsPending = ref([]);
const movements7days = ref([]);
const userId = getUserIdOfLocalStorage();

onMounted(() => {
  getNotifications();
  getFinancialSummary();
});

const getNotifications = async () => {
  try {
    const responseContacts = await axios.get(
      `${import.meta.env.VITE_API_URL}/contact/pending`,
      header
    );
    const responseWithdrawal = await axios.get(
      `${import.meta.env.VITE_API_URL}/withdrawal-request/pending`,
      header
    );
    const lastMovements7days = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/analysisReportgit /getMovementsFromLast7Days`,
      header
    );
    console.log(responseContacts.data);
    console.log(responseWithdrawal.data);
    console.log(lastMovements7days.data);
    contacsPending.value = responseContacts.data;
    withdrawalRequestsPending.value = responseWithdrawal.data;
    movements7days.value = lastMovements7days.data;
    createChart();
  } catch (e) {
    console.error(e);
  }
};

const getFinancialSummary = async () => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/analysisReport/GetUserClientSummary/${userId}`,
      header
    );
    console.log(response.data);
  } catch (e) {
    console.error(e);
  }
};

const createChart = () => {
  const ctx = document.getElementById("activityChart").getContext("2d");
  // Preparar datos del backend
  const labels = movements7days.value.map((item) => item.tipo); // Ej: 'Projects', 'Investments'
  const data = movements7days.value.map((item) => parseFloat(item.amount)); // Convertir amounts a números
  // Crear gráfico
  new Chart(ctx, {
    type: "bar", // Tipo de gráfico (puede ser 'line', 'bar', 'pie', etc.)
    data: {
      labels: labels, // Etiquetas
      datasets: [
        {
          label: "Actividad por Tipo",
          data: data, // Datos para el gráfico
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ], // Colores
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ], // Bordes
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
  <div>
    <h4 class="">
      Resumen para tu rol: <strong>{{ userRole }}</strong>
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
                      <strong>{{ item.tipo }}</strong> - {{ item.descripcion }}
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
    <div v-if="userRole === 'admin'">
      <p>
        Resumen Operacional: Gráficas de flujo de caja (cash flow) y resumen de
        ingresos y gastos. Lista de transacciones recientes (pagos,
        inversiones). Resumen de proyectos activos y en desarrollo.
      </p>
      <p>
        Gestión de Proyectos: Acceso para crear, actualizar y eliminar
        proyectos. Seguimiento del progreso y estado de cada proyecto (activo,
        en pausa, completado).
      </p>
      <p>
        Gestión de Transacciones: Vista detallada de transacciones financieras
        (entradas y salidas). Filtros para buscar transacciones por tipo, fecha
        o cliente.
      </p>
      <p>
        Reportes Básicos: Generación de reportes de ingresos, gastos, y estado
        de proyectos.
      </p>
      <p>
        Alertas Operacionales: Notificaciones sobre transacciones pendientes,
        inversiones no aprobadas, y proyectos con retrasos.
      </p>
    </div>
    <div v-if="userRole === 'client'">
      <p>
        Resumen de Cuenta: Saldo actual de la cuenta. Historial de transacciones
        recientes.
      </p>
      <p>
        Mis Inversiones: Lista de proyectos en los que ha invertido, con
        detalles sobre el progreso y los retornos. Indicadores de rendimiento de
        las inversiones (ganancias, pérdidas, ROI).
      </p>
      <p>
        Historial de Transacciones: Vista detallada del historial de pagos,
        depósitos y retiros. Filtros para buscar por fecha o tipo de
        transacción.
      </p>
      <p>
        Notificaciones Personalizadas: Notificaciones sobre nuevas oportunidades
        de inversión. Alertas de confirmación de transacciones y actualizaciones
        de proyectos.
      </p>
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