  <template>
    <div>
      <div>
        <div class="text-end">
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalTimeline"
            :disabled="availablePhases.length === 0">
            <i class="fa fa-plus mx-1"></i> Nuevo
          </button>
        </div>

        <div class="timeline-container position-relative mt-2">
          <div class="timeline-line"></div>
          <div v-for="(timeline, index) in timeLines" :key="timeline.id" class="timeline-item" :class="{
            'timeline-left': index % 2 === 0,
            'timeline-right': index % 2 !== 0,
          }">
            <div class="timeline-point" :class="getStatusClass(timeline.status)">
              <i :class="getStatusIcon(timeline.status)"></i>
            </div>
            <div class="timeline-content">
              <div class="card shadow-sm">
                <div class="card-body">
                  <span v-if="timeline.phase == 'contrato'" class="phase-badge" :class="getPhaseClass(timeline.phase)">
                    Contrato
                  </span>
                  <span v-if="timeline.phase == 'inversion'" class="phase-badge" :class="getPhaseClass(timeline.phase)">
                    Inversión
                  </span>

                  <span v-if="timeline.phase == 'compra_de_mineral'" class="phase-badge"
                    :class="getPhaseClass(timeline.phase)">
                    Fecha compra de mineral
                  </span>

                  <span v-if="timeline.phase == 'envio'" class="phase-badge" :class="getPhaseClass(timeline.phase)">
                    Fecha de envío
                  </span>

                  <span v-if="timeline.phase == 'entrega'" class="phase-badge" :class="getPhaseClass(timeline.phase)">
                    Fecha de entrega
                  </span>

                  <span v-if="timeline.phase == 'ganancia'" class="phase-badge" :class="getPhaseClass(timeline.phase)">
                    Fecha de Ganancia
                  </span>

                  <span v-if="timeline.phase == 'pago'" class="phase-badge" :class="getPhaseClass(timeline.phase)">
                    Fecha de Pago
                  </span>

                  <div class="dates mt-2">
                    <small class="text-muted">
                      <strong>
                        {{ formatDate(timeline.startDate) }} -
                        {{ formatDate(timeline.endDate) }}
                      </strong>
                    </small>
                  </div>

                  <p class="mt-2">{{ timeline.description }}</p>

                  <div v-if="
                    timeline.priceMineral2 > 0 && timeline.priceMineral1 > 0
                  " class="prices mt-2">
                    <small class="d-block">
                      <strong>Mineral 1:</strong> ${{ timeline.priceMineral1 }}
                    </small>
                    <small class="d-block">
                      <strong>Mineral 2:</strong> ${{ timeline.priceMineral2 }}
                    </small>
                  </div>
                  <div v-else>
                    <p>No hay variaciones en los precios!</p>
                  </div>

                  <div class="mt-2">
                    <button class="btn btn-warning btn-sm" @click="selectTimeLine(timeline)">
                      <i class="fa fa-edit"></i> Editar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modalTimeline" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"
        role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalTitleId">Línea de tiempo</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                @click="reset()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="phase" class="form-label">Fases</label>
                <select class="form-select form-select" v-model="phase" id="phase">
                  <option value="">Selecciona una fase</option>
                  <option v-for="phase in availablePhases" :key="phase" :value="phase">
                    {{ phase }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label for="startDate" class="form-label">Fecha de inicio</label>
                <input type="date" class="form-control" v-model="startDate" id="startDate" />
              </div>

              <div class="mb-3">
                <label for="endDate" class="form-label">Fecha de finalización</label>
                <input type="date" :min="startDate" class="form-control" v-model="endDate" id="endDate" />
              </div>
              <div class="mb-3">
                <label for="status" class="form-label">Estado de actualización</label>
                <input type="text" class="form-control" v-model="status" id="status" />
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">Descripción</label>
                <textarea class="form-control" v-model="description" id="description"></textarea>
              </div>

              <div class="mb-3">
                <label for="mineral_1" class="form-label">Precio mineral 1</label>
                <input type="number" class="form-control" v-model="mineral_1" id="mineral_1" />
              </div>
              <div class="mb-3">
                <label for="mineral_2" class="form-label">Precio mineral 2</label>
                <input type="number" class="form-control" v-model="mineral_2" id="mineral_2" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="reset()">
                Cancelar
              </button>
              <button v-if="selectedTimeLine && selectedTimeLine.id == null" type="button" class="btn btn-primary"
                @click="createTimeLine()">
                Guardar
              </button>
              <button v-else type="button" class="btn btn-primary" @click="updateTimeLine()">
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import axios from "axios";
import { getHeaderRequest } from "@/authService";
import { eventBus } from "@/eventBus";
import { handleErrorSwal } from "@/errorMixin";

const props = defineProps({
  idProject: {
    type: String,
    required: true,
  },
});

const baseURL = `${import.meta.env.VITE_API_URL}/projectTimeline/`;

const timeLines = ref([]);

const phase = ref("");
const startDate = ref("");
const endDate = ref("");
const status = ref("");
const description = ref("");
const mineral_1 = ref(0);
const mineral_2 = ref(0);

const header = getHeaderRequest();

const selectedTimeLine = ref({});

const phases = [
  "contrato",
  "inversion",
  "compra_de_mineral",
  "envio",
  "entrega",
  "ganancia",
  "pago",
];

const availablePhases = computed(() => {
  // Siempre incluye la fase actual
  const usedPhases = timeLines.value.map((timeline) => timeline.phase);
  console.log(usedPhases);
  const uniqueUsedPhases = [...new Set(usedPhases)];
  console.log(uniqueUsedPhases);
  // Incluye la fase actual en las fases disponibles
  const remainingPhases = phases.filter(
    (phase) => !uniqueUsedPhases.includes(phase)
  );
  console.log(remainingPhases);
  // Asegúrate de que la fase actual esté siempre disponible
  if (
    selectedTimeLine.value.phase &&
    !remainingPhases.includes(selectedTimeLine.value.phase)
  ) {
    remainingPhases.push(selectedTimeLine.value.phase);
  }
  console.log(remainingPhases);
  return remainingPhases;
});

onMounted(() => {
  getTimeLines();
  eventBus.on("data-updated", getTimeLines);
});

onUnmounted(() => {
  eventBus.off("data-updated", getTimeLines);
});

const getStatusClass = (status) => {
  const statusLower = status.toLowerCase();
  if (
    statusLower.includes("completado") ||
    statusLower.includes("finalizado")
  ) {
    return "status-completed";
  }
  if (statusLower.includes("progreso") || statusLower.includes("activo")) {
    return "status-progress";
  }
  return "status-pending";
};

const getStatusIcon = (status) => {
  const statusLower = status.toLowerCase();
  if (
    statusLower.includes("completado") ||
    statusLower.includes("finalizado")
  ) {
    return "fa fa-check";
  }
  if (statusLower.includes("progreso") || statusLower.includes("activo")) {
    return "fa fa-clock";
  }
  return "fa fa-circle";
};

const getPhaseClass = (phase) => {
  const phaseLower = phase.toLowerCase();
  const phaseClasses = {
    contrato: "phase-contract",
    inversion: "phase-prebuying",
    compra_de_mineral: "phase-buying",
    envio: "phase-entry",
    entrega: "phase-exit",
    ganancia: "phase-certification",
    pago: "phase-contract",
  };
  return phaseClasses[phaseLower] || "phase-default";
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};

const formatInputDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTimeLines = async () => {
  try {
    console.log(baseURL + "project/" + props.idProject);
    const data = await axios.get(
      baseURL + "project/" + props.idProject,
      header
    );
    console.log(data.data);
    timeLines.value = data.data
      .filter((item) => phases.includes(item.phase))
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  } catch (error) {
    console.error(error);
  }
};

const createTimeLine = async () => {
  if (!validateDates()) {
    return;
  }
  var myModalEl = document.getElementById("modalTimeline");
  var modal = bootstrap.Modal.getInstance(myModalEl);
  const timeLine = {
    projectId: props.idProject,
    phase: phase.value,
    startDate: startDate.value,
    endDate: endDate.value,
    status: status.value,
    description: description.value,
    priceMineral1: mineral_1.value,
    priceMineral2: mineral_2.value,
  };
  try {
    console.log(baseURL);
    const data = await axios.post(baseURL, timeLine, header);
    console.log(data.data);
    modal.hide();
    getTimeLines();
    reset();
  } catch (e) {
    handleErrorSwal(e, 'Error al crear Timeline!');
    modal.hide();
    reset();
  }
};

const selectTimeLine = (timeLine) => {
  selectedTimeLine.value = timeLine;

  console.log(selectedTimeLine.value, timeLine.p);

  phase.value = timeLine.phase;
  startDate.value = formatInputDate(timeLine.startDate);
  endDate.value = formatInputDate(timeLine.endDate);
  status.value = timeLine.status;
  description.value = timeLine.description;
  mineral_1.value = timeLine.priceMineral1;
  mineral_2.value = timeLine.priceMineral2;

  var myModalEl = document.getElementById("modalTimeline");
  var modal = new bootstrap.Modal(myModalEl);
  modal.show();
};

const updateTimeLine = async () => {
  if (!validateDates()) {
    return;
  }
  const timeLine = {
    phase: phase.value,
    startDate: startDate.value,
    endDate: endDate.value,
    status: status.value,
    description: description.value,
    priceMineral1: mineral_1.value,
    priceMineral2: mineral_2.value,
    project_id: props.idProject,
  };

  try {
    const { data } = await axios.put(
      baseURL + selectedTimeLine.value.id,
      timeLine
    );
    console.log(data);
    var myModalEl = document.getElementById("modalTimeline");
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
    getTimeLines();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const reset = () => {
  phase.value = "";
  startDate.value = "";
  endDate.value = "";
  status.value = "";
  description.value = "";
  mineral_1.value = 0;
  mineral_2.value = 0;
  selectedTimeLine.value = {};
};

const validateDates = () => {
  if (new Date(startDate.value) > new Date(endDate.value)) {
    handleErrorSwal("", "La Fecha de inicio no puede ser menor a la fecha de fin!")
    return false;
  }
  return true;
};

</script>

<style scoped>
.timeline-container {
  max-height: 700px;
  overflow-y: auto;
  padding: 5px 0;
  width: 100%;
}

.timeline-line {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 100%;
  background-color: #a59d9a;
  top: 0;
}

.timeline-item {
  position: relative;
  margin-bottom: 1px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.timeline-point {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 4px solid #1e5363;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.timeline-content {
  width: 40%;
  position: relative;
}

.timeline-left .timeline-content {
  margin-right: 55%;
}

.timeline-right .timeline-content {
  margin-left: 55%;
}

.phase-badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.975rem;
  font-weight: 700;
  display: inline-block;
  text-align: center;
}

/* Estados */
.status-completed {
  border-color: #28a745;
  color: #28a745;
}

.status-progress {
  border-color: #007bff;
  color: #007bff;
}

.status-pending {
  border-color: #6c757d;
  color: #6c757d;
}

/* Fases */
.phase-contract {
  background-color: #6f42c1;
  color: white;
}

.phase-prebuying {
  background-color: #007bff;
  color: white;
}

.phase-buying {
  background-color: #28a745;
  color: white;
}

.phase-entry {
  background-color: #ffc107;
  color: black;
}

.phase-exit {
  background-color: #fd7e14;
  color: white;
}

.phase-certification {
  background-color: #dc3545;
  color: white;
}

.phase-default {
  background-color: #152635;
  color: white;
}

/* Animaciones */
.timeline-content .card {
  transition: transform 0.2s ease-in-out;
}

.timeline-content .card:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .timeline-content {
    width: 80%;
    margin: 0 0 0 60px !important;
  }

  .timeline-line {
    left: 30px;
  }

  .timeline-point {
    left: 30px;
  }
}
</style>