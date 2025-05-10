<template>
  <div class="table-responsive">
    <table class="table table-striped table-hover">
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
          <td>
            {{
              item.status === "closed" ? formatCurrency(item.earnings) : "0.00"
            }}
          </td>
          <td>{{ item.status == "closed" ? "Cerrado" : "Pendiente" }}</td>
        </tr>
        <tr class="table-info">
          <td colspan="2"><strong>Totales:</strong></td>
          <td>
            <strong>{{ formatCurrency(totals.totalAmount) }}</strong>
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
  actions: {
    type: Object,
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