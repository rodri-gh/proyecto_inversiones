<template>
  <div class="table table-striped">
    <table class="table">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="items.length === 0">
          <td colspan="7" class="text-center">No hay usuarios registrados</td>
        </tr>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.last_name }}</td>
          <td>{{ item.username }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.phone }}</td>
          <td>
            <span v-if="item.deleted == 0" class="badge bg-success"
              >Activo</span
            >
            <span v-else class="badge bg-danger">Inactivo</span>
          </td>
          <td>
            <Button
              @click="() => actions.edit(item)"
              icon="fa fa-edit"
              buttonClass="btn-edit btn-sm m-1"
            />
            <Button
              @click="() => actions.delete(item.id)"
              :icon="item.deleted ? 'fa fa-check' : 'fa fa-trash'"
              :buttonClass="`btn-${
                item.deleted ? 'restore' : 'delete'
              } btn-sm m-1`"
            />
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
<style scoped>
.btn-edit:hover {
  opacity: 0.5 !important;
  background-color: var(--primary-color);
}
.btn-delete:hover {
  opacity: 0.5 !important;
  background-color: var(--pending-color);
}
.btn-restore:hover {
  opacity: 0.5 !important;
  background-color: var(--active-color);
}
</style>


