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
          <td colspan="9" class="text-center">No hay proyectos registrados</td>
        </tr>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.startDate }}</td>
          <td>{{ item.endDate }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.investmentGoal }}</td>
          <td>{{ item.profitPercentage }}</td>
          <td v-if="item.status == 'open'">Abierto</td>
          <td v-else-if="item.status == 'in_transit'">En curso</td>
          <td v-else>Cerrado</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import Button from "@/components/base/Button.vue";

defineProps({
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
</script>