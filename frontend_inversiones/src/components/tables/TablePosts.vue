<template>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="items.length === 0">
          <td colspan="6" class="text-center">No hay posts registrados</td>
        </tr>
        <tr v-for="item in items" :key="item.post_id">
          <td>{{ item.title }}</td>
          <td>{{ item.summary }}</td>
          <td>
            <span v-if="item.status == 1" class="badge bg-success">Activo</span>
            <span v-else class="badge bg-danger">Inactivo</span>
          </td>

          <td>
            <Button
              @click="() => actions.edit(item)"
              icon="fa fa-edit"
              buttonClass="btn-warning btn-sm m-1"
            />
            <Button
              @click="() => actions.delete(item.post_id)"
              :icon="item.status ? 'fa fa-trash' : 'fa fa-check'"
              :buttonClass="`btn-${
                item.status ? 'danger' : 'success'
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
