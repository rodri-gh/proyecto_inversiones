<template>
  <table class="table table-striped">
    <thead>
      <tr>
        <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="items.length === 0">
        <td colspan="7" class="text-center">No hay minerales registrados</td>
      </tr>
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ formatCurrency(item.price) }}</td>
        <td>{{ item.description }}</td>
        <td>
          <img :src="item.image" alt="Imagen" height="60px" width="60px" class="img-fluid rounded-1" />
        </td>
        <td>
          <span v-if="item.deleted == 0" class="badge bg-success">Activo</span>
          <span v-else class="badge bg-danger">Inactivo</span>
        </td>
        <td>
          <Button @click="() => actions.edit(item)" icon="fa fa-edit" buttonClass="btn-edit btn-sm m-1" />
          <Button @click="() => actions.delete(item.id)" :icon="item.deleted ? 'fa fa-check' : 'fa fa-trash'"
            :buttonClass="`btn-${item.deleted ? 'restore' : 'delete'
              } btn-sm m-1`" />
        </td>
      </tr>
    </tbody>
  </table>
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
const formatCurrency = (value) => {
  const amount = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

  return `$ ${amount}`;
};
</script>
