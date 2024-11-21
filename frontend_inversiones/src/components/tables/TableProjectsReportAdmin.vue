<template>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="items.length == 0">
          <td :colspan="headers.length" class="text-center">
            No hay proyectos registrados
          </td>
        </tr>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ formatCurrency(item.investmentGoal) }}</td>
          <td>{{ item.profitPercentage }}%</td>
          <td>{{ formatCurrency(item.operatingExpenses) }}</td>
          <td>{{ formatCurrency(item.profit) }}</td>
          <td>{{ formatDate(item.startDate) }}</td>
          <td>{{ formatDate(item.endDate) }}</td>
          <td>{{ formatStatus(item.status) }}</td>
          <td>{{ item.investors }}</td>
          <td>{{ item.minerals }}</td>
        </tr>
        <tr class="table-info">
          <td colspan="2"><strong>Totales:</strong></td>
          <td>
            <strong>{{ formatCurrency(totals.totalInvestment) }}</strong>
          </td>
          <td></td>
          <td>
            <strong>{{ formatCurrency(totals.totalExpenses) }}</strong>
          </td>
          <td>
            <strong>{{ formatCurrency(totals.totalProfit) }}</strong>
          </td>
          <td colspan="5"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  totals: {
    type: Object,
    required: true,
  },
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);
};

const formatStatus = (status) => {
  const statusMap = {
    open: "Abierto",
    in_transit: "En Tránsito",
    closed: "Cerrado",
  };
  return statusMap[status] || status;
};
</script>