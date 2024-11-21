<script setup>
import { getHeaderRequest, getUserIdOfLocalStorage } from "@/authService";
import { openModal, closeModal } from "@/utils/modal";
import axios from "axios";
import { ref, onMounted } from "vue";
import Button from "@/components/base/Button.vue";
import InputFile from "@/components/base/InputFile.vue";
import TableWithdrawalUsers from "./tables/TableWithdrawalUsers.vue";
import CardsSummary from "@/components/CardsSummary.vue";

const baseUrl = `${import.meta.env.VITE_API_URL}/withdrawal-request/user/`;
const investmentsUrl = `${import.meta.env.VITE_API_URL}/investment/user/`;

const withdrawalRequests = ref([]);
const pendingRequests = ref([]);
const approvedRequests = ref([]);
const rejectedRequests = ref([]);
const closedInvestments = ref([]);
const summaryRequests = ref([]);
const newRequest = ref({
  investmentId: "",
  userId: getUserIdOfLocalStorage(),
  requestAmount: "",
  photoDocument: null,
  selfiePhoto: null,
});

const inputFileRef = ref(null);

const userId = getUserIdOfLocalStorage();
const header = getHeaderRequest();

const headers = [
  "Proyecto",
  "Cantidad",
  "Fecha de Solicitud",
  "Fecha de Aprobacion",
  "Estado",
];

onMounted(() => {
  getWithdrawalRequests();
  getInvestments();
});

const getWithdrawalRequests = async () => {
  try {
    const response = await axios.get(baseUrl + userId, header);
    if (Array.isArray(response.data.data)) {
      withdrawalRequests.value = response.data.data;
      pendingRequests.value = withdrawalRequests.value.filter(
        (req) => req.status === "pending"
      );
      approvedRequests.value = withdrawalRequests.value.filter(
        (req) => req.status === "approved"
      );
      rejectedRequests.value = withdrawalRequests.value.filter(
        (req) => req.status === "rejected"
      );

      console.log("Solicitudes de retiro:", withdrawalRequests.value);
      updateSummaryRequests();
    } else {
      console.error("La respuesta de la API no es un array:", response.data);
    }
  } catch (e) {
    console.error(e);
  }
};

const getInvestments = async () => {
  try {
    const response = await axios.get(investmentsUrl + userId, header);
    const allInvestments = response.data;
    closedInvestments.value = allInvestments.filter(
      (inv) =>
        inv.status === "closed" &&
        !withdrawalRequests.value.some((req) => req.investmentId === inv.id)
    );
  } catch (e) {
    console.error(e);
  }
};

const updateSummaryRequests = () => {
  const totalRequests = withdrawalRequests.value.length;
  const pendingCount = pendingRequests.value.length;
  const approvedCount = approvedRequests.value.length;
  const rejectedCount = rejectedRequests.value.length;

  summaryRequests.value = [
    { key: "Solicitudes Totales", value: totalRequests },
    { key: "Solicitudes Pendientes", value: pendingCount },
    { key: "Solicitudes Aprobadas", value: approvedCount },
    { key: "Solicitudes Rechazadas", value: rejectedCount },
  ];
};

const handleImageChange = (file, type) => {
  newRequest.value[type] = file;
};

const updateAmount = () => {
  const selectedInvestment = closedInvestments.value.find(
    (inv) => inv.id === newRequest.value.investmentId
  );
  if (selectedInvestment) {
    newRequest.value.requestAmount = selectedInvestment.earnings;
  }
};

const submitRequest = async () => {
  const formData = new FormData();
  formData.append("investmentId", newRequest.value.investmentId);
  formData.append("userId", newRequest.value.userId);
  formData.append("requestAmount", newRequest.value.requestAmount);
  if (newRequest.value.photoDocument) {
    formData.append("photoDocument", newRequest.value.photoDocument);
  }
  if (newRequest.value.selfiePhoto) {
    formData.append("selfiePhoto", newRequest.value.selfiePhoto);
  }

  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/withdrawal-request`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    closeModal("modalRequest");
    resetForm();
    getWithdrawalRequests();
    getInvestments();
  } catch (error) {
    console.error(error);
  }
};

const resetForm = () => {
  newRequest.value = {
    investmentId: "",
    userId: getUserIdOfLocalStorage(),
    amount: "",
    photoDocument: null,
    selfiePhoto: null,
  };
  inputFileRef.value?.reset();
};
</script>

<template>
  <div class="container col-md-10 mt-5">
    <h3>Tus Solicitudes de Retiro</h3>
    <CardsSummary :items="summaryRequests" />
    <div class="text-end mb-3">
      <Button
        data-bs-toggle="modal"
        data-bs-target="#modalRequest"
        text="Solicitar Retiro"
        icon="fa fa-plus"
      />
    </div>
    <ul class="nav nav-tabs" id="withdrawalTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          id="all-tab"
          data-bs-toggle="tab"
          data-bs-target="#all"
          type="button"
          role="tab"
        >
          Todas
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="pending-tab"
          data-bs-toggle="tab"
          data-bs-target="#pending"
          type="button"
          role="tab"
        >
          Pendientes
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="approved-tab"
          data-bs-toggle="tab"
          data-bs-target="#approved"
          type="button"
          role="tab"
        >
          Aprobadas
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="rejected-tab"
          data-bs-toggle="tab"
          data-bs-target="#rejected"
          type="button"
          role="tab"
        >
          Rechazadas
        </button>
      </li>
    </ul>

    <div class="tab-content" id="withdrawalTabsContent">
      <div class="tab-pane fade show active" id="all" role="tabpanel">
        <TableWithdrawalUsers :headers="headers" :items="withdrawalRequests" />
      </div>
      <div class="tab-pane fade" id="pending" role="tabpanel">
        <TableWithdrawalUsers :headers="headers" :items="pendingRequests" />
      </div>
      <div class="tab-pane fade" id="approved" role="tabpanel">
        <TableWithdrawalUsers :headers="headers" :items="approvedRequests" />
      </div>
      <div class="tab-pane fade" id="rejected" role="tabpanel">
        <TableWithdrawalUsers :headers="headers" :items="rejectedRequests" />
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="modalRequest"
      tabindex="-1"
      aria-labelledby="modalRequestLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalRequestLabel">Solicitar Retiro</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="investmentId" class="form-label">Proyecto</label>
              <select
                id="investmentId"
                class="form-select"
                v-model="newRequest.investmentId"
                @change="updateAmount"
              >
                <option value="" disabled>Seleccione un proyecto</option>
                <option
                  v-for="investment in closedInvestments"
                  :key="investment.id"
                  :value="investment.id"
                >
                  {{ investment.project.name }}
                </option>
              </select>
            </div>
            <InputFile
              id="photoDocument"
              label="Documento Fotográfico"
              @update:modelValue="
                (file) => handleImageChange(file, 'photoDocument')
              "
              accept="image/*"
              ref="inputFileRef"
            />
            <InputFile
              id="selfiePhoto"
              label="Foto Selfie"
              @update:modelValue="
                (file) => handleImageChange(file, 'selfiePhoto')
              "
              accept="image/*"
              ref="inputFileRef"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="resetForm"
            >
              Cerrar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="submitRequest"
            >
              Solicitar Retiro
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-tabs .nav-link {
  color: #495057;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-bottom-color: transparent;
}
.nav-link {
  border-radius: 0;
}
.nav-tabs .nav-link.active {
  color: white;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.tab-content > .tab-pane {
  display: none;
}

.tab-content > .active {
  display: block;
}
</style>