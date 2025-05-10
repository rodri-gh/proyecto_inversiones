<template>
  <div>
    <div>
      <h3 class="mb-3">Inversiones del Proyecto</h3>
      <!--   <div>
        <Button
          data-bs-toggle="modal"
          data-bs-target="#modalInvestment"
          text="Nuevo"
          icon="fa fa-plus"
          class="mb-3"
        />
      </div> -->
      <TableInvestments
        :headers="headers"
        :items="investments"
        :actions="{
          edit: selectInvestment,
        }"
      />
    </div>

    <Modal
      modalId="modalInvestment"
      title="Datos"
      modalClass="modal-lg"
      :showSaveButton="!selectedInvestment?.id"
      :showUpdateButton="Boolean(selectedInvestment?.id)"
      @onClose="reset()"
      @onSave="saveInvestment()"
    >
      <div class="row">
        <div class="col-md-6">
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
              <template #no-options> Escriba para buscar usuarios... </template>
            </v-select>
          </div>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-6">
              <Input
                id="amount"
                label="Cantidad"
                type="number"
                v-model="amount"
              />
            </div>
            <div class="col-md-6">
              <Input
                id="investment_date"
                label="Fecha"
                type="date"
                v-model="investment_date"
              />
            </div>
            <div class="col-md-6">
              <Input
                id="profit_percentage"
                label="Porcentaje de Ganancia"
                type="number"
                v-model="profit_percentage"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script setup>
import { onMounted, ref, computed, onUnmounted } from "vue";
import axios from "axios";
import Button from "@/components/base/Button.vue";
import TableInvestments from "@/components/tables/TableInvestments.vue";
import Modal from "@/components/base/Modal.vue";
import Input from "@/components/base/Input.vue";
import Select from "@/components/base/Select.vue";
import { openModal, closeModal } from "@/utils/modal";
import { getHeaderRequest } from "@/authService";
import { eventBus } from "@/eventBus";
import { standardFormatDate } from "@/router/viewFormat";
import VSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const headers = ["Cliente", "Cantidad", "Fecha", "Rendimiento"];

const props = defineProps({
  idProjectInvestment: {
    type: String,
    required: true,
  },
});

const users = ref([]);
const baseURLStandard = `${import.meta.env.VITE_API_URL}/`;
const baseURL = `${import.meta.env.VITE_API_URL}/investment/`;
const investments = ref([]);
const amount = ref(0);
const investment_date = ref("");
const profit_percentage = ref(0);
const selectedInvestment = ref({});
const user_id = ref("");

const header = getHeaderRequest();

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

onMounted(() => {
  getInvestments();
  console.log(props.idProjectInvestment);
  eventBus.on("data-updated", getInvestments);
});

onUnmounted(() => {
  eventBus.off("data-updated", getInvestments);
});

const getInvestments = async () => {
  try {
    const data = await axios.get(
      baseURL + "project/" + props.idProjectInvestment,
      header
    );
    investments.value = data.data;
    console.log("investments", investments.value);
  } catch (error) {
    console.error(error);
  }
};
const selectInvestment = (investment) => {
  console.log(investment);
  selectedInvestment.value = investment;
  user_id.value = investment.userId;
  amount.value = investment.amount;
  investment_date.value = standardFormatDate(investment.investmentDate);
  profit_percentage.value = investment.profitPercentage;
  filters.value = {
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    mineralId: "",
    projectId: "",
    name: investment.user.name,
    userId: investment.userId,
    status: "",
  };
  users.value = [
    {
      id: investment.userId,
      fullName: `${investment.user.name} ${investment.user.lastName}`,
      name: investment.user.name,
      lastName: investment.user.lastName,
    },
  ];
  openModal("modalInvestment");
};

const saveInvestment = async () => {
  const method = selectedInvestment.value.id ? "put" : "post";
  const url = selectedInvestment.value.id
    ? `${baseURL}${selectedInvestment.value.id}`
    : baseURL;
  const formData = createFormData();
  console.log(Array.from(formData.entries()));
  try {
    await axios[method](url, formData, header);
    closeModal("modalInvestment");
    getInvestments();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const createFormData = () => {
  const formData = new FormData();
  formData.append("userId", filters.value.userId);
  formData.append("amount", amount.value);
  formData.append("investmentDate", investment_date.value);
  formData.append("profitPercentage", profit_percentage.value);
  formData.append("projectId", props.idProjectInvestment);
  return formData;
};
const reset = () => {
  amount.value = 0;
  investment_date.value = "";
  profit_percentage.value = 0;
  selectedInvestment.value = {};
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

const searchUsers = async (search, loading) => {
  if (search.length < 2) return;
  loading(true);
  try {
    const { data } = await axios.get(
      `${baseURLStandard}report-admin/users/search?search=${encodeURIComponent(
        search
      )}`,
      { headers: header }
    );
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