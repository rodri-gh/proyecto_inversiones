<template>
  <div class="container col-md-10 mt-5">
    <div>
      <h4 class="card-title text-center">Mis Inversiones</h4>
      <CardsSummary :items="summaryInvestments" />

      <ul class="nav nav-tabs" id="userTabs" role="tablist">
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
            id="active-tab"
            data-bs-toggle="tab"
            data-bs-target="#active"
            type="button"
            role="tab"
          >
            Activas
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
            id="closed-tab"
            data-bs-toggle="tab"
            data-bs-target="#closed"
            type="button"
            role="tab"
          >
            Cerradas
          </button>
        </li>
      </ul>

      <div class="tab-content" id="userTabsContent">
        <div class="tab-pane fade show active" id="all" role="tabpanel">
          <TableInvestmentsUser
            :headers="headers"
            :items="investments"
            :actions="{ view: showContractDetails }"
            :showTotal="true"
          />
        </div>
        <div class="tab-pane fade" id="active" role="tabpanel">
          <TableInvestmentsUser
            :headers="headers"
            :items="activeInvestments"
            :actions="{ view: showContractDetails }"
          />
        </div>
        <div class="tab-pane fade" id="pending" role="tabpanel">
          <TableInvestmentsUser
            :headers="headers"
            :items="pendingInvestments"
            :actions="{ view: showContractDetails }"
          />
        </div>
        <div class="tab-pane fade" id="closed" role="tabpanel">
          <TableInvestmentsUser
            :headers="headers"
            :items="closedInvestments"
            :actions="{ view: showContractDetails }"
          />
        </div>
      </div>
    </div>

    <!-- Modal para detalles del contrato -->
    <div class="modal fade" id="contractModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalles del Contrato</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedContract">
            <div class="mb-3">
              <strong>Código del Contrato:</strong>
              <p>{{ selectedContract.contractCode }}</p>
            </div>
            <div class="mb-3">
              <strong>Fecha de Inicio:</strong>
              <p>{{ selectedContract.startDate }}</p>
            </div>
            <div class="mb-3">
              <strong>Fecha de Fin:</strong>
              <p>{{ selectedContract.endDate }}</p>
            </div>
            <div class="mb-3">
              <strong>Monto de Inversión:</strong>
              <p>
                {{ selectedContract.investmentAmount }}
                {{ selectedContract.currency }}
              </p>
            </div>
            <div class="mb-3">
              <strong>Tipo de Contrato:</strong>
              <p>
                {{
                  selectedContract.contractType === "fixed_rate"
                    ? "Tasa Fija"
                    : "Tasa Variable"
                }}
              </p>
            </div>
            <div class="mb-3">
              <strong>Estado:</strong>
              <p>
                {{
                  selectedContract.status === "active"
                    ? "Activo"
                    : selectedContract.status === "pending"
                    ? "Pendiente"
                    : "Finalizado"
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import TableInvestmentsUser from "@/components/tables/TableInvestmentsUser.vue";
import { getHeaderRequest, getUserIdOfLocalStorage } from "@/authService";
import CardsSummary from "@/components/CardsSummary.vue";

const userId = getUserIdOfLocalStorage();
const baseURL = `http://localhost:3000/investment/user/${userId}`;
const investments = ref([]);
const activeInvestments = ref([]);
const pendingInvestments = ref([]);
const closedInvestments = ref([]);
const selectedContract = ref(null);
const header = getHeaderRequest();
const summaryInvestments = ref([]);

const headers = [
  "Fecha de Inversión",
  "Monto",
  "Moneda",
  "Porcentaje de Ganancia",
  "Estado",
];

onMounted(() => {
  getInvestments();
});

const showContractDetails = (investment) => {
  selectedContract.value = investment.contract;
  const modal = new bootstrap.Modal(document.getElementById("contractModal"));
  modal.show();
};

const getInvestments = async () => {
  try {
    const { data } = await axios.get(baseURL, {
      headers: header,
    });
    investments.value = data;
    activeInvestments.value = data.filter((inv) => inv.status === "active");
    pendingInvestments.value = data.filter((inv) => inv.status === "pending");
    closedInvestments.value = data.filter((inv) => inv.status === "closed");
    getSummaryInvestments();
  } catch (error) {
    console.error(error);
  }
};

const getSummaryInvestments = () => {
  if (investments.value.length > 0) {
    const totalInvestments = investments.value.length;
    const activeCount = activeInvestments.value.length;
    const pendingCount = pendingInvestments.value.length;
    const closedCount = closedInvestments.value.length;

    summaryInvestments.value = [
      { key: "Inversiones Totales", value: totalInvestments },
      { key: "Inversiones Activas", value: activeCount },
      { key: "Inversiones Pendientes", value: pendingCount },
      { key: "Inversiones Cerradas", value: closedCount },
    ];
  }
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