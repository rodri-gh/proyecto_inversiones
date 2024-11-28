<template>
  <div>
    <div>
      <div>
        <div class="text-end">
          <Button
            data-bs-toggle="modal"
            data-bs-target="#modalMineral"
            text="Nuevo"
            icon="fa fa-plus"
            @click="resetModal"
            :disabled="projectMinerals.length >= 2"
            class="mb-3"
          />
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Mineral</th>
                <th scope="col">Peso en Onzas</th>
                <th scope="col">Estimado de Compra</th>
                <th scope="col">Pre Compra</th>
                <th scope="col">Compra</th>
                <th scope="col">Venta</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="projectMinerals.length == 0">
                <td colspan="6" class="text-center">
                  No hay minerales asociados a este proyecto
                </td>
              </tr>

              <tr
                v-for="projectMineral in projectMinerals"
                :key="projectMineral.id"
              >
                <td>{{ projectMineral.mineral.name }}</td>
                <td>{{ projectMineral.weightOunces }}</td>
                <td>{{ projectMineral.estimatedPurchasePrice }}</td>
                <td>{{ projectMineral.prePurchase }}</td>
                <td>{{ projectMineral.purchasePrice }}</td>
                <td>{{ projectMineral.salePrice }}</td>
                <td>
                  <button
                    class="btn btn-warning btn-sm m-1"
                    @click="selectProjectMineral(projectMineral)"
                  >
                    <i class="fa fa-edit"></i>
                  </button>
                  <button
                    class="btn btn-danger btn-sm m-1"
                    @click="deleteProjectMineral(projectMineral.id)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="modalMineral"
      tabindex="-1"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      role="dialog"
      aria-labelledby="modalTitleId"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitleId">Minerales</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="resetModal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-4">
                <div class="mb-3">
                  <label for="mineral" class="form-label">
                    Selecciona un mineral
                  </label>
                  <select
                    class="form-select"
                    id="mineral"
                    :disabled="selectedMinerals.length >= 1"
                    v-model="selectedMineral"
                    @change="addMineral"
                  >
                    <option value="">Seleccione un mineral</option>
                    <option
                      v-for="mineral in availableMinerals"
                      :key="mineral.id"
                      :value="mineral"
                    >
                      {{ mineral.name }} = {{ mineral.price }} $
                    </option>
                  </select>
                </div>
                <div>
                  <Input
                    id="estimatedPurchasePrice"
                    label="Estimado de Compra"
                    type="number"
                    v-model="estimatedPurchasePrice"
                  />
                  <Input
                    id="prePurchase"
                    label="Precio pre compra"
                    type="number"
                    v-model="prePurchase"
                  />
                  <br />
                  <Input
                    id="purchasePrice"
                    label="Precio de compra"
                    type="number"
                    v-model="purchasePrice"
                  />
                  <br />
                  <Input
                    id="exitPrice"
                    label="Precio salida del ingenio"
                    type="number"
                    v-model="exitPrice"
                  />
                  <br />
                  <Input
                    id="salePrice"
                    label="Ingrese precio de Venta"
                    type="number"
                    v-model="salePrice"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div v-if="selectedMinerals.length > 0">
                  <h6>Mineral seleccionado:</h6>
                  <ul class="list-group">
                    <li
                      v-for="mineral in selectedMinerals"
                      :key="mineral.id"
                      class="list-group-item"
                    >
                      <button
                        class="btn btn-danger btn-sm"
                        @click="removeMineral(mineral)"
                      >
                        <i class="fa fa-times"></i>
                      </button>
                      - <i class="fas fa-gem text-center"></i>
                      <strong>{{ mineral.name }} </strong>
                      <br />
                      <br />
                      <label for=""> Precio Estimado Actual:</label>
                      <p>
                        <strong>{{ mineral.price }} $</strong>
                        por Onza
                      </p>
                    </li>
                  </ul>
                </div>
                <Input
                  id="weightOuncesMineral"
                  label="Peso en Onzas del mineral"
                  type="number"
                  v-model="weightOuncesMineral"
                />
                <div v-if="calculateMineralQuotation > 0">
                  <Input
                    id="calculateMineralQuotation"
                    label="+ 50% Cotizacion por Onza"
                    type="number"
                    v-model="calculateMineralQuotation"
                  />
                  <div class="mt-3">
                    <label for="">Estimacion Precio Venta</label>
                    <p>90% Cotiz. 10% Precio actual</p>
                    <p>
                      90% =
                      <strong>{{ calculateMineralQuotation * 0.9 }} $</strong>
                    </p>
                    <p>
                      10% =
                      <strong>{{ selectedMinerals[0].price * 0.1 }} $</strong>
                    </p>
                    <p>
                      Venta Sugerida =
                      <strong
                        >{{
                          selectedMinerals[0].price * 0.1 +
                          calculateMineralQuotation * 0.9
                        }}
                        $</strong
                      >
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <Select
                  :options="users"
                  label="Usuario Comprador"
                  value-key="id"
                  label-key="name"
                  v-model="userId"
                  select-class="col-8"
                />
                <div class="mt-2">
                  <p>
                    User: {{ selectedUser?.name || "Seleccione un usuario" }}
                  </p>
                  <p>
                    Email: {{ selectedUser?.email || "Seleccione un usuario" }}
                  </p>
                  <p>
                    Cel: {{ selectedUser?.phone || "Seleccione un usuario" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="resetModal"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="selectedMinerals.length === 0"
              @click="saveProjectMinerals"
            >
              {{ isEditing ? "Actualizar" : "Guardar" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { getHeaderRequest } from "@/authService";
import Input from "./base/Input.vue";
import Button from "./base/Button.vue";
import { eventBus } from "@/eventBus";
import Select from "./base/Select.vue";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { handleErrorSwal } from "@/errorMixin";
import Swal from "sweetalert2";

const props = defineProps({
  idProjectMineral: {
    type: String,
    required: true,
  },
});

const baseURL = `${import.meta.env.VITE_API_URL}/`;
const baseUrlUsers = `${import.meta.env.VITE_API_URL}/user/`;

// Estados reactivos
const projectMinerals = ref([]);
const minerals = ref([]);
const users = ref([]);

const estimatedPurchasePrice = ref(0);
const prePurchase = ref(0);
const purchasePrice = ref(0);
const exitPrice = ref(0);
const salePrice = ref(0);
const weightOuncesMineral = ref(0);
const mineralQuotation = ref(0);
const userId = ref(null);

const selectedMinerals = ref([]);
const selectedMineral = ref("");
const selectedProjectMineral = ref({});
const isEditing = ref(false);
const header = getHeaderRequest();
const pricesMinerals = ref([]);

onMounted(() => {
  getprojectMinerals();
  getUsers();
  getMinerals();
  eventBus.on("data-updated", getprojectMinerals);
});

onMounted(() => {
  eventBus.off("data-updated", getprojectMinerals);
});

const getprojectMinerals = async () => {
  try {
    const data = await axios.get(
      baseURL + "projectMinerals/projects/" + props.idProjectMineral,
      header
    );
    projectMinerals.value = data.data;
    console.log(data.data);
  } catch (error) {
    console.error(error);
  }
};

const getMinerals = async () => {
  try {
    const data = await axios.get(
      `${import.meta.env.VITE_API_URL}/mineral/`,
      header
    );
    minerals.value = data.data;
    await getMineralsPrices();
    minerals.value.forEach((mineral) => {
      pricesMinerals.value.forEach((item) => {
        if (item.name === mineral.name.toLowerCase()) {
          mineral.price = item.price;
        }
      });
    });
    console.log(minerals.value);
  } catch (error) {
    console.error("Error al obtener minerales:", error);
  }
};

const getMineralsPrices = async () => {
  try {
    const response = await axios.get(baseURL + "apiMineralPrices/", header);
    console.log("precios de los minerales: " + response.data);
    pricesMinerals.value = response.data;
  } catch (e) {
    console.error(e);
  }
};

const getUsers = async () => {
  try {
    const data = await axios.get(baseUrlUsers, header);
    users.value = data.data;
    console.log(data.data);
  } catch (error) {
    console.error("Error al obtener minerales:", error);
  }
};

const availableMinerals = computed(() => {
  // Filtrar minerales que ya están en el proyecto
  const existingMineralIds = projectMinerals.value.map((pm) => pm.mineral_id);
  return minerals.value.filter(
    (mineral) =>
      !existingMineralIds.includes(mineral.id) &&
      !selectedMinerals.value.some((selected) => selected.id === mineral.id)
  );
});

const addMineral = () => {
  if (selectedMineral.value && selectedMinerals.value.length < 2) {
    selectedMinerals.value.push(selectedMineral.value);
  }
};

const removeMineral = (mineral) => {
  selectedMinerals.value = selectedMinerals.value.filter(
    (m) => m.id !== mineral.id
  );
  selectedMineral.value = "";
};

// Métodos de acciones principales
const toggleProjectMineralStatus = async (projectMineral) => {
  try {
    const newStatus = !projectMineral.isActive;
    const message = newStatus ? "activar" : "desactivar";

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas ${message} este mineral del proyecto?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Sí, ${message}`,
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      await axios.patch(baseURL + projectMineral.id);
      await getprojectMinerals();
      Swal.fire(
        "¡Eliminado!",
        "El mineral ha sido eliminado del proyecto.",
        "success"
      );
    }
  } catch (e) {
    handleErrorSwal(e, "Error");
  }
};

const saveProjectMinerals = async () => {
  const method = selectedProjectMineral.value.id ? "put" : "post";
  const url = selectedProjectMineral.value.id
    ? `${baseURL + "projectMinerals/"}${selectedProjectMineral.value.id}`
    : baseURL + "projectMinerals/";

  const projectMineral = {
    projectId: props.idProjectMineral,
    mineralId: selectedMineral.value.id,
    userId: userId.value,
    operatingExpenseId: selectedProjectMineral.value.operatingExpenseId,
    weightOunces: weightOuncesMineral.value,
    purchasePrice: purchasePrice.value,
    prePurchase: prePurchase.value,
    estimatedPurchasePrice: estimatedPurchasePrice.value,
    exitPrice: exitPrice.value,
    salePrice: salePrice.value,
  };
  const currentMinerals = projectMinerals.value.length;
  const newMineralsCount = selectedMinerals.value.length;
  if (!isEditing.value && currentMinerals + newMineralsCount > 2) {
    Swal.fire(
      "Error",
      "No se pueden agregar más de 2 minerales por proyecto.",
      "error"
    );
    return;
  }
  console.log(projectMineral);
  try {
    await axios[method](url, projectMineral, header);
    await getprojectMinerals();
    closeModal();

    Swal.fire(
      "¡Éxito!",
      isEditing.value
        ? "Mineral actualizado correctamente."
        : "Minerales agregados correctamente.",
      "success"
    );
  } catch (e) {
    handleErrorSwal(e, "Error al Guardar Mineral del Projecto");
    closeModal();
  }
};

const deleteProjectMineral = async (id) => {
  try {
    const response = await axios.patch(
      baseURL + "projectMinerals/" + id,
      header
    );
    getprojectMinerals();
    Swal.fire("Eliminado", "El mineral se eliminó correctamente.", "success");
  } catch (e) {
    handleErrorSwal(e, "Error no se pudo eliminar el mineral del proyecto");
  }
};

const selectProjectMineral = (projectMineral) => {
  isEditing.value = true;
  selectedProjectMineral.value = projectMineral;
  userId.value = projectMineral.userId;
  estimatedPurchasePrice.value = projectMineral.estimatedPurchasePrice;
  mineralQuotation.value = projectMineral.mineralQuotation || 0;
  prePurchase.value = projectMineral.prePurchase;
  purchasePrice.value = projectMineral.purchasePrice;
  exitPrice.value = projectMineral.exitPrice;
  salePrice.value = projectMineral.salePrice;
  weightOuncesMineral.value = projectMineral.weightOunces;

  const mineralToEdit = minerals.value.find(
    (m) => m.id === projectMineral.mineralId
  );
  if (mineralToEdit) {
    selectedMinerals.value = [mineralToEdit];
  }
  const modalEl = document.getElementById("modalMineral");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
};

const resetModal = () => {
  selectedMinerals.value = [];
  selectedMineral.value = "";
  isEditing.value = false;
  selectedProjectMineral.value = {};
  selectedMineral.value = "";
  weightOuncesMineral.value = 0;
  userId.value = null;
  prePurchase.value = ref(0);
  purchasePrice.value = ref(0);
  exitPrice.value = ref(0);
  salePrice.value = ref(0);
};

const closeModal = () => {
  const modalEl = document.getElementById("modalMineral");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
  resetModal();
};

const selectedUser = computed(() => {
  return users.value.find((user) => String(user.id) === String(userId.value));
});

const calculateMineralQuotation = computed(() => {
  return 1.5 * purchasePrice.value || 0;
});
</script>

<style scoped>
.table-secondary {
  opacity: 0.7;
}
.table-container {
  max-height: 400px; /* Ajusta este valor según sea necesario */
  overflow-y: auto; /* Habilita el scroll vertical */
}
</style>