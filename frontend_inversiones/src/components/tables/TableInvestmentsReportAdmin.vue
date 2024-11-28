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
            No hay inversiones registradas
          </td>
        </tr>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.userName }}</td>
          <td>{{ item.projectName }}</td>
          <td>{{ formatCurrency(item.amount) }}</td>
          <td>{{ item.investmentDate }}</td>
          <td>{{ item.status }}</td>
          <td>
            {{
              item.status === "Cerrado"
                ? formatCurrency(item.earnings)
                : "Pendiente"
            }}
          </td>
          <td>{{ item.minerals }}</td>
        </tr>
        <tr class="table-info">
          <td colspan="2"><strong>Totales (Solo cerrados):</strong></td>
          <td>
            <strong>{{ formatCurrency(totals.totalInvestment) }}</strong>
          </td>
          <td></td>
          <td></td>
          <td>
            <strong>{{ formatCurrency(totals.totalEarnings) }}</strong>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
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
  const amount = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

  return `$ ${amount}`;
};
</script>