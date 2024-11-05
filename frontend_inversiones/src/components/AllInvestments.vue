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
const projects = ref([])
const baseURL = "http://localhost:3000/investment";
const investments = ref([]);
const amount = ref(0);
const investment_date = ref("");
const profit_percentage = ref(0);
const selectedInvestment = ref({});
const user_id = ref("");
const project_id = ref("");

const header = getHeaderRequest();

onMounted(() => {
    getInvestments();
    getUsers();
    getProjects();
});

const getInvestments = async () => {
    try {
        const response = await axios.get(baseURL, header );
        investments.value = response.data;
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

const getProjects = async () => {
    try {
        const data = await axios.get("http://localhost:3000/project", header);
        projects.value = data.data;
        console.log(projects.value)
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
        console.log(Array.from(formData));
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
    formData.append("project_id", project_id.value);
    return formData;
};

const selectedUser = computed(() => {
    return users.value.find(user => String(user.id) === String(user_id.value));
});

const selectedProject = computed(() => {
    return projects.value.find(project => String(project.id) === String(project_id.value));
});

const reset = () => {
    amount.value = 0;
    investment_date.value = "";
    profit_percentage.value = 0;
    selectedInvestment.value = {};
};
</script>

<template>
    <div class="container col-md-12 mt-5">
        <div class="card shadow border-0">
            <div class="card-body">
                <h4 class="card-title text-center">Inversiones de los Usuarios</h4>
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
                <div class="col-md-4">
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
                <div class="col-md-4">
                    <Select
                        :options="projects"
                        label="Proyecto"
                        value-key="id"
                        label-key="name"
                        v-model="project_id"
                        select-class="col-8"
                    />
                    <div class="mt-2">
                        <h5>Datos del Projecto Seleccionado:</h5>
                        <p><strong>Nombre:</strong> {{ selectedProject?.name || "Seleccione un usuario" }}</p>
                        <p><strong>Meta de inversion:</strong> {{ selectedProject?.investment_goal || "Seleccione un usuario" }}</p>
                        <p><strong>porcentage de ganancia:</strong> {{ selectedProject?.profit_percentage || "Seleccione un usuario" }}</p>
                        <p><strong>estado:</strong> {{ selectedProject?.status || "Seleccione un usuario" }}</p>
                    </div>
                </div>
                <div class="col-md-4">
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