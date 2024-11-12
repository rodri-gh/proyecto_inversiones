<template>
    <div>
        <div class="text-end">
            <div>
                <Button 
                    data-bs-toggle="modal"
                    data-bs-target="#modalInvestment"
                    text="Nuevo"
                    icon="fa fa-plus"
                />
            </div>
            <TableInvestments
                :headers="headers"
                :items="investments"
                :actions="{
                    edit: selectInvestment,
                }"
            />
        </div>

        <Modal
            modalId="modalInvestment"
            title="Datos"
            modalClass="modal-lg"
            :showSaveButton="!selectedInvestment?.id"
            :showUpdateButton="Boolean(selectedInvestment?.id)"
            @onClose="reset()"
            @onSave="saveInvestment()"
        >
            <div class="row">
                <div class="col-md-6">
                    <Select
                        :options="users"
                        label="Usuario"
                        value-key="id"
                        label-key="username"
                        v-model="user_id"
                        select-class="col-8"
                    />
                    <div class="mt-2">
                        <h5>Datos del Usuario Seleccionado:</h5>
                        <p><strong>Nombre:</strong> {{ selectedUser?.username || "Seleccione un usuario" }}</p>
                        <p><strong>Email:</strong> {{ selectedUser?.email || "Seleccione un usuario" }}</p>
                        <p><strong>Teléfono:</strong> {{ selectedUser?.phone || "Seleccione un usuario" }}</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="row">
                        <div class="col-md-6">
                            <Input
                                id="amount"
                                label="Cantidad"
                                type="number"
                                v-model="amount"
                            />
                        </div>
                        <div class="col-md-6">
                            <Input
                                id="investment_date"
                                label="Fecha"
                                type="date"
                                v-model="investment_date"
                            />
                        </div>
                        <div class="col-md-6">
                            <Input
                                id="profit_percentage"
                                label="Porcentaje de Ganancia"
                                type="number"
                                v-model="profit_percentage"
                            />
                        </div>
                    </div>
                    
                </div>
            </div>
        </Modal>
    </div>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import axios from "axios";
import Button from "@/components/base/Button.vue";
import TableInvestments from "@/components/tables/TableInvestments.vue";
import Modal from "@/components/base/Modal.vue";
import Input from "@/components/base/Input.vue";
import Select from "@/components/base/Select.vue";
import { openModal, closeModal } from "@/utils/modal";
import { getHeaderRequest } from "@/authService";

const headers = [
    "Usuario",
    "Cantidad",
    "Fecha",
    "Ganancia",
    "Acciones",
];

const props = defineProps({
    idProjectInvestment: {
        type: String,
        required: true,
    },
});

const users = ref([]);
const baseURL = "http://localhost:3000/investment/";
const investments = ref([]);
const amount = ref(0);
const investment_date = ref("");
const profit_percentage = ref(0);
const selectedInvestment = ref({});
const user_id = ref("");

const header = getHeaderRequest();

onMounted(() => {
    getInvestments();
    getUsers();
    console.log(props.idProjectInvestment);
});

const getInvestments = async () => {
    try {
        const data = await axios.get(baseURL + "project/" + props.idProjectInvestment, header);
        investments.value = data.data;
    } catch (error) {
        console.error(error);
    }
};

const getUsers = async () => {
    try {
        const data = await axios.get("http://localhost:3000/user", header);
        users.value = data.data;
        console.log(users.value)
    } catch (error) {
        console.error(error);
    }
};

const selectInvestment = (investment) => {
    selectedInvestment.value = investment;
    user_id.value = investment.user_id;
    amount.value = investment.amount;
    investment_date.value = investment.investment_date;
    profit_percentage.value = investment.profit_percentage;
    openModal("modalInvestment");
};

const saveInvestment = async () => {
    const method = selectedInvestment.value.id ? "put" : "post";
    const url = selectedInvestment.value.id
        ? `${baseURL}${selectedInvestment.value.id}`
        : baseURL;
    const formData = createFormData();
    try {
        await axios[method](url, formData, header);
        closeModal("modalInvestment");
        getInvestments();
        getUsers();
        reset();
    } catch (error) {
        console.log(error);
    }
};

const createFormData = () => {
    const formData = new FormData();
    formData.append("user_id", user_id.value);
    formData.append("amount", amount.value);
    formData.append("investment_date", investment_date.value);
    formData.append("profit_percentage", profit_percentage.value);
    formData.append("project_id", props.idProjectInvestment);
    return formData;
};

const selectedUser = computed(() => {
    return users.value.find(user => String(user.id) === String(user_id.value));
});
const reset = () => {
    amount.value = 0;
    investment_date.value = "";
    profit_percentage.value = 0;
    selectedInvestment.value = {};
};
</script>