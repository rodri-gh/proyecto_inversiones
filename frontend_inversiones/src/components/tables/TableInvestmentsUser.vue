<template>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="items.length == 0">
          <td colspan="9" class="text-center">
            No hay inversiones registradas
          </td>
        </tr>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.investmentDate }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.currency }}</td>
          <td>{{ item.profitPercentage }}%</td>
          <td v-if="item.status === 'active'">Activa</td>
          <td v-else-if="item.status === 'pending'">Pendiente</td>
          <td v-else>Cerrada</td>
          <td>
            <Button
              @click="actions.view(item)"
              variant="primary"
              size="sm"
              text="Ver contrato"
            />
          </td>
        </tr>
        <!-- Fila del total -->
        <tr v-if="showTotal" class="table-info">
          <td colspan="1"><strong>Total</strong></td>
          <td>
            <strong>{{ calculateTotal }}</strong>
          </td>
          <td colspan="6"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from "vue";
import Button from "@/components/base/Button.vue";

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
  showTotal: {
    type: Boolean,
    default: false,
  },
});

const calculateTotal = computed(() => {
  const total = props.items.reduce(
    (sum, item) => sum + parseFloat(item.amount),
    0
  );
  return total.toFixed(2);
});
</script>