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
                    <td>{{ item.user.name }}</td>
                    <td>{{ item.amount }}</td>
                    <td>{{ item.investmentDate }}</td>
                    <td>{{ item.profitPercentage }}</td>
                    <td>
                        <Button
                            @click="() => actions.edit(item)"
                            icon="fa fa-edit"
                            buttonClass="btn-warning btn-sm m-1"
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