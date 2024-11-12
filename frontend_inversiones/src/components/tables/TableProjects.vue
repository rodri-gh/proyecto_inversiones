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
                    <td>{{ item.startDate }}</td>
                    <td>{{ item.endDate }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.description }}</td>
                    <td>{{ item.investmentGoal }}</td>
                    <td>{{ item.profitPercentage }}</td>
                    <td v-if="item.status == 'open'">Abierto</td>
                    <td v-else-if="item.status == 'in_transit'">En curso</td>
                    <td v-else>Cerrado</td>
                    <td>
                        <span v-if="item.deleted === 1" class="badge bg-success"
                        >Activo</span
                        >
                        <span v-else class="badge bg-danger">Eliminado</span>
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
                            @click="() => actions.view(item.id)"
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
</script>