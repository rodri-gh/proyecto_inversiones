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
                    <td colspan="5" class="text-center">No hay inversiones registradas</td>
                </tr>
                <tr v-for="item in items" :key="item.id">
                    <td>{{ formatDate(item.startDate) }}</td>
                    <td>{{ formatDate(item.endDate) }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.description }}</td>
                    <td>{{ item.investmentGoal }}</td>
                    <td>{{ item.profitPercentage }}</td>
                    <td v-if="item.deleted == 0">No</td>
                    <td v-else>Si</td>
                    <td>
                        <span v-if="item.status === 'open'" class="badge bg-success"
                        >Abierto</span
                        >
                        <span v-else class="badge bg-danger">Cerrado</span>
                    </td>
                    <td>
                        <Button
                            @click="() => actions.edit(item)"
                            icon="fa fa-edit"
                            buttonClass="btn-warning btn-sm m-1"
                        />
                        <Button
                            v-if="item.deleted == 1"
                            @click="() => actions.delete(item.id)"
                            :icon="item.deleted ? 'fa fa-check' : 'fa fa-trash'"
                            :buttonClass="`btn-${
                            item.deleted ? 'restore' : 'delete'
                            } btn-sm m-1`"
                        />
                        <Button
                            v-if="item.deleted == 0"
                            @click="() => actions.delete(item.id)"
                            :icon="item.deleted ? 'fa fa-check' : 'fa fa-trash'"
                            :buttonClass="`btn-${
                            item.deleted ? 'restore' : 'delete'
                            } btn-sm m-1`"
                        />
                        <Button
                            @click="() => actions.view(item)"
                            buttonClass="btn btn-info btn-sm m-1"
                            icon="fa fa-eye"
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

const formatDate = (date) => {
  const d = new Date(date);
  const formattedDate = d.toLocaleDateString(); // Ejemplo: "14/12/2024"
  const formattedTime = d.toLocaleTimeString(); 
  return formattedDate+', '+formattedTime;
};

</script>