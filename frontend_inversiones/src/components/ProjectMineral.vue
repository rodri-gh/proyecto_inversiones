<template>
  <div class="container col-md-8 mt-5">
    <div class="card shadow border-0">
      <div class="card-body">
        <h4 class="card-title text-center">Minerales del Proyecto</h4>
        <div class="text-end">
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalMineral"
            @click="resetModal"
            :disabled="projectMinerals.length >= 2"
          >
            <i class="fa fa-plus mx-1"></i> Nuevo
          </button>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Id del Mineral</th>
                <th scope="col">Mineral</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="projectMinerals.length == 0">
                <td colspan="6" class="text-center">
                  No hay minerales asociados a este proyecto
                </td>
              </tr>

              <tr v-for="projectMineral in projectMinerals" :key="projectMineral.id">
                <td>{{ projectMineral.mineral_id }}</td>
                <td>{{ projectMineral.mineral_nombre }}</td>
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
              {{ isEditing ? 'Actualizar' : 'Guardar' }}
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
import Swal from 'sweetalert2';

const props = defineProps({
  idProjectMineral: {
    type: String,
    required: true,
  },
});

const baseURL = "http://localhost:3000/project_minerals/";

const projectMinerals = ref([]);
const minerals = ref([]);
const selectedMinerals = ref([]);
const selectedMineral = ref("");
const selectedProjectMineral = ref({});
const isEditing = ref(false); // Indica si se está editando o no

onMounted(() => {
  getprojectMinerals();
  getMinerals();
});

const getprojectMinerals = async () => {
  try {
    const { data } = await axios.get(baseURL + props.idProjectMineral);
    projectMinerals.value = data;
  } catch (error) {
    console.error(error);
  }
};

const getMinerals = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/minerals/');
    minerals.value = data.data;
  } catch (error) {
    console.error("Error al obtener minerales:", error);
  }
};

const availableMinerals = computed(() => { 
  // Filtrar minerales que ya están en el proyecto
  const existingMineralIds = projectMinerals.value.map(pm => pm.mineral_id);
  return minerals.value.filter(mineral => 
    !existingMineralIds.includes(mineral.id) && 
    !selectedMinerals.value.some(selected => selected.id === mineral.id)
  );
});

const addMineral = () => {
  if (selectedMineral.value && selectedMinerals.value.length < 2) {
    selectedMinerals.value.push(selectedMineral.value);
    selectedMineral.value = "";
  }
};

const removeMineral = (mineral) => {
  selectedMinerals.value = selectedMinerals.value.filter(m => m.id !== mineral.id);
};

const deleteProjectMineral = async (id) => {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas eliminar este mineral del proyecto?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await axios.patch(baseURL + id);
      await getprojectMinerals();
      
      Swal.fire(
        '¡Eliminado!',
        'El mineral ha sido eliminado del proyecto.',
        'success'
      );
    }
  } catch (error) {
    console.error("Error al eliminar:", error);
    Swal.fire(
      'Error',
      'No se pudo eliminar el mineral.',
      'error'
    );
  }
};

const saveProjectMinerals = async () => {
  try {
    if (isEditing.value) {
      // Si estamos editando, eliminamos el mineral actual
      await axios.patch(baseURL + selectedProjectMineral.value.id);
    }

    // Verificamos que no excedamos el límite de 2 minerales
    const currentMinerals = projectMinerals.value.length;
    const newMineralsCount = selectedMinerals.value.length;
    
    if (!isEditing.value && currentMinerals + newMineralsCount > 2) {
      Swal.fire(
        'Error',
        'No se pueden agregar más de 2 minerales por proyecto.',
        'error'
      );
      return;
    }

    // Guardamos los nuevos minerales
    for (const mineral of selectedMinerals.value) {
      const projectMineral = {
        project_id: props.idProjectMineral,
        mineral_id: mineral.id
      };

      await axios.post(baseURL, projectMineral);
    }

    await getprojectMinerals();
    closeModal();
    
    Swal.fire(
      '¡Éxito!',
      isEditing.value ? 'Mineral actualizado correctamente.' : 'Minerales agregados correctamente.',
      'success'
    );
  } catch (error) {
    console.error("Error al guardar minerales:", error);
    Swal.fire(
      'Error',
      'No se pudieron guardar los cambios.',
      'error'
    );
  }
};

const selectProjectMineral = (projectMineral) => {
  isEditing.value = true;
  selectedProjectMineral.value = projectMineral;
  const mineralToEdit = minerals.value.find(m => m.id === projectMineral.mineral_id);
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
};

const closeModal = () => {
  const modalEl = document.getElementById("modalMineral");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
  resetModal();
};
</script>

<style scoped>
</style>