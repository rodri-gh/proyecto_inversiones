<script setup>
import { getHeaderRequest, getHeaderRequestMultiPartFormData } from '@/authService';
import axios from 'axios';
import { onMounted, ref, computed, onUnmounted } from 'vue';
import Modal from './base/Modal.vue';
import Button from './base/Button.vue';
import Input from "@/components/base/Input.vue";
import Select from "@/components/base/Select.vue";
import { openModal, closeModal } from "@/utils/modal";
import TableContracts from './tables/TableContracts.vue';
import { eventBus } from '@/eventBus';
import Investments from './Investments.vue';

const header = getHeaderRequestMultiPartFormData();
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
const contractFilePath = ref(null);
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

const updateData = () => {
  eventBus.emit('data-updated');
};
 

onMounted(() => {
    getContracts();
    getUsers();
    eventBus.on('data-updated', getContracts);
});

onUnmounted(() => {
  eventBus.off('data-updated', getContracts); 
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
      updateData();
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
        getContracts();
        updateData();
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
    formData.append("contractFilePath", contractFilePath.value);

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
    selectedContract.value = {};
};

const handleFileChange = (fileEvent) => {
    console.log('ya no soy nulo');
    const file = fileEvent.target.files[0];
    if (file && file.type === 'application/pdf') {
        contractFilePath.value = file;
        console.log('ya no soy nulo');
    } else {
        contractFilePath.value = null;
        alert('Debes selecciona un archivo pdf valido.');
    }
};

const previewUrl = computed(() => {
  if (contractFilePath.value) {
    return URL.createObjectURL(contractFilePath.value); 
  }
  return ''; 
});

</script>

<template>
    <div>
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
                    <div class="col-md-3">
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
                    <div class="col-md-9">
                        <div class="row m-4">
                            <div class="col-md-3">
                                <Input
                                    id="investmentAmount"
                                    label="Cantidad de inversion"
                                    type="number"
                                    v-model="investmentAmount"
                                />
                            </div>
                            <div class="col-md-3">
                                <Input
                                    id="contractCode"
                                    label="codigo de contrato para almacen"
                                    type="number"
                                    v-model="contractCode"
                                />
                            </div>
                            <div class="col-md-3">
                                <Input
                                    id="startDate"
                                    label="Fecha de inicio"
                                    type="date"
                                    v-model="startDate"
                                />
                            </div>
                            <div class="col-md-3">
                                <Input
                                    id="endDate"
                                    label="Fecha de finalizacion"
                                    type="date"
                                    v-model="endDate"
                                />
                            </div>
                        </div>
                        <div class="row m-4">
                            <div class="col-md-3">
                                <label for="" class="form-label">Estado</label>
                                <select class="form-select form-select" v-model="status" id="status">
                                    <option value="">Seleccione un estado</option>
                                    <option value="active">Active</option>
                                    <option value="pending">pending</option>
                                    <option value="finalized">finalized</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label for="" class="form-label">Tipo de contrato</label>
                                <select class="form-select form-select" v-model="contractType" id="contractType">
                                    <option value="">Selecione una tasa</option>
                                    <option value="fixed_rate">tasa fija</option>
                                    <option value="variable_rate">tasa variable</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label for="" class="form-label">Moneda</label>
                                <select class="form-select form-select" v-model="currency" id="currency">
                                    <option value="">Selecione una Moneda</option>
                                    <option value="USD">Dolares</option>
                                    <option value="BS">Bolivianos</option>
                                </select>
                            </div>
                            <div class="col-md-3"> 
                                <label for="" class="form-label">PDF escaneado del contrato</label>
                                <input 
                                type="file" 
                                id="contractFilePath" 
                                name="contract" 
                                @change="handleFileChange"
                                accept=".pdf" required>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div v-if="contractFilePath" class="row">
                    <p>Visualización del archivo PDF:</p>
                    <p>Archivo seleccionado: {{ contractFilePath.name }}</p>
                    <iframe
                        v-if="contractFilePath"
                        :src="previewUrl"
                        width="100%"
                        height="500px"
                        frameborder="0"
                    ></iframe>
                </div>
            </Modal>
        </div>
    </div>
</template>

<style scoped>
</style>