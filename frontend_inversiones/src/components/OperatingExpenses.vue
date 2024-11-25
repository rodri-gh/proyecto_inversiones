<template>
  <div>
    <div>
      <div class="text-end">
        <Button
          data-bs-toggle="modal"
          data-bs-target="#modalOperatingExpense"
          text="Nuevo"
          icon="fa fa-plus"
          class="mb-3"
        />
      </div>
      <TableOperatingExpenses
        :headers="headers"
        :items="operatingExpenses"
        :actions="{
          edit: selectOperatingExpense,
          delete: deleteOperatingExpense,
        }"
      />
    </div>
    <Modal
      modalId="modalOperatingExpense"
      title="Datos del Gasto Operativo"
      :showSaveButton="!selectedOperatingExpense?.id"
      :showUpdateButton="Boolean(selectedOperatingExpense?.id)"
      @onClose="reset()"
      @onSave="saveOperatingExpense()"
    >
      <Input id="name" v-model="name" label="Nombre" type="text" />
      <InputTextArea
        id="description"
        v-model="description"
        label="Descripción"
      />
      <Input id="expenses" type="number" v-model="expenses" label="Gastos" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import Button from "@/components/base/Button.vue";
import TableOperatingExpenses from "@/components/tables/TableOperatingExpenses.vue";
import Modal from "@/components/base/Modal.vue";
import Input from "@/components/base/Input.vue";
import InputTextArea from "@/components/base/InputTextArea.vue";
import { openModal, closeModal } from "@/utils/modal";
import { getHeaderRequest } from "@/authService";
import { eventBus } from "@/eventBus";

const headers = ["Nombre", "Descripción", "Gastos", "Acciones"];

const props = defineProps({
  idProject: {
    type: String,
    required: true,
  },
});

const baseURL = `${import.meta.env.VITE_API_URL}/operating-expenses/`;
const operatingExpenses = ref([]);
const name = ref("");
const description = ref("");
const expenses = ref(0);
const selectedOperatingExpense = ref({});
const header = getHeaderRequest();

onMounted(() => {
  getOperatingExpenses();
  console.log("Imprimiendo el prop operatingExpenses: ", props.idProject);
  eventBus.on("data-updated", getOperatingExpenses);
});

onUnmounted(() => {
  eventBus.off("data-updated", getOperatingExpenses);
});

const getOperatingExpenses = async () => {
  try {
    console.log(baseURL + "project/");
    console.log(props.idProject);
    const data = await axios.get(
      baseURL + "project/" + props.idProject,
      header
    );
    console.log(data.data);
    operatingExpenses.value = data.data.filter((item) => item.deleted === 0);
  } catch (error) {
    console.error(error);
  }
};

const selectOperatingExpense = (operatingExpense) => {
  selectedOperatingExpense.value = operatingExpense;
  name.value = operatingExpense.name;
  description.value = operatingExpense.description;
  expenses.value = operatingExpense.expenses;

  openModal("modalOperatingExpense");
};

const saveOperatingExpense = async () => {
  const method = selectedOperatingExpense.value.id ? "put" : "post";
  const url = selectedOperatingExpense.value.id
    ? `${baseURL}${selectedOperatingExpense.value.id}`
    : baseURL;
  const formData = createFormData();

  try {
    await axios[method](url, formData, header);
    closeModal("modalOperatingExpense");
    getOperatingExpenses();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const createFormData = () => {
  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("description", description.value);
  formData.append("expenses", expenses.value);
  formData.append("projectId", props.idProject);
  return formData;
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