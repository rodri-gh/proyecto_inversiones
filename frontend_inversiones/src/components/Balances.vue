<script setup>
import { getHeaderRequest, getUserIdOfLocalStorage } from '@/authService';
import axios from 'axios';
import { onMounted, ref } from 'vue';

// Variables reactivas
const financialSummary = ref({});
const userId = getUserIdOfLocalStorage();
const header = getHeaderRequest();

onMounted(() => {
    fetchFinancialSummary();
});

// Obtener el resumen financiero
const fetchFinancialSummary = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/analysis-report/GetUserFinancialSummary/${userId}`, header);
        console.log(response.data);

        // Asignar los datos a la variable reactiva financialSummary
        financialSummary.value = response.data;
    } catch (e) {
        console.error(e);
    }
};
</script>

<template>
    <div>
        <h4>Resumen General del Balance</h4>

        <div class="summary-container">
            <p><strong>Saldo Actual:</strong> ${{ financialSummary.saldo_actual || '0.00' }}</p>
            <p><strong>Inversiones Activas:</strong> ${{ financialSummary.inversiones_activas || '0.00' }}</p>
            <p><strong>Ganancias Totales:</strong> ${{ financialSummary.ganancias_totales || '0.00' }}</p>
            <p><strong>Pérdidas Totales:</strong> ${{ financialSummary.perdidas_totales || '0.00' }}</p>
            <p><strong>ROI Acumulado:</strong> {{ financialSummary.retorno_inversion || '0.00' }}%</p>
            <p><strong>Rentabilidad Total:</strong> ${{ financialSummary.rentabilidad_total || '0.00' }}</p>
        </div>
    </div>
</template>

<style scoped>
.summary-container {
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 10px;
    margin-bottom: 20px;
}
</style>
