<script setup>
import {
  getHeaderRequest,
  getHeaderRequestMultiPartFormData,
} from "@/authService";
import axios from "axios";
import { onMounted, ref, computed, onUnmounted, defineProps } from "vue";
import Modal from "./base/Modal.vue";
import Button from "./base/Button.vue";
import Input from "@/components/base/Input.vue";
import { openModal, closeModal } from "@/utils/modal";
import TableContracts from "./tables/TableContracts.vue";
import { eventBus } from "@/eventBus";
import { handleErrorSwal } from "@/errorMixin";
import { formatDate } from "@/router/viewFormat";
import VSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import {
  validateInputs,
  existAlert,
  successAlert,
} from "@/utils/validateInputs";
import Swal from "sweetalert2";

const props = defineProps({
  idProject: {
    type: String,
    required: true,
  },
  project: {
    type: Object,
    required: true,
  },
});

const header = getHeaderRequestMultiPartFormData();
const hearderNormal = getHeaderRequest();
const contracts = ref([]);

const users = ref([]);
const baseURL = `${import.meta.env.VITE_API_URL}/`;

const userId = ref("");
const investmentAmount = ref("");
const contractCode = ref("");
const startDate = formatDate(props.project.startDate);
const endDate = formatDate(props.project.endDate);
const status = ref("open");
const contractType = ref("");
const currency = ref("");
const contractFilePath = ref(null);
const selectedContract = ref({});
const amountsInvestmentGoal = ref({});
const filters = ref({
  startDate: "",
  endDate: "",
  minAmount: "",
  maxAmount: "",
  mineralId: "",
  projectId: "",
  userId: "",
  status: "",
});

const headers = [
  "Cliente",
  "Inversión",
  "Cod. Contrato",
  "Inicio",
  "Finalización",
  "Tipo de Contrato",
  "Moneda",
  "Acciones",
];

const getContracts = async () => {
  try {
    const response = await axios.get(
      baseURL + "contract/project/" + props.idProject,
      header
    );
    contracts.value = response.data;
    console.log(response.data);
  } catch (e) {
    console.log(e);
  }
};

const updateData = () => {
  eventBus.emit("data-updated");
};

onMounted(() => {
  getContracts();
  getAmountsInvestmentGoal();
  eventBus.on("data-updated", getContracts);
});

onUnmounted(() => {
  eventBus.off("data-updated", getContracts);
});

const getAmountsInvestmentGoal = async () => {
  try {
    const data = await axios.get(
      baseURL + "analysisReport/verifyProjectInvestmentGoal/" + props.idProject,
      hearderNormal
    );
    amountsInvestmentGoal.value = data.data;
    console.log(data.data);
  } catch (error) {
    console.error(error);
  }
};

const selectContract = (contract) => {
  selectedContract.value = contract;
  userId.value = contract.userId;
  investmentAmount.value = contract.investmentAmount;
  contractCode.value = contract.contractCode;
  status.value = contract.status;
  contractType.value = contract.contractType;
  currency.value = contract.currency;
  filters.value = {
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    mineralId: "",
    projectId: "",
    name: contract.user.name,
    userId: contract.userId,
    status: "",
  };
  users.value = [
    {
      id: contract.userId,
      fullName: `${contract.user.name} ${contract.user.lastName}`,
      name: contract.user.name,
      lastName: contract.user.lastName,
    },
  ];
  openModal("modalContract");
};

const deleteContract = async (contrato) => {
  const isDeleted = contrato.deleted === 1;
  Swal.fire({
    title: "¿Estás seguro?",
    text: isDeleted
      ? "¿Deseas restaurar este contrato?"
      : "¿Deseas eliminar este contrato?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: isDeleted ? "Sí, restaurar" : "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const data = await axios.patch(baseURL + "contract/" + contrato.id);
        console.log(data);
        getContracts();
        updateData();
        successAlert(
          isDeleted
            ? "Contrato restaurado correctamente"
            : "Contrato eliminado correctamente"
        );
      } catch (error) {
        console.error(error);
      }
    }
  });
};

const saveContract = async () => {
  const fieldsToValidate = [
    { value: filters.value.userId, name: "Usuario", type: "select" },
    { value: contractCode.value, name: "Codigo para almacén", type: "text" },
    { value: contractType.value, name: "Tipo de contrato", type: "select" },
    { value: currency.value, name: "Moneda", type: "select" },
    {
      value: investmentAmount.value,
      name: "Cantidad de inversión",
      type: "number",
    },
  ];

  if (!selectedContract.value.id) {
    fieldsToValidate.push({
      value: contractFilePath.value,
      name: "Contrato",
      type: "file",
    });
  }

  if (!validateInputs(fieldsToValidate)) {
    return;
  }

  const method = selectedContract.value.id ? "put" : "post";
  const url = selectedContract.value.id
    ? `${baseURL + "contract/"}${selectedContract.value.id}`
    : baseURL + "contract/";
  const formData = createFormData();
  console.log(method + url);
  console.log(Array.from(formData.entries()));
  try {
    await axios[method](url, formData, header);
    closeModal("modalContract");
    getContracts();
    getAmountsInvestmentGoal();
    updateData();
    reset();
  } catch (e) {
    // handleErrorSwal(e, "Error al guardar el Contrato");
    handleErrorSwal(e, "Ya existe un contrato con ese código");
  }
};

