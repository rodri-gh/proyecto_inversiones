<script setup>
import { getHeaderRequest, getUserIdOfLocalStorage, getUserRoleOfLocalStorage } from '@/authService';
import axios from 'axios';
import { onMounted, ref } from 'vue';


const userRole = getUserRoleOfLocalStorage();
const header = getHeaderRequest();
const contacsPending = ref([]);
const withdrawalRequestsPending = ref([]);
const movements7days = ref([]);
const userId = getUserIdOfLocalStorage();

onMounted(() => { 
    getNotifications();
    getFinancialSummary()
})

const getNotifications = async () => { 
    try{ 
        const responseContacts = await axios.get('http://localhost:3000/contact/pending', header); 
        const responseWithdrawal = await axios.get('http://localhost:3000/withdrawal-request/pending', header);
        const lastMovements7days = await axios.get('http://localhost:3000/analysis-report/getMovementsFromLast7Days', header);
        console.log(responseContacts.data);
        console.log(responseWithdrawal.data);
        console.log(lastMovements7days.data);
        contacsPending.value = responseContacts.data;
        withdrawalRequestsPending.value = responseWithdrawal.data;
        movements7days.value = lastMovements7days.data;
    } catch (e) { 
        console.error(e);
    }
}

const getFinancialSummary = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/analysis-report/GetUserClientSummary/${userId}`, header);
        console.log(response.data);

        // Asignar datos a variables reactivas
    } catch (e) {
        console.error(e);
    }
};
</script>

<template>
    <div>
        <h3 class="">Resumen para tu rol: <strong>{{ userRole }}</strong></h3>
        <div v-if="userRole === 'super_user'">
            <div class="card mb-4 shadow-sm">
                    <div class="card-header">
                        <h5><i class="bi bi-bar-chart"></i> Gráficos de Actividad</h5>
                    </div>
                    <div class="card-body">
                        <p class="text-muted"> gráficos de actividad.</p>
                    </div>
            </div>
            <div class="card mb-4 shadow-sm">
                <div class="card-header">
                    <h5><i class="bi bi-person-badge"></i> Solicitudes de Contactos Pendientes</h5>
                </div>
                <div class="card-body">
                    <div v-if="contacsPending.length">
                        <ul class="list-group">
                            <li v-for="item in contacsPending" :key="item" class="list-group-item d-flex justify-content-between align-items-center">
                                <span>{{ item.name }} {{ item.lastname }}</span>
                                <span class="badge bg-warning text-dark">{{ item.answer }}</span>
                            </li>
                        </ul>
                    </div>
                    <div v-else class="text-muted">No hay contactos pendientes.</div>
                </div>
            </div>
            <div class="card mb-4 shadow-sm">
                <div class="card-header">
                    <h5><i class="bi bi-cash-stack"></i> Solicitudes de Retiro Pendientes</h5>
                </div>
                <div class="card-body">
                    <div v-if="withdrawalRequestsPending.length">
                        <ul class="list-group">
                            <li v-for="item in withdrawalRequestsPending" :key="item" class="list-group-item d-flex justify-content-between align-items-center">
                                <span>ID Usuario: {{ item.id }}</span>
                                <span class="badge bg-info text-dark">{{ item.status }}</span>
                            </li>
                        </ul>
                    </div>
                    <div v-else class="text-muted">No hay solicitudes de retiro pendientes.</div>
                </div>
            </div>
            <div class="card mb-4 shadow-sm">
                <div class="card-header">
                    <h5><i class="bi bi-clock-history"></i> Últimos Movimientos</h5>
                </div>
                <div class="card-body">
                    <div v-if="movements7days.length">
                        <ul class="list-group">
                            <li v-for="item in movements7days" :key="item" class="list-group-item">
                                <div>
                                    <strong>{{ item.tipo }}</strong> - {{ item.descripcion }}
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span class="text-muted">{{ item.fecha }}</span>
                                    <span class="text-success"><strong>{{ item.amount }}</strong></span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div v-else class="text-muted">No hay movimientos recientes.</div>
                </div>
            </div>
        </div>
        <div v-if="userRole === 'admin'">
            <p>Resumen Operacional:
                Gráficas de flujo de caja (cash flow) y resumen de ingresos y gastos.
                Lista de transacciones recientes (pagos, inversiones).
                Resumen de proyectos activos y en desarrollo.</p>
            <p>Gestión de Proyectos:
                Acceso para crear, actualizar y eliminar proyectos.
                Seguimiento del progreso y estado de cada proyecto (activo, en pausa, completado).</p>
            <p>Gestión de Transacciones:
                Vista detallada de transacciones financieras (entradas y salidas).
                Filtros para buscar transacciones por tipo, fecha o cliente.</p>
            <p>Reportes Básicos:
                Generación de reportes de ingresos, gastos, y estado de proyectos.</p>
            <p>Alertas Operacionales:
                Notificaciones sobre transacciones pendientes, inversiones no aprobadas, y proyectos con retrasos.</p>
        </div>
        <div v-if="userRole === 'client'">
            <p>Resumen de Cuenta:
                Saldo actual de la cuenta.
                Historial de transacciones recientes.</p>
            <p>Mis Inversiones:
                Lista de proyectos en los que ha invertido, con detalles sobre el progreso y los retornos.
                Indicadores de rendimiento de las inversiones (ganancias, pérdidas, ROI).
                </p>
            <p>Historial de Transacciones:
                Vista detallada del historial de pagos, depósitos y retiros.
                Filtros para buscar por fecha o tipo de transacción.</p>
            <p>Notificaciones Personalizadas:
                Notificaciones sobre nuevas oportunidades de inversión.
                Alertas de confirmación de transacciones y actualizaciones de proyectos.</p>
        </div>
    </div>
</template>

<style scoped> 
</style>