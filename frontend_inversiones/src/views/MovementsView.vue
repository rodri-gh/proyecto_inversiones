<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Button from "@/components/base/Button.vue";
import TableMinerals from "@/components/tables/TableMinerals.vue";
import Modal from "@/components/base/Modal.vue";
import Input from "@/components/base/Input.vue";
import InputTextArea from "@/components/base/InputTextArea.vue";
import InputFile from "@/components/base/InputFile.vue";
import { openModal, closeModal } from "@/utils/modal";

const headers = [
  "Descripcion",
  "Tipo",
  "Monto",
  "Fecha de solicitud",
  "Fecha de desembolso",
  "Estado",
];

const baseURL = "http://localhost:3000/movements";

const movements = ref([]);
const description = ref("");
const type = ref("");
const amount = ref("");
const request_date = ref("");
const disbursement_date = ref("");
const state = ref("");

const selectedMineral = ref(null);

onMounted(() => {
  getMovements();
});

const getMovements = async () => {
  try {
    const token = localStorage.getItem('token'); 

    const { data } = await axios.get(baseURL, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    movements.value = data.data;
    console.log(movements.value);
  } catch (error) {
    console.log(error);
  }
};


const selectMineral = (mineral) => {
  selectedMineral.value = mineral;
  description.value = mineral.name;
  type.value = mineral.price;
  description.value = mineral.description;

  openModal("modalMineral");
};

const saveMineral = async () => {
  const method = selectedMineral.value && selectedMineral.value.id ? "put" : "post";
  const url = selectedMineral.value && selectedMineral.value.id
    ? `${baseURL}${selectedMineral.value.id}`
    : baseURL;

  const formData = createFormData();
  console.log("FormData:", Object.fromEntries(formData.entries()));
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }
  try {
    const token = localStorage.getItem('token'); 

    await axios[method](url, formData, {
    headers: {
        Authorization: `Bearer ${token}`
        },
    });

    closeModal("modalMineral");
    getMinerals();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const createFormData = () => {
  const formData = new FormData();
  formData.append("user_id", 1); // tiene que ser variable segun user
  formData.append("description", description.value);
  formData.append("type", type.value);
  formData.append("amount", parseFloat(amount.value));
  formData.append("request_date", new Date().toISOString().split('T')[0]);
  formData.append("state", 1);
  return formData;
};

const deleteMineral = async (id) => {
  try {
    const { data } = await axios.patch(baseURL + id);
    getMinerals();
  } catch (error) {
    console.log(error);
  }
};

const reset = () => {
    description.value = "";
    type.value = "";
    amount.value = "";
    request_date.value = "";
  disbursement_date.value = "";
  state.value = "";
};
</script>

<template>
  <div class="container col-md-8 mt-5">
    <div class="card shadow border-0">
      <div class="card-body">
        <h4 class="card-title text-center">Movimientos</h4>
        <div class="text-end">
          <Button
            data-bs-toggle="modal"
            data-bs-target="#modalMineral"
            text="Nuevo"
            icon="fa fa-plus"
          />
        </div>
        <TableMinerals
          :headers="headers"
          :items="movements"
          :actions="{
            edit: selectMineral,
            delete: deleteMineral,
          }"
        />
      </div>
    </div>
    <Modal
      modalId="modalMineral"
      title="Datos del Movimiento"
      :showSaveButton="!selectedMineral?.id"
      :showUpdateButton="Boolean(selectedMineral?.id)"
      @onClose="reset()"
      @onSave="saveMineral()"
    >
      <Input
        id="description"
        label="Descripcion"
        v-model="description"
        type="text"
        placeholder="Ingrese la descripcion"
      />

      <Input
        id="type"
        label="Tipo"
        v-model="type"
        type="text" 
        placeholder="Ingrese el tipo"
      />

      <Input
        id="amount"
        label="Monto"
        v-model="amount"
        type="number"
        placeholder="Ingrese el monto"
      />

      <div v-if="previewUrl" class="mt-3">
        <img :src="previewUrl" alt="Vista_previa" class="img-fluid" />
      </div>
    </Modal>
  </div>
</template>

<style scoped>

</style>