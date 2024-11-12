<script setup>
import { getHeaderRequest } from '@/authService';
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import Modal from './base/Modal.vue';
import Button from './base/Button.vue';
import Input from "@/components/base/Input.vue";
import Select from "@/components/base/Select.vue";
import { openModal, closeModal } from "@/utils/modal";
import TableContracts from './tables/TableContracts.vue';

const header = getHeaderRequest();
const contracts = ref([]);

const users = ref([]);
const baseURL = "http://localhost:3000/contract/";

const userId = ref("");
const investmentAmount = ref('');
const contractCode = ref('');
const startDate = ref('');
const endDate = ref('');
const status = ref('');
const contractType = ref('');
const currency = ref('');
const selectedContract = ref({});

const headers = [
    "usuario id",
    "monto de inversion",
    "condigo de contrato",
    "fehca de inicio",
    "fehca de finalizacion",
    "estado ",
    "tipo de contrato",
    "moneda",
    'Acciones',
];

const props = defineProps({
    idProject: {
        type: String,
        required: true,
    },
});

const getContracts = async () => {
    try { 
        const response = await axios.get(baseURL+'project/'+props.idProject, header);
        contracts.value = response.data;
        console.log(response.data);
    } catch(e) {
        console.log(e);
    }
};

onMounted(() => {
    getContracts();
    getUsers();
});


const getUsers = async () => {
    try {
        const data = await axios.get("http://localhost:3000/user", header);
        users.value = data.data;
        console.log(users.value)
    } catch (error) {
        console.error(error);
    }
};

const selectContract = (contract) => {
  selectedContract.value = contract;
  userId.value = contract.userId;
  investmentAmount.value = contract.investmentAmount;
  contractCode.value = contract.contractCode;
  startDate.value = contract.startDate;
  endDate.value = contract.endDate;
  status.value = contract.status;
  contractType.value = contract.contractType;
  currency.value = contract.currency;
  openModal("modalContract");
};

const deleteContract = async (id) => {
  try {
      const data = await axios.delete(baseURL + id);
      console.log(data);
      getOperatingExpenses();
  } catch (error) {
      console.error(error);
  }
};

const saveContract = async () => {
    const method = selectedContract.value.id ? "put" : "post";
    const url = selectedContract.value.id
        ? `${baseURL}${selectedContract.value.id}`
        : baseURL;
    const formData = createFormData();
    console.log(url); 
    console.log(Array.from(formData.entries()));
    try {
        await axios[method](url, formData, header);
        closeModal("modalContract");
        getUsers();
        reset();
    } catch (error) {
        console.log(error);
    }
};

const createFormData = () => {
    const formData = new FormData();
    formData.append("projectId", props.idProject);
    formData.append("userId", userId.value);
    formData.append("investmentAmount", investmentAmount.value);
    formData.append("contractCode", contractCode.value);
    formData.append("startDate", startDate.value);
    formData.append("endDate", endDate.value);
    formData.append("status", status.value);
    formData.append("contractType", contractType.value);
    formData.append("currency", currency.value);
    formData.append("contractFilePath", 'vacio');

    return formData;
};

const selectedUser = computed(() => {
    return users.value.find(user => String(user.id) === String(userId.value));
});

const reset = () => {
    investmentAmount.value = 0;
    contractCode.value = '',
    startDate.value = "";
    endDate.value = "";
    status.value = "";
    contractType.value = "";
    currency.value = "";
    selectContract.value = {};
};
</script>

<template>
        <div>
            <div>
                <div class="text-end">
                    <Button 
                    data-bs-toggle="modal"
                    data-bs-target="#modalContract"
                    text="Nuevo Contrato"
                    icon="fa fa-plus"
                    />
                </div>
                <TableContracts
                    :headers="headers"
                    :items="contracts"
                    :actions="{
                        edit: selectContract,
                        delete: deleteContract,
                    }"
                />
            </div>
            <Modal
                modalId="modalContract"
                title="Datos"
                modalClass="modal-lg"
                :showSaveButton="!selectedContract?.id"
                :showUpdateButton="Boolean(selectedContract?.id)"
                @onClose="reset()"
                @onSave="saveContract()"
            >
                <div class="row">
                    <div class="col-md-4">
                        <Select
                            :options="users"
                            label="Usuario"
                            value-key="id"
                            label-key="name"
                            v-model="userId"
                            select-class="col-8"
                        />  
                        <div class="mt-4">
                            <h5>Datos del Usuario Seleccionado:</h5>
                            <p><strong>Nombre:</strong> {{ selectedUser?.name || "Seleccione un usuario" }}</p>
                            <p><strong>Email:</strong> {{ selectedUser?.email || "Seleccione un usuario" }}</p>
                            <p><strong>Teléfono:</strong> {{ selectedUser?.phone || "Seleccione un usuario" }}</p>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="row m-4">
                            <div class="col-md-4">
                                <Input
                                    id="investmentAmount"
                                    label="Cantidad de inversion"
                                    type="number"
                                    v-model="investmentAmount"
                                />
                            </div>
                            <div class="col-md-4">
                                <Input
                                    id="contractCode"
                                    label="codigo de contrato para almacen"
                                    type="number"
                                    v-model="contractCode"
                                />
                            </div>
                            <div class="col-md-4">
                                <Input
                                    id="startDate"
                                    label="Fecha de inicio"
                                    type="date"
                                    v-model="startDate"
                                />
                            </div>
                        </div>
                        <div class="row m-4">
                            <div class="col-md-3">
                                <Input
                                    id="endDate"
                                    label="Fecha de finalizacion"
                                    type="date"
                                    v-model="endDate"
                                />
                            </div>
                            <div class="col-md-3">
                                <p>Estado del contrato</p>
                                <select
                                    id="status"
                                    type="text"
                                    v-model="status"
                                >
                                    <option value="active">active</option>
                                    <option value="pending">pending</option>
                                    <option value="finalized">finalized</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <p>Tipo de contrato</p>
                                <select
                                    id="contractType"
                                    type="text"
                                    v-model="contractType"
                                >
                                    <option value="fixed_rate">tasa fija</option>
                                    <option value="variable_rate">tasa variable</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <p>Moneda</p>
                                <select
                                    id="currency"
                                    type="text"
                                    v-model="currency"
                                >
                                    <option value="USD">Dolares</option>
                                    <option value="BS">Bolivianos</option>
                                </select>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </Modal>
        </div>
</template>

<style scoped>
</style>