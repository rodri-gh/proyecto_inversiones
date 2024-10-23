<template>
    <div class="container col-md-8 mt-5">
        <div class="card shadow border-0">
            <div class="card-body">
                <h4 class="card-title text-center">Inversiones</h4>
                <div class="text-end">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#modalInvestments">
                        <i class="fa fa-plus mx-1"></i>Nuevo
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Usuario</th>
                                <th scope="col">Monto</th>
                                <th scope="col">Fecha de Inversion</th>
                                <th scope="col">Porcentaje de Ganancia</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="investments.length == 0">
                                <td colspan="5" class="text-center">
                                    No hay inversiones registradas
                                </td>
                            </tr>
                            <tr v-for="investment in investments" :key="investment.id">
                                <td>{{ investment.user_name }}</td>
                                <td>{{ investment.amount }}</td>
                                <td>{{ new Date(investment.investment_date).toLocaleDateString() }}</td>
                                <td>{{ investment.profit_percentage }}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm m-1" @click="selectInvestment(investment)">
                                        <i class="fa fa-edit"></i>
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
        <div class="modal fade" id="modalInvestments" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"
            role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered " role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalTitleId">
                            Inversiones
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="reset()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="" class="form-label">Usuario</label>
                            <select class="form-select" v-model="user_id" >
                                <option value="">Selecciona un usuario</option>
                                <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="" class="form-label">Monto</label>
                            <input type="number" class="form-control" v-model="amount" />
                        </div>
                        <div class="mb-3">
                            <label for="" class="form-label">Fecha de Inversion</label>
                            <input type="date" class="form-control" v-model="investment_date" />
                        </div>
                        <div class="mb-3">
                            <label for="" class="form-label">Porcentaje de Ganancia</label>
                            <input type="number" class="form-control" v-model="profit_percentage" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="reset()">
                            Cancelar
                        </button>
                        <button v-if="selectedInvestment && selectedInvestment.id == null" type="button" class="btn btn-primary" @click="createInvestment()">Guardar</button>
                        <button v-else type="button" class="btn btn-primary" @click="updateInvestment()">Actualizar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
    idProject: {
        type: String,
        required: true,
    },
});

const baseURL = "http://localhost:3000/investments/";

const investments = ref([]);

const user_id = ref("");
const amount = ref(0);
const investment_date = ref("");
const profit_percentage = ref(0);

const selectedInvestment = ref({});

const users = ref([]);
onMounted(() => {
    getInvestments();
    getUsers();
});

const getInvestments = async () => {
    try {
        const { data } = await axios.get(baseURL + props.idProject);
        investments.value = data.data;
    } catch (error) {
        console.log(error);
    }
};

const getUsers = async () => {
    try {
        const { data } = await axios.get("http://localhost:3000/user/");
        users.value = data.data;
    } catch (error) {
        console.log(error);
    }
};

const createInvestment = async () => {
    const investment = {
        user_id: user_id.value,
        amount: amount.value,
        investment_date: investment_date.value,
        profit_percentage: profit_percentage.value,
        project_id: props.idProject,
    };
    try {
        const { data } = await axios.post(baseURL, investment);
        console.log(data);
        var myModalEl = document.getElementById("modalInvestments");
        var modal = bootstrap.Modal.getInstance(myModalEl);
        modal.hide();
        getInvestments();
        reset();
    } catch (error) {
        console.log(error);
    }
};

const selectInvestment = (investment) => {
    amount.value = investment.amount;
    investment_date.value = investment.investment_date;
    profit_percentage.value = investment.profit_percentage;
    selectedInvestment.value = investment;

    var myModalEl = document.getElementById("modalInvestments");
    var modal = new bootstrap.Modal(myModalEl);
    modal.show();
};

const updateInvestment = async () => {
    const investment = {
        user_id: user_id.value,
        amount: amount.value,
        investment_date: investment_date.value,
        profit_percentage: profit_percentage.value,
        project_id: props.idProject,
    };
    try {
        const { data } = await axios.put(
            baseURL + selectedInvestment.value.id,
            investment
        );
        console.log(data);
        var myModalEl = document.getElementById("modalInvestments");
        var modal = bootstrap.Modal.getInstance(myModalEl);
        modal.hide();
        getInvestments();
        reset();
    } catch (error) {
        console.log(error);
    }
};
const reset = () => {
    amount.value = 0;
    investment_date.value = "";
    profit_percentage.value = 0;
    selectedInvestment.value = {};
};
</script>
<style scoped></style>