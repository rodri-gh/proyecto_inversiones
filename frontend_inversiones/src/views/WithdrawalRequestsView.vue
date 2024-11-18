<template>
  <div class="container col-md-12 mt-5">
    <h4 class="card-title text-center">Solicitudes de Retiro</h4>
    <br />
    <CardsSummary :items="summaryWithdrawals" />

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
          Todos
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
          Aprobados
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
          Rechazados
        </button>
      </li>
    </ul>

    <div class="tab-content" id="withdrawalTabsContent">
      <div class="tab-pane fade show active" id="all" role="tabpanel">
        <TableWithdrawals
          :headers="headers"
          :items="withdrawals"
          :actions="actions"
        />
      </div>
      <div class="tab-pane fade" id="pending" role="tabpanel">
        <TableWithdrawals
          :headers="headers"
          :items="pendingWithdrawals"
          :actions="actions"
        />
      </div>
      <div class="tab-pane fade" id="approved" role="tabpanel">
        <TableWithdrawals
          :headers="headers"
          :items="approvedWithdrawals"
          :actions="actions"
        />
      </div>
      <div class="tab-pane fade" id="rejected" role="tabpanel">
        <TableWithdrawals
          :headers="headers"
          :items="rejectedWithdrawals"
          :actions="actions"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import TableWithdrawals from "@/components/tables/TableWithdrawals.vue";
import CardsSummary from "@/components/CardsSummary.vue";

const withdrawals = ref([]);
const summaryWithdrawals = ref([]);
const baseURL = "http://localhost:3000/withdrawal-request/";

const headers = [
  "Proyecto",
  "Cliente",
  "Monto",
  "Fecha Solicitud",
  "Fecha Aprobación",
  "Estado",
  "Acciones",
];

onMounted(() => {
  getWithdrawals();
});

const getWithdrawals = async () => {
  try {
    const { data } = await axios.get(baseURL);
    withdrawals.value = data;
    console.log("Withdrawals:", withdrawals.value);
    updateSummary();
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
  }
};

const pendingWithdrawals = computed(() =>
  withdrawals.value.filter((w) => w.status === "pending")
);

const approvedWithdrawals = computed(() =>
  withdrawals.value.filter((w) => w.status === "approved")
);

const rejectedWithdrawals = computed(() =>
  withdrawals.value.filter((w) => w.status === "rejected")
);

const updateSummary = () => {
  summaryWithdrawals.value = [
    { key: "Total", value: withdrawals.value.length },
    { key: "Pendientes", value: pendingWithdrawals.value.length },
    { key: "Aprobados", value: approvedWithdrawals.value.length },
    { key: "Rechazados", value: rejectedWithdrawals.value.length },
  ];
};
const approveWithdrawal = async (id) => {
  try {
    const result = await Swal.fire({
      title: "¿Está seguro?",
      text: "¿Desea aprobar esta solicitud de retiro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, aprobar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await axios.patch(`${baseURL}status/${id}`, {
        status: "approved",
      });
      await getWithdrawals();
      Swal.fire("¡Aprobado!", "La solicitud ha sido aprobada.", "success");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "No se pudo aprobar la solicitud", "error");
  }
};

const rejectWithdrawal = async (id) => {
  try {
    const result = await Swal.fire({
      title: "¿Está seguro?",
      text: "¿Desea rechazar esta solicitud de retiro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, rechazar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await axios.patch(`${baseURL}status/${id}`, {
        status: "rejected",
      });
      await getWithdrawals();
      Swal.fire("¡Rechazado!", "La solicitud ha sido rechazada.", "success");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "No se pudo rechazar la solicitud", "error");
  }
};

const actions = {
  approve: approveWithdrawal,
  reject: rejectWithdrawal,
};
</script>

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