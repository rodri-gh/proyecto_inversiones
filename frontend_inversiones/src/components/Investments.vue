<template>
    <div class="container col-md-8 mt-5">
        <div class="card shadow border-0">
            <div class="card-body">
                <h4 class="card-title text-center">Inversores</h4>
                <div class="text-end">
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
        </div>

        <ModalFullScreen
            modalId="modalInvestment"
            title="Datos de la Inversion"
            :showSaveButton="!selectedInvestment?.id"
            :showUpdateButton="Boolean(selectedInvestment?.id)"
            @onClose="reset()"
            @onSave="saveInvestment()"
        >
            <div class="mb-3">
                <label class="form-label"> Usuario</label>
                <select v-model="user_id" name="user_id" id="user_id"  class="form-select" >
                    <option value="">Selecione un usuario</option>
                    <option v-for="item in users" :value="item.id" :key="item.id">{{ item.username }}</option>
                </select>
            </div>
            
            <Input
                id="amount"
                label="Monto"
                v-model="amount"
                type="number"
            />

            <Input
                id="investment_date"
                label="Fecha"
                v-model="investment_date"
                type="date"
            />

            <Input
                id="profit_percentage"
                label="Porcentaje de ganancia"
                v-model="profit_percentage"
                type="number"
            />
        </ModalFullScreen>
    </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import Button from "@/components/base/Button.vue";
import TableInvestments from "@/components/tables/TableInvestments.vue";
import ModalFullScreen from "@/components/base/ModalFullScreen.vue";
import Input from "@/components/base/Input.vue";
import { openModal, closeModal } from "@/utils/modal";

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
const baseURL = "http://localhost:3000/investments/";
const investments = ref([]);
const user_id = ref("");
const amount = ref(0);
const investment_date = ref("");
const profit_percentage = ref(0);
const selectedInvestment = ref({});

const token = localStorage.getItem("token") || "";

const header = {
    headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
    },
};

onMounted(() => {
    getInvestments();
    getUsers();
});

const getInvestments = async () => {
    try {
        const {data} = await axios.get(baseURL + "project/" + props.idProjectInvestment);
        investments.value = data.data;
    } catch (error) {
        console.error(error);
    }
};

const getUsers = async () => {
    try {
        const {data} = await axios.get("http://localhost:3000/user" ,header);
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
        await axios[method](url, formData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
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


const reset = () => {
    user_id.value = "";
    amount.value = 0;
    investment_date.value = "";
    profit_percentage.value = 0;
    selectedInvestment.value = {};
};

</script>