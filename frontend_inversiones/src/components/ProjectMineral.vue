<template>
    <div>
      <div>
        <div class="text-end">
          <Button 
                    data-bs-toggle="modal"
                    data-bs-target="#modalMineral"
                    text="Nuevo"
                    icon="fa fa-plus"
                    @click="resetModal"
                    :disabled="projectMinerals.length >= 4"
                />
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Id del projecto</th>
                <th scope="col">Nombre del mineral</th>
                <th scope="col">Precio estimado de compra</th>
                <th scope="col">Precio pre compra</th>
                <th scope="col">Precio de compra</th>
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
                <td>{{ projectMineral.projectId }}</td>
                <td>{{ projectMineral.mineral.name }}</td>
                <td>{{ projectMineral.estimatedPurchasePrice }}</td>
                <td>{{ projectMineral.prePurchase }}</td>
                <td>{{ projectMineral.purchasePrice }}</td>
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
        class="modal-dialog modal-dialog-scrollable modal-dialog-centered"
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
              <div class="col-md-6">
                      <Select
                          :options="users"
                          label="Usuario Comprador"
                          value-key="id"
                          label-key="name"
                          v-model="userId"
                          select-class="col-8"
                      />
                      <div class="mt-2">
                          <h5>Datos del Usuario Seleccionado:</h5>
                          <p><strong>Nombre:</strong> {{ selectedUser?.name || "Seleccione un usuario" }}</p>
                          <p><strong>Email:</strong> {{ selectedUser?.email || "Seleccione un usuario" }}</p>
                          <p><strong>Teléfono:</strong> {{ selectedUser?.phone || "Seleccione un usuario" }}</p>
                      </div>
              </div>
              <div class="col-6">
                <div class="mb-3">
                  <label for="mineral" class="form-label">
                    Selecciona minerales (máximo 2)
                    <span class="text-muted">
                      ({{ selectedMinerals.length }}/2)
                    </span>
                  </label>
                  <select
                    class="form-select"
                    id="mineral"
                    :disabled="selectedMinerals.length >= 2"
                    v-model="selectedMineral"
                    @change="addMineral"
                  >
                    <option value="">Seleccione un mineral</option>
                    <option
                      v-for="mineral in availableMinerals"
                      :key="mineral.id"
                      :value="mineral"
                    >
                      {{ mineral.name }}
                    </option>
                  </select>
                </div>

                <div v-if="selectedMinerals.length > 0">
                  <h6>Minerales seleccionados:</h6>
                  <ul class="list-group">
                    <li
                      v-for="mineral in selectedMinerals"
                      :key="mineral.id"
                      class="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {{ mineral.name }}
                      <button
                        class="btn btn-danger btn-sm"
                        @click="removeMineral(mineral)"
                      >
                        <i class="fa fa-times"></i>
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <Input
                    id="estimatedPurchasePrice"
                    label="Precio estimado de compra"
                    type="number"
                    v-model="estimatedPurchasePrice"
                  />
                  <Input
                    id="prePurchase"
                    label="Precio pre compra"
                    type="number"
                    v-model="prePurchase"
                  />
                  <Input
                    id="purchasePrice"
                    label="Precio de compra"
                    type="number"
                    v-model="purchasePrice"
                  />
                  <Input
                    id="exitPrice"
                    label="Precio salida del ingenio"
                    type="number"
                    v-model="exitPrice"
                  />
                  <Input
                    id="salePrice"
                    label="Precio de Venta"
                    type="number"
                    v-model="salePrice"
                  />
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
 
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { getHeaderRequest } from "@/authService";
import Input from "./base/Input.vue";
import Button from "./base/Button.vue";
import { eventBus } from "@/eventBus";
import Select from "./base/Select.vue";

const props = defineProps({
idProjectMineral: {
  type: String,
  required: true,
},
});


const baseURL = "http://localhost:3000/project-minerals/";
const baseUrlUsers = 'http://localhost:3000/user/'

// Estados reactivos
const projectMinerals = ref([]);
const minerals = ref([]);
const users = ref([]); 

const estimatedPurchasePrice = ref(0); 
const prePurchase = ref(0); 
const purchasePrice = ref(0); 
const exitPrice = ref(0);
const salePrice = ref(0);
const userId = ref('');

const selectedMinerals = ref([]);
const selectedMineral = ref("");
const selectedProjectMineral = ref({});
const isEditing = ref(false);
const header = getHeaderRequest();


