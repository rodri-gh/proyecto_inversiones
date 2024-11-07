<template>
  <table class="table table-striped">
    <thead>
      <tr>
        <th v-for="(header, index) in headers" :key="index" class="bg-light">
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="items.length === 0">
        <td colspan="9" class="text-center">
          No existen solicitudes de información
        </td>
      </tr>
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.lastName }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.phone }}</td>
        <td>{{ item.comment }}</td>
        <td>{{ new Date(item.createdDate).toLocaleDateString() }}</td>
        <td>
          <span v-if="item.answer === 'pending'" class="badge bg-dark"
            >Pendiente</span
          >
          <span v-if="item.answer === 'answered'" class="badge bg-secondary"
            >Enviado</span
          >
        </td>
        <td>
          <span v-if="item.deleted == 0" class="badge bg-success">Activo</span>
          <span v-else class="badge bg-danger">Inactivo</span>
        </td>
        <td width="10%">
          <Button
            @click="() => actions.answer(item.id)"
            icon="fa fa-envelope"
            buttonClass="btn btn-dark btn-sm m-1"
            :class="{ disabled: item.answer === 'answered' }"
            :disabled="item.answer === 'answered'"
          >
          </Button>
          <Button
            @click="() => actions.delete(item.id)"
            :icon="item.deleted ? 'fa fa-check' : 'fa fa-trash'"
            :buttonClass="`btn-${
              item.deleted ? 'restore' : 'delete'
            } btn-sm m-1`"
          >
          </Button>
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
</script>
