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
          <td colspan="8" class="text-center">
            No hay Contratos en este proyecto
          </td>
        </tr>

        <tr v-for="item in items" :key="item.id">
          <td>{{ item.user.name }} {{ item.user.lastName }}</td>
          <td>{{ item.investmentAmount }}</td>
          <td>{{ item.contractCode }}</td>
          <td>{{ formatDate(item.startDate) }}</td>
          <td>{{ formatDate(item.endDate) }}</td>
          <td v-if="item.contractType === 'variable_rate'">Tasa Variable</td>
          <td v-if="item.contractType === 'fixed_rate'">Tasa Fija</td>
          <td>{{ item.currency }}</td>
          <td>
            <Button
              @click="() => actions.edit(item)"
              icon="fa fa-edit"
              buttonClass="btn-warning btn-sm m-1"
            />
            <Button
              @click="() => actions.delete(item)"
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
import { formatDate } from "@/router/viewFormat";

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