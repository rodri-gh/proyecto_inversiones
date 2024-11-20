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
          <td colspan="7" class="text-center">
            No hay inversiones registradas
          </td>
        </tr>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.project.name }}</td>
          <td>{{ item.contract.contractCode }}</td>
          <td>{{ formatCurrency(item.amount) }}</td>
          <td>{{ formatDate(item.investmentDate) }}</td>
          <td>{{ item.profitPercentage }}%</td>
          <td>{{ formatCurrency(item.earnings) }}</td>
          <td>{{ item.status == "closed" ? "Cerrado" : "Abierto" }}</td>
        </tr>
        <!-- Fila de totales -->
        <tr class="table-info">
          <td colspan="2"><strong>Totales:</strong></td>
          <td>
            <strong>{{ formatCurrency(getTotalAmount()) }}</strong>
          </td>
          <td></td>
          <td></td>
          <td>
            <strong>{{ formatCurrency(getTotalEarnings()) }}</strong>
          </td>
          <td></td>
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
  actions: {
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

const getTotalAmount = () => {
  return props.items.reduce((sum, item) => sum + Number(item.amount), 0);
};

const getTotalEarnings = () => {
  return props.items.reduce((sum, item) => sum + Number(item.earnings || 0), 0);
};
</script>