onMounted(() => {
  getprojectMinerals();
  getUsers();
  getMinerals();
  eventBus.on('data-updated', getprojectMinerals);

});

onMounted(() => {
  eventBus.off('data-updated', getprojectMinerals); 
});


const getprojectMinerals = async () => {
  try {
    const data = await axios.get(baseURL + props.idProjectMineral, header);
    //projectMinerals.value = data.data;
    projectMinerals.value = data.data.filter((user) => user.deleted === 0);
    console.log(data.data);
  } catch (error) {
    console.error(error);
  }
};

const getMinerals = async () => {

  try {
    const data = await axios.get("http://localhost:3000/mineral/", header);
    minerals.value = data.data;
    console.log(data.data);
  } catch (error) {
    console.error("Error al obtener minerales:", error);
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
}

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
  selectedMineral.value = "";
}
};
const removeMineral = (mineral) => {
selectedMinerals.value = selectedMinerals.value.filter(
  m => m.id !== mineral.id
);
};

// Métodos de acciones principales
const toggleProjectMineralStatus = async (projectMineral) => {
try {
  const newStatus = !projectMineral.isActive;
  const message = newStatus ? 'activar' : 'desactivar';
  
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Deseas ${message} este mineral del proyecto?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: `Sí, ${message}`,
    cancelButtonText: 'Cancelar'
  });
    if (result.isConfirmed) {
      await axios.patch(baseURL + id);
      await getprojectMinerals();
      Swal.fire(
        "¡Eliminado!",
        "El mineral ha sido eliminado del proyecto.",
        "success"
      );
    }
  } catch (error) {
    console.error("Error al eliminar:", error);
    Swal.fire("Error", "No se pudo eliminar el mineral.", "error");
  }
};

const saveProjectMinerals = async () => {

  console.log(baseURL+selectedProjectMineral.value.id); 
  try {
    if (isEditing.value) {
     console.log(selectedProjectMineral.value.id); 
      //Si estamos editando, eliminamos el mineral actual
      await axios.patch(baseURL + selectedProjectMineral.value.id);
    }
    // Verificamos que no excedamos el límite de 2 minerales
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
    // Guardamos los nuevos minerales
    for (const mineral of selectedMinerals.value) {
      const projectMineral = {
        projectId: props.idProjectMineral,
        mineralId: mineral.id,
        userId: userId.value,
        purchasePrice: purchasePrice.value,
        prePurchase: prePurchase.value,
        estimatedPurchasePrice: estimatedPurchasePrice.value,
        exitPrice: exitPrice.value,
        salePrice: salePrice.value
      };
      await axios.post(baseURL, projectMineral);
    }
    await getprojectMinerals()
    closeModal();

    Swal.fire(
      "¡Éxito!",
      isEditing.value
        ? "Mineral actualizado correctamente."
        : "Minerales agregados correctamente.",
      "success"
    );
  } catch (error) {
    handleError(error, 'Error al guardar minerales');
  }
};

const selectProjectMineral = (projectMineral) => {
  isEditing.value = true;
  selectedProjectMineral.value = projectMineral;
  estimatedPurchasePrice.value = projectMineral.estimatedPurchasePrice;
  prePurchase.value = projectMineral.prePurchase;
  purchasePrice.value = projectMineral.purchasePrice;
  exitPrice.value = projectMineral.exitPrice;
  salePrice.value = projectMineral.salePrice;

  const mineralToEdit = minerals.value.find(
    (m) => m.id === projectMineral.mineralId

  );
  if (mineralToEdit) {
    selectedMinerals.value = [mineralToEdit];
  }

const modalEl = document.getElementById('modalMineral');
const modal = new bootstrap.Modal(modalEl);
modal.show();
};

// Métodos de utilidad
const handleError = (error, defaultMessage) => {
console.error(error);
const errorMessage = error.response?.data?.message || defaultMessage;
Swal.fire('Error', errorMessage, 'error');
};

const resetModal = () => {
selectedMinerals.value = [];
selectedMineral.value = "";
isEditing.value = false;
selectedProjectMineral.value = {};
};

const closeModal = () => {
const modalEl = document.getElementById('modalMineral');
const modal = bootstrap.Modal.getInstance(modalEl);
modal.hide();
resetModal();
};

const selectedUser = computed(() => {
    return users.value.find(user => String(user.id) === String(userId.value));
});
</script>

<style scoped>
.table-secondary {
opacity: 0.7;
}
</style>