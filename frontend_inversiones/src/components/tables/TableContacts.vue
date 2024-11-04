<template>
  <div class="table-responsive" style="width: 100%; max-height: 700px; overflow-y: auto;">
    <table class="table table-hover ">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index" class="bg-light">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="items.length === 0">
          <td colspan="9" class="text-center">No existen solicitudes de información</td>
        </tr>
        <tr v-for="item in items" :key="item.id" v-show="item.deleted !== 0">
          <td>{{ item.name }}</td>
          <td>{{ item.lastname }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.phone }}</td>
          <td>{{ item.comments }}</td>
          <td>{{ new Date(item.created_date).toLocaleDateString() }}</td>
          <td>
            <span v-if="item.answer === 'pending'" class="badge bg-dark">Pendiente</span>
            <span v-if="item.answer === 'answered'" class="badge bg-secondary">Enviado</span>
          </td>
          <td>
            <span v-if="item.deleted == 1" class="badge bg-success">Activo</span>
            <span v-else class="badge bg-danger">Inactivo</span>
          </td>
          <td width="10%">
            <Button @click="() => actions.answer(item.contact_id)" icon="fa fa-envelope"
              buttonClass="btn btn-outline-dark btn-sm m-1" :disabled="item.answer === 'answered'">
            </Button>
            <Button @click="() => actions.delete(item.contact_id)" :icon="item.deleted ? 'fa fa-trash' : 'fa fa-check'"
              :buttonClass="`btn-${item.deleted ? 'danger' : 'success'} btn-sm m-1`">
            </Button>
          </td>
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
