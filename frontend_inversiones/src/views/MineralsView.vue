<template>
  <div class="minerals-container">
    <div class="navbar-tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="selectedTab = tab"
        :class="{ active: selectedTab === tab }"
      >
        {{ tab }}
      </button>
    </div>

    <div class="tab-content mt-3">
      <div v-if="selectedTab === 'Precios Historicos'">
        <MineralTrends />
      </div>
      <div v-if="selectedTab === 'Minerales'">
        <div class="container col-md-10 mt-4">
          <h4 class="card-title text-center">Minerales</h4>
          <div class="text-end">
            <Button
              data-bs-toggle="modal"
              data-bs-target="#modalMineral"
              text="Nuevo"
              icon="fa fa-plus"
              class="mb-3"
            />
          </div>
          <!--  <CardsSummary :items="summaryMinerals" /> -->
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
              min="0"
              placeholder="Ingrese el precio"
              @input="validateNumber($event.target.value)"
            />
            <span v-if="numberError" class="text-danger small mt-1 d-block">
              {{ numberError }}
            </span>

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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "@/components/base/Button.vue";
import TableMinerals from "@/components/tables/TableMinerals.vue";
import Modal from "@/components/base/Modal.vue";
import Input from "@/components/base/Input.vue";
import InputTextArea from "@/components/base/InputTextArea.vue";
import InputFile from "@/components/base/InputFile.vue";
import { openModal, closeModal } from "@/utils/modal";
import CardsSummary from "@/components/CardsSummary.vue";
import MineralTrends from "@/components/MineralTrends.vue";
import {
  validateInputs,
  successAlert,
  existAlert,
} from "@/utils/validateInputs";

const selectedTab = ref("Precios Historicos");
const tabs = ["Precios Historicos", "Minerales"];
const headers = [
  "Nombre",
  "Precio Estimado $",
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
const numberError = ref("");

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

const validateNumber = (value) => {
  if (value < 0) {
    numberError.value = "El precio no puede ser menor a 0";
    return false;
  } else {
    numberError.value = "";
    return true;
  }
};

const getsummaryMinerals = () => {
  if (minerals.value.length > 0) {
    let userTotals = minerals.value.length;
    let projectDeleted = 0;
    for (var item of minerals.value) {
      if (item.deleted === 1) {
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
  if (!validateNumber(price.value)) {
    Swal.fire({
      icon: "error",
      title: "Error el precio no puede ser menor a 0",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  const fieldsToValidate = [
    { value: name.value, name: "Nombre", type: "text" },
    { value: price.value, name: "Precio", type: "number" },
    { value: description.value, name: "Descripción", type: "text" },
  ];

  if (!selectedMineral.value.id) {
    fieldsToValidate.push({ value: image.value, name: "Imagen", type: "file" });
  }

  if (!validateInputs(fieldsToValidate)) {
    return;
  }

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
    successAlert("Mineral guardado correctamente");
    getMinerals();
    reset();
  } catch (error) {
    if (error.response.status === 409) {
      existAlert("El mineral ya existe");
    } else {
      console.log(error);
    }
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

const deleteMineral = async (mineral) => {
  const isDeleted = mineral.deleted === 1;

  Swal.fire({
    title: "¿Estás seguro?",
    text: isDeleted
      ? "¿Deseas restaurar este mineral?"
      : "¿Deseas eliminar este mineral?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: isDeleted ? "Sí, restaurar" : "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const { data } = await axios.patch(baseURL + mineral.id);
        getMinerals();
        successAlert(
          isDeleted
            ? "Mineral restaurado correctamente"
            : "Mineral eliminado correctamente"
        );
      } catch (error) {
        console.log(error);
      }
    }
  });
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

<style scoped>
.minerals-container {
  max-height: 850px;
  overflow-y: auto;
}
.navbar-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  border-radius: 30px;
}

.navbar-tabs button {
  padding: 10px 20px;
  border: none;
  border-radius: 30px !important;
  background-color: #ffffff;
  cursor: pointer;
  border-radius: 5px;
}

.navbar-tabs button.active {
  background-color: #204d7c;
  border-radius: 30px;
  color: white;
}

.navbar-tabs button:hover {
  background-color: #879dda;
  color: #04090e;
  border-radius: 10px;
}

.tab-content {
  padding: 10px;
  border-radius: 5px;
}
</style>
