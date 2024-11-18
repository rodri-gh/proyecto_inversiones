<script setup>
import { getHeaderRequest, getUserRoleOfLocalStorage } from '@/authService';
import axios from 'axios';
import { onMounted, ref } from 'vue';


const userRole = getUserRoleOfLocalStorage();
const header = getHeaderRequest();
const contacsPending = ref([]);
const withdrawalRequestsPending = ref([]);
const movements7days = ref([]);

onMounted(() => { 
    console.log('holaa');
    getNotifications();
})

const getNotifications = async () => { 
    try{ 
        console.log('holaa');
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
</script>

<template>
    <div>
        <h4>Resumen para tu rol: {{ userRole }}</h4>
        <div v-if="userRole === 'super_user'">
            <!--saccar de la tabla de contactos en estado pendiente-->
            <!-- sacar de la tabla de solicitudes de retiro en estado pendiente-->
            <div class="mt-5">
                <h6>----- Solicitudes de CONTACTOS pendientes</h6>
                <div v-for="item in contacsPending" :key="item">
                    <p>Contacto: {{ item.name }} {{ item.lastname }} - {{ item.answer }}</p>
                </div>
                <h6>----- Solicitudes de RETIRO pendientes</h6>
                <div v-for="item in withdrawalRequestsPending" :key="item">
                    <p>Contacto: usuario Id:{{ item.id }} - {{ item.status }}</p>
                </div>
            </div>
            <div class="mt-5">
                <h6>---- Ultimos movimientos </h6>
                <div v-for="item in movements7days" :key="item">
                    <p> {{ item.tipo }} - {{ item.descripcion }} - {{ item.amount }} - {{ item.fecha }}</p>
                </div>
            </div>
            <div class="mt-5">
                <h6>Graficos de actividad</h6>
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