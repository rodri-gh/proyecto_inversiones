<script setup>
import { getHeaderRequest, getUserIdOfLocalStorage } from '@/authService';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const investmests = ref([]);
const userId = getUserIdOfLocalStorage();
const header = getHeaderRequest();

onMounted(() =>{
    getInvestments();
})

const getInvestments = async () => {
    try{ 
        const response = await axios.get('http://localhost:3000/investment/'+userId, header);
        console.log(response.data);
        investmests.value = response.data;
    } catch (e) { 
        console.error(e);
    }
}

</script>

<template>
    <div>
        <h4>Balances</h4>
        <br>
        <p>Resumen General del Balance</p>

        <h5>inversiones del usuario </h5>
        <div class="m-5" v-for="item in investmests" :key="item">
            <p>{{ item.amount }}</p>
            <p>{{ item.investmentDate }}</p>
        </div>
        <p>Saldo Actual: Mostrar el saldo total disponible del cliente.</p>
        <p>Inversiones Activas: Mostrar el monto total invertido actualmente en proyectos.</p>
        <p>Ganancias Totales: Total acumulado de ganancias obtenidas a partir de inversiones.</p>
        <p>Pérdidas Totales: Total acumulado de pérdidas o deducciones.</p>
        <br>
        <p>Historial de Movimientos</p>
        <p>Tabla que muestre un registro de los movimientos financieros recientes del cliente (inversiones, retiros, depósitos, pagos).</p>
        <p>Columnas sugeridas: Fecha, Descripción, Tipo de Movimiento (Ingreso/Egreso), Monto, Saldo Resultante.</p>
        <b></b>
        <p>Gráfica de Flujo de Caja (Cash Flow)</p>
        <p>Mostrar una gráfica de barras o líneas para visualizar el flujo de efectivo del cliente en los últimos 7 días, 30 días, o un periodo personalizado.</p>
        <p>Diferenciar entre ingresos y egresos para facilitar el análisis.</p>
        <br>
        <p>Detalle de Inversiones</p>
        <p>Sección que muestre una lista de las inversiones activas del cliente con detalles sobre cada una.</p>
        <p>Columnas sugeridas: Proyecto, Monto Invertido, ROI Estimado, Fecha de Inversión, Estado del Proyecto (En curso, Completado).</p>
        <br>
        <p>Indicadores Clave (KPIs)</p>
        <p>Retorno de Inversión (ROI): Mostrar el ROI acumulado del cliente.</p>
        <p>Rentabilidad Total: Diferencia entre las ganancias y las pérdidas totales.</p>
        <p>Diversificación de Inversiones: Mostrar el porcentaje del capital invertido en diferentes proyectos.</p>
        <br>
        <p>Alertas y Notificaciones</p>
        <p>Notificar al cliente sobre inversiones que están próximas a finalizar.</p>
        <p>Alertar sobre cualquier anomalía detectada (por ejemplo, saldo bajo, inversiones con pérdidas).</p>
        <p>Recordatorios de nuevos proyectos disponibles para inversión.</p>
    </div>
</template>

<style scoped>
</style>