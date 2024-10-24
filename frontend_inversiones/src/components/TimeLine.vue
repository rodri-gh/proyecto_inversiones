  <template>
  <div class="container col-md-10 mt-5">
    <div class="card shadow border-0">
      <div class="card-body">
        <h4 class="card-title text-center">Línea de Tiempo</h4>
        <div class="text-end">
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalTimeline"
            :disabled="availablePhases.length === 0"
          >
            <i class="fa fa-plus mx-1"></i> Nuevo
          </button>
        </div>

        <div class="timeline-container position-relative mt-4">
          <div class="timeline-line"></div>
          <div
            v-for="(timeline, index) in timeLines"
            :key="timeline.id"
            class="timeline-item"
            :class="{
              'timeline-left': index % 2 === 0,
              'timeline-right': index % 2 !== 0,
            }"
          >
            <div
              class="timeline-point"
              :class="getStatusClass(timeline.status)"
            >
              <i :class="getStatusIcon(timeline.status)"></i>
            </div>
            <div class="timeline-content">
              <div class="card shadow-sm">
                <div class="card-body">
                  <!-- <span
                    class="phase-badge"
                    :class="getPhaseClass(timeline.phase)"
                  >
                    {{ timeline.phase }}
                  </span> -->

                  <span
                    v-if="timeline.phase == 'contrato'"
                    class="phase-badge"
                    :class="getPhaseClass(timeline.phase)"
                  >
                    Contrato
                  </span>
                  <span
                    v-if="timeline.phase == 'pre-compra'"
                    class="phase-badge"
                    :class="getPhaseClass(timeline.phase)"
                  >
                    Pre-compra
                  </span>

                  <span
                    v-if="timeline.phase == 'compra'"
                    class="phase-badge"
                    :class="getPhaseClass(timeline.phase)"
                  >
                    Compra
                  </span>

                  <span
                    v-if="timeline.phase == 'entrada-al-ingenio'"
                    class="phase-badge"
                    :class="getPhaseClass(timeline.phase)"
                  >
                    Entrada al ingenio
                  </span>

                  <span
                    v-if="timeline.phase == 'salida-del-ingenio'"
                    class="phase-badge"
                    :class="getPhaseClass(timeline.phase)"
                  >
                    Salida del ingenio
                  </span>

                  <span
                    v-if="timeline.phase == 'certificacion'"
                    class="phase-badge"
                    :class="getPhaseClass(timeline.phase)"
                  >
                    Certificación
                  </span>

                  <div class="dates mt-2">
                    <small class="text-muted">
                      {{ formatDate(timeline.start_date) }} -
                      {{ formatDate(timeline.end_date) }}
                    </small>
                  </div>

                  <p class="mt-2">{{ timeline.description }}</p>

                  <div class="prices mt-2">
                    <small class="d-block">
                      <strong>Mineral 1:</strong> ${{
                        timeline.price_mineral_1
                      }}
                    </small>
                    <small class="d-block">
                      <strong>Mineral 2:</strong> ${{
                        timeline.price_mineral_2
                      }}
                    </small>
                  </div>

                  <div class="mt-3">
                    <button
                      class="btn btn-warning btn-sm"
                      @click="selectTimeLine(timeline)"
                    >
                      <i class="fa fa-edit"></i> Editar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="modalTimeline"
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
            <h5 class="modal-title" id="modalTitleId">Linea de tiempo</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="reset()"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="phase" class="form-label">Fases</label>
              <select
                class="form-select form-select"
                v-model="phase"
                id="phase"
              >
                <option value="">Selecciona una fase</option>
                <option
                  v-for="phase in availablePhases"
                  :key="phase"
                  :value="phase"
                >
                  {{ phase }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="start_date" class="form-label">Fecha de inicio</label>
              <input
                type="date"
                class="form-control"
                v-model="start_date"
                id="start_date"
              />
            </div>

            <div class="mb-3">
              <label for="end_date" class="form-label"
                >Fecha de finalizacion</label
              >
              <input
                type="date"
                class="form-control"
                v-model="end_date"
                id="end_date"
              />
            </div>
            <div class="mb-3">
              <label for="status" class="form-label"
                >Estado de actualizacion</label
              >
              <input
                type="text"
                class="form-control"
                v-model="status"
                id="status"
              />
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">Descripcion</label>
              <textarea
                class="form-control"
                v-model="description"
                id="description"
              ></textarea>
            </div>

            <div class="mb-3">
              <label for="mineral_1" class="form-label">Precio mineral 1</label>
              <input
                type="number"
                class="form-control"
                v-model="mineral_1"
                id="mineral_1"
              />
            </div>
            <div class="mb-3">
              <label for="mineral_2" class="form-label">Precio mineral 2</label>
              <input
                type="number"
                class="form-control"
                v-model="mineral_2"
                id="mineral_2"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="reset()"
            >
              Cancelar
            </button>
            <button
              v-if="selectedTimeLine && selectedTimeLine.id == null"
              type="button"
              class="btn btn-primary"
              @click="createTimeLine()"
            >
              Guardar
            </button>
            <button
              v-else
              type="button"
              class="btn btn-primary"
              @click="updateTimeLine()"
            >
              Actualizar
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

const props = defineProps({
  idProject: {
    type: String,
    required: true,
  },
});

const baseURL = "http://localhost:3000/projectTimeLine/";

const timeLines = ref([]);

const phase = ref("");
const start_date = ref("");
const end_date = ref("");
const status = ref("");
const description = ref("");
const mineral_1 = ref(0);
const mineral_2 = ref(0);

const selectedTimeLine = ref({});

const phases = [
  "contrato",
  "pre-compra",
  "compra",
  "entrada-al-ingenio",
  "salida-del-ingenio",
  "certificacion",
];

const availablePhases = computed(() => {
  // Siempre incluye la fase actual
  const usedPhases = timeLines.value.map((timeline) => timeline.phase);
  const uniqueUsedPhases = [...new Set(usedPhases)];

  // Incluye la fase actual en las fases disponibles
  const remainingPhases = phases.filter(
    (phase) => !uniqueUsedPhases.includes(phase)
  );

  // Asegúrate de que la fase actual esté siempre disponible
  if (
    selectedTimeLine.value.phase &&
    !remainingPhases.includes(selectedTimeLine.value.phase)
  ) {
    remainingPhases.push(selectedTimeLine.value.phase);
  }

  return remainingPhases;
});

onMounted(() => {
  getTimeLines();
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
    "pre-compra": "phase-prebuying",
    compra: "phase-buying",
    "entrada-al-ingenio": "phase-entry",
    "salida-del-ingenio": "phase-exit",
    certificacion: "phase-certification",
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
    const { data } = await axios.get(baseURL + props.idProject);
    timeLines.value = data.data.sort(
      (a, b) => new Date(a.start_date) - new Date(b.start_date)
    );

    console.log(timeLines.value);
  } catch (error) {
    console.log(error);
  }
};

const createTimeLine = async () => {
  const timeLine = {
    phase: phase.value,
    start_date: start_date.value,
    end_date: end_date.value,
    status: status.value,
    description: description.value,
    price_mineral_1: mineral_1.value,
    price_mineral_2: mineral_2.value,
    project_id: props.idProject,
  };

  try {
    const { data } = await axios.post(baseURL, timeLine);
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

const selectTimeLine = (timeLine) => {
  selectedTimeLine.value = timeLine;

  console.log(selectedTimeLine.value, timeLine.p);

  phase.value = timeLine.phase;
  start_date.value = formatInputDate(timeLine.start_date);
  end_date.value = formatInputDate(timeLine.end_date);
  status.value = timeLine.status;
  description.value = timeLine.description;
  mineral_1.value = timeLine.price_mineral_1;
  mineral_2.value = timeLine.price_mineral_2;

  var myModalEl = document.getElementById("modalTimeline");
  var modal = new bootstrap.Modal(myModalEl);
  modal.show();
};

const updateTimeLine = async () => {
  const timeLine = {
    phase: phase.value,
    start_date: start_date.value,
    end_date: end_date.value,
    status: status.value,
    description: description.value,
    price_mineral_1: mineral_1.value,
    price_mineral_2: mineral_2.value,
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
  start_date.value = "";
  end_date.value = "";
  status.value = "";
  description.value = "";
  mineral_1.value = 0;
  mineral_2.value = 0;
  selectedTimeLine.value = {};
};
</script>

 <style scoped>
.timeline-container {
  padding: 20px 0;
  width: 100%;
}

.timeline-line {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 100%;
  background-color: #e9ecef;
  top: 0;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.timeline-point {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: white;
  border: 2px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.timeline-content {
  width: 45%;
  position: relative;
}

.timeline-left .timeline-content {
  margin-right: 55%;
}

.timeline-right .timeline-content {
  margin-left: 55%;
}

.phase-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;
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
  background-color: #6c757d;
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