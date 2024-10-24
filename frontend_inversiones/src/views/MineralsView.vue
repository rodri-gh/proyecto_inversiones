<template>
  <div class="container col-md-8 mt-5">
    <div class="card shadow border-0">
      <div class="card-body">
        <h4 class="card-title text-center">Minerales</h4>
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
          :items="minerals"
          :actions="{
            edit: selectMineral,
            delete: deleteMineral,
          }"
        />
      </div>
    </div>
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

const headers = [
  "Nombre",
  "Precio",
  "Descripción",
  "Imagen",
  "Estado",
  "Acciones",
];

const baseURL = "http://localhost:3000/minerals/";

const minerals = ref([]);
const name = ref("");
const price = ref("");
const description = ref("");
const image = ref(null);
const previewUrl = ref(null);
const selectedMineral = ref({});

onMounted(() => {
  getMinerals();
});

const getMinerals = async () => {
  try {
    const { data } = await axios.get(baseURL);
    minerals.value = data.data;
  } catch (error) {
    console.log(error);
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
};
</script>
