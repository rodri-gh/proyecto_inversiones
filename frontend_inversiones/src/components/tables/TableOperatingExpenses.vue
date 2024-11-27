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
          <td colspan="5" class="text-center">
            No hay gastos operativos registrados
          </td>
        </tr>

        <tr v-for="item in items" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.expenses }}</td>
          <td>
            <Button
              @click="() => actions.edit(item)"
              icon="fa fa-edit"
              buttonClass="btn-warning btn-sm m-1"
            />
            <Button
              @click="() => actions.delete(item.id)"
              :icon="item.deleted ? 'fa fa-trash' : 'fa fa-check'"
              :buttonClass="`btn-${
                item.deleted ? 'danger' : 'success'
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