<template>
    <div class="container col-md-8 mt-5">
        <div class="card shadow border-0">
            <div class="card-body">
                <h4 class="card-title text-center">Gastos Operativos</h4>
                <div class="text-end">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#modalOperatingExpenses">
                        <i class="fa fa-plus mx-1"></i> Nuevo
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Descripcion</th>
                                <th scope="col">Gastos</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="operatingExpenses.length == 0">
                                <td colspan="5" class="text-center">
                                    No hay gastos operativos registrados
                                </td>
                            </tr>

                            <tr v-for="operatingExpense in operatingExpenses" :key="operatingExpense.id">
                                <td>{{ operatingExpense.name }}</td>
                                <td>{{ operatingExpense.description }}</td>
                                <td>{{ operatingExpense.expenses }}</td>
                                <td>
                                    <span v-if="operatingExpense.deleted == 1" class="badge bg-success">Activo</span>
                                    <span v-else class="badge bg-danger">Inactivo</span>
                                </td>
                                <td>
                                    <button class="btn btn-warning btn-sm m-1"
                                        @click="selectOperatingExpense(operatingExpense)">
                                        <i class="fa fa-edit"></i>
                                    </button>
                                    <button v-if="operatingExpense.deleted == 1" class="btn btn-danger btn-sm m-1" @click="deleteOperatingExpense(operatingExpense.id)">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                    <button v-if="operatingExpense.deleted == 0" class="btn btn-success btn-sm m-1" @click="deleteOperatingExpense(operatingExpense.id)">
                                        <i class="fa fa-check"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal Body -->
        <!-- if you want to close by clicking outside the modal, delete the last endpoint:data-bs-backdrop and data-bs-keyboard -->
        <div class="modal fade" id="modalOperatingExpenses" tabindex="-1" data-bs-backdrop="static"
            data-bs-keyboard="false" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalTitleId">
                            Gastos operativos
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="reset()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="" class="form-label">Nombre</label>
                            <input type="text" class="form-control" v-model="name" />
                        </div>

                        <div class="mb-3">
                            <label for="" class="form-label">Descripcion</label>
                            <textarea class="form-control" v-model="description"></textarea>
                        </div>

                        <div class="mb-3">
                            <label for="" class="form-label">Gastos</label>
                            <input type="number" class="form-control" v-model="expenses" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="reset()">
                            Cancelar
                        </button>
                        <button v-if="selectedOperatingExpense && selectedOperatingExpense.id == null" type="button"
                            class="btn btn-primary" @click="createOperatingExpense()">Guardas</button>
                        <button v-else type="button" class="btn btn-primary"
                            @click="updateOperatingExpense()">Actualizar</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
    idProject: {
        type: String,
        required: true,
    },
});

const baseURL = "http://localhost:3000/operatingexpenses/";

const operatingExpenses = ref([]);

const name = ref("");
const description = ref("");
const expenses = ref(0);

const selectedOperatingExpense = ref({});

onMounted(() => {
    getOperatingExpenses();
    console.log("Imprimiendo el prop operatingExpenses: ", props.idProject);
});

const getOperatingExpenses = async () => {
    try {
        const { data } = await axios.get(baseURL + props.idProject);
        operatingExpenses.value = data.data;
    } catch (error) {
        console.error(error);
    }
};

const createOperatingExpense = async () => {
    const operatingExpense = {
        name: name.value,
        description: description.value,
        expenses: expenses.value,
        project_id: props.idProject,
    };
    try {
        const { data } = await axios.post(baseURL, operatingExpense);
        console.log(data);
        var myModalEl = document.getElementById("modalOperatingExpenses");
        var modal = bootstrap.Modal.getInstance(myModalEl);
        modal.hide();
        getOperatingExpenses();
        reset();
    } catch (error) {
        console.error(error);
    }
};

const selectOperatingExpense = (operatingExpense) => {
    name.value = operatingExpense.name;
    description.value = operatingExpense.description;
    expenses.value = operatingExpense.expenses;
    selectedOperatingExpense.value = operatingExpense;

    var myModalEl = document.getElementById("modalOperatingExpenses");
    var modal = new bootstrap.Modal(myModalEl);
    modal.show();
};

const updateOperatingExpense = async () => {
    const operatingExpense = {
        name: name.value,
        description: description.value,
        expenses: expenses.value,
        project_id: props.idProject,
    };
    try {
        const { data } = await axios.put(
            baseURL + selectedOperatingExpense.value.id,
            operatingExpense
        );
        console.log(data);
        var myModalEl = document.getElementById("modalOperatingExpenses");
        var modal = bootstrap.Modal.getInstance(myModalEl);
        modal.hide();
        getOperatingExpenses();
        reset();
    } catch (error) {
        console.error(error);
    }
};

const deleteOperatingExpense = async (id) => {
    try {
        const { data } = await axios.patch(baseURL + id);
        console.log(data);
        getOperatingExpenses();
    } catch (error) {
        console.error(error);
    }
};
const reset = () => {
    name.value = "";
    description.value = "";
    expenses.value = 0;
    selectedOperatingExpense.value = {};
};
</script>

<style scoped></style>