const createFormData = () => {
  const formData = new FormData();
  formData.append("projectId", props.idProject);
  formData.append("userId", filters.value.userId);
  formData.append("investmentAmount", investmentAmount.value);
  formData.append("contractCode", contractCode.value);
  formData.append("startDate", props.project.startDate);
  formData.append("endDate", props.project.endDate);
  formData.append("status", status.value);
  formData.append("contractType", contractType.value);
  formData.append("currency", currency.value);
  formData.append("contractFilePath", contractFilePath.value);

  return formData;
};

const selectedUser = computed(() => {
  return users.value.find((user) => String(user.id) === String(userId.value));
});

const reset = () => {
  investmentAmount.value = 0;
  (contractCode.value = ""), (status.value = "");
  contractType.value = "";
  currency.value = "";
  selectedContract.value = {};
  contractFilePath.value = null;
  filters.value = {
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    mineralId: "",
    projectId: "",
    userId: "",
    status: "",
  };
  users.value = [];
};

const handleFileChange = (fileEvent) => {
  const file = fileEvent.target.files[0];
  if (file && file.type === "application/pdf") {
    contractFilePath.value = file;
  } else {
    contractFilePath.value = null;
    alert("Debes selecciona un archivo pdf valido.");
  }
};

const previewUrl = computed(() => {
  if (contractFilePath.value) {
    return URL.createObjectURL(contractFilePath.value);
  }
  return "";
});

const searchUsers = async (search, loading) => {
  console.log("Search term:", search);
  if (search.length < 2) return;
  loading(true);
  try {
    console.log(
      "Endpoint URL:",
      `${baseURL}users/search?search=${encodeURIComponent(search)}`
    );
    const { data } = await axios.get(
      `${baseURL}report-admin/users/search?search=${encodeURIComponent(
        search
      )}`,
      { headers: header }
    );
    console.log("Users result:", data);
    users.value = data.map((user) => ({
      id: user.id,
      fullName: `${user.name} ${user.lastName}`,
      name: user.name,
      lastName: user.lastName,
    }));

    // Si hay un usuario seleccionado, asegurarse de mantenerlo en las opciones
    if (filters.value.userId) {
      const selectedUser = users.value.find(
        (u) => u.id === filters.value.userId
      );
      if (!selectedUser) {
        const currentUser = users.value.find(
          (u) => u.id === filters.value.userId
        );
        if (currentUser) {
          users.value = [...users.value, currentUser];
        }
      }
    }
  } catch (error) {
    console.error("Error buscando usuarios:", error);
  } finally {
    loading(false);
  }
};
</script>

<template>
  <div>
    <div>
      <div>
        <div class="d-flex justify-content-between">
          <h3>Contratos del Proyecto</h3>
          <Button
            data-bs-toggle="modal"
            data-bs-target="#modalContract"
            text="Nuevo"
            icon="fa fa-plus"
            class="mb-3"
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
            <div
              v-if="
                amountsInvestmentGoal.investmentGoalOfProject ===
                amountsInvestmentGoal.totalInvestmentOfProject
              "
            >
              <p>No se puede invertir más!!</p>
              <p>
                Meta alcanzada:
                <strong
                  >${{ amountsInvestmentGoal.investmentGoalOfProject }}</strong
                >
              </p>
            </div>
            <div
              v-if="
                amountsInvestmentGoal.totalInvestmentOfProject <
                amountsInvestmentGoal.investmentGoalOfProject
              "
            >
              <p>Monto disponible para invertir</p>
              <p>
                <strong
                  >$1 - ${{
                    amountsInvestmentGoal.amountAvailableForInvestment
                  }}
                </strong>
              </p>
            </div>
            <Input
              id="investmentAmount"
              label="Cantidad de inversión"
              type="number"
              v-model="investmentAmount"
            />
            <br />
            <div>
              <label class="form-label">Usuario</label>
              <v-select
                v-model="filters.userId"
                :options="users"
                :reduce="(option) => option.id"
                label="fullName"
                :filterable="false"
                @search="searchUsers"
                placeholder="Buscar usuario..."
              >
                <template #no-options>
                  Escriba para buscar usuarios...
                </template>
              </v-select>
            </div>
          </div>
          <div class="col-md-8">
            <div class="row">
              <div class="col-md-6">
                <label for=""> Fecha de Inicio</label>
                <p>
                  <strong>{{ startDate }}</strong>
                </p>
              </div>
              <div class="col-md-6">
                <label for=""> Fecha de Fin</label>
                <p>
                  <strong> {{ endDate }}</strong>
                </p>
              </div>
              <div class="col-md-6 mt-3">
                <Input
                  id="contractCode"
                  label="Código para almacén"
                  type="text"
                  v-model="contractCode"
                />
              </div>
              <div class="col-md-6 mt-2">
                <label for="" class="form-label">Tipo de contrato</label>
                <select
                  class="form-select form-select"
                  v-model="contractType"
                  id="contractType"
                >
                  <option value="">Selecione una tasa</option>
                  <option value="fixed_rate">tasa fija</option>
                  <option value="variable_rate">tasa variable</option>
                </select>
              </div>
              <div class="col-md-6 mt-3">
                <label for="" class="form-label">Moneda</label>
                <select
                  class="form-select form-select"
                  v-model="currency"
                  id="currency"
                >
                  <option value="">Selecione una Moneda</option>
                  <option value="USD">Dólares</option>
                  <option value="BS">Bolivianos</option>
                </select>
              </div>
              <div class="col-md-12 mt-3">
                <label for="" class="form-label"
                  >PDF Escaneado del contrato</label
                >
                <input
                  type="file"
                  id="contractFilePath"
                  name="contract"
                  @change="handleFileChange"
                  accept=".pdf"
                  required
                />
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
input {
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 50px;
  outline: none;
}
</style>