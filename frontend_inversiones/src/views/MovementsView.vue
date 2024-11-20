<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Button from "@/components/base/Button.vue";
import Modal from "@/components/base/Modal.vue";
import Input from "@/components/base/Input.vue";
import { openModal, closeModal } from "@/utils/modal";
import TableMovements from "@/components/tables/TableMovements.vue";

const headers = [
  "Descripcion",
  "Tipo",
  "Monto",
  "Fecha de solicitud",
  "Fecha de desembolso",
  "Estado",
];

const baseURL = "https://apiminerales.pruebasdeploy.online/movements/";

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
    const token = localStorage.getItem("token");
    const { data } = await axios.get(baseURL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    movements.value = data.data;
  } catch (error) {
    console.log(error);
  }
};

const selectMineral = (mineral) => {
  selectedMineral.value = mineral;
  description.value = mineral.description;
  type.value = mineral.type;
  amount.value = mineral.amount;
  openModal("modalMineral");
};

const saveMineral = async () => {
  const method =
    selectedMineral.value && selectedMineral.value.movement_id ? "put" : "post";
  const url =
    selectedMineral.value && selectedMineral.value.movement_id
      ? `${baseURL}${selectedMineral.value.movement_id}`
      : baseURL;

  const dataPayload = createData();
  try {
    const token = localStorage.getItem("token");

    await axios[method](url, dataPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    closeModal("modalMineral");
    getMovements();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const createData = () => {
  const data = {
    user_id: 1,
    description: description.value,
    type: type.value,
    amount: amount.value,
    request_date: new Date().toISOString().split("T")[0],
    state: 1,
  };
  return data;
};

const deleteMineral = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const { data } = await axios.delete(baseURL + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getMovements();
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
        <TableMovements
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

      <label :for="id" class="form-label">Tipo</label> <br />
      <select
        id="type"
        label="Tipo"
        v-model="type"
        type="text"
        placeholder="Ingrese el tipo"
      >
        <option value="income">Ingreso</option>
        <option value="expense">Gasto</option>
      </select>

      <Input
        id="amount"
        label="Monto"
        v-model="amount"
        type="number"
        placeholder="Ingrese el monto"
      />
    </Modal>
  </div>
</template>

<style scoped></style>