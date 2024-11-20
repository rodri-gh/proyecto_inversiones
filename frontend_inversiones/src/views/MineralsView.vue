<template>
  <div class="container col-md-10 mt-5">
    <h4 class="card-title text-center">Minerales</h4>
    <div class="text-end">
      <Button
        data-bs-toggle="modal"
        data-bs-target="#modalMineral"
        text="Nuevo"
        icon="fa fa-plus"
      />
    </div>
    <CardsSummary :items="summaryMinerals" />
    <TableMinerals
      :headers="headers"
      :items="minerals"
      :actions="{
        edit: selectMineral,
        delete: deleteMineral,
      }"
    />

    <Modal
      modalId="modalMineral"
      title="Datos del Mineral"
      :showSaveButton="!selectedMineral?.id"
      :showUpdateButton="Boolean(selectedMineral?.id)"
      @onClose="reset()"
      @onSave="saveMineral()"
    >
      <Input
        id="name"
        label="Nombre"
        v-model="name"
        type="text"
        placeholder="Ingrese el nombre"
      />

      <Input
        id="price"
        label="Precio"
        v-model="price"
        type="number"
        placeholder="Ingrese el precio"
      />

      <InputTextArea
        id="description"
        label="Descripción"
        v-model="description"
        placeholder="Ingrese la descripción"
      />

      <InputFile
        id="image"
        label="Imagen"
        @update:modelValue="handleImageChange"
        accept="image/*"
        ref="inputFileRef"
      />

      <div v-if="previewUrl" class="mt-3">
        <img :src="previewUrl" alt="Vista_previa" class="img-fluid" />
      </div>
    </Modal>
  </div>
</template>

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
import CardsSummary from "@/components/CardsSummary.vue";

const headers = [
  "Nombre",
  "Precio",
  "Descripción",
  "Imagen",
  "Estado",
  "Acciones",
];

const baseURL = `${import.meta.env.VITE_API_URL}/mineral/`;

const minerals = ref([]);
const name = ref("");
const price = ref("");
const description = ref("");
const image = ref(null);
const previewUrl = ref(null);
const selectedMineral = ref({});
const summaryMinerals = ref([]);

const inputFileRef = ref(null);

onMounted(() => {
  getMinerals();
});

const getMinerals = async () => {
  try {
    const { data } = await axios.get(baseURL);
    minerals.value = data;
    console.log(minerals.value);
    getsummaryMinerals();
  } catch (error) {
    console.log(error);
  }
};

const getsummaryMinerals = () => {
  if (minerals.value.length > 0) {
    let userTotals = minerals.value.length;
    let projectDeleted = 0;
    for (var item of minerals.value) {
      if (item.deleted === 0) {
        projectDeleted++;
      }
    }
    summaryMinerals.value = [
      { key: "Minerales Totales", value: userTotals },
      { key: "Eliminados", value: projectDeleted },
    ];
    console.log(summaryMinerals.value);
  } else {
    console.log("el array de minerals para cards sumary esta vacio");
  }
};

const handleImageChange = (file) => {
  image.value = file;
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  } else {
    previewUrl.value = null;
  }
};

const selectMineral = (mineral) => {
  selectedMineral.value = mineral;
  name.value = mineral.name;
  price.value = mineral.price;
  description.value = mineral.description;
  previewUrl.value = mineral.image;

  openModal("modalMineral");
};

const saveMineral = async () => {
  const method = selectedMineral.value.id ? "put" : "post";
  const url = selectedMineral.value.id
    ? `${baseURL}${selectedMineral.value.id}`
    : baseURL;

  const formData = createFormData();

  try {
    await axios[method](url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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
  formData.append("name", name.value);
  formData.append("price", price.value);
  formData.append("description", description.value);
  if (image.value) {
    formData.append("image", image.value);
  }
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
  name.value = "";
  price.value = "";
  description.value = "";
  image.value = null;
  previewUrl.value = null;
  selectedMineral.value = {};
  inputFileRef.value?.reset();
};
</script>
