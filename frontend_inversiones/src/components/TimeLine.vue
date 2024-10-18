  <template>
  <div class="container col-md-8 mt-5">
    <div class="card shadow border-0">
      <div class="card-body">
        <h4 class="card-title text-center">Linea de Tiempo</h4>
        <div class="text-end">
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalTimeline"
          >
            <i class="fa fa-plus mx-1"></i> Nuevo
          </button>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Fase</th>
                <th scope="col">Fecha Inicio</th>
                <th scope="col">Fecha Fin</th>
                <th scope="col">Estado</th>
                <th scope="col">Descripcion</th>
                <th scope="col">Precios</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="timeLines.length == 0">
                <td colspan="6" class="text-center">
                  No hay lineas de tiempo registradas
                </td>
              </tr>

              <tr v-for="timeline in timeLines" :key="timeline.id">
                <td>{{ timeline.phase }}</td>
                <td>{{ timeline.start_date }}</td>
                <td>{{ timeline.end_date }}</td>
                <td>{{ timeline.status }}</td>
                <td>{{ timeline.description }}</td>
                <td>
                  <span> Mineral 1: {{ timeline.price_mineral_1 }}</span>
                  <span> Mineral 2: {{ timeline.price_mineral_2 }}</span>
                </td>

                <td>
                  <button
                    class="btn btn-warning btn-sm m-1"
                    @click="selectTimeLine(timeline)"
                  >
                    <i class="fa fa-edit"></i>
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
                <option selected>Selecciona una fase</option>
                <option value="contrato">Contrato</option>
                <option value="pre-compra">Pre-Compra</option>
                <option value="compra">Compra</option>
                <option value="entrada-al-ingenio">Entrada al ingenio</option>
                <option value="salida-del-ingenio">Salida del ingenio</option>
                <option value="certificacion">
                  Certificacion internacional
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
import { ref, onMounted } from "vue";
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

onMounted(() => {
  getTimeLines();
  console.log("imprimiendo el prop " + props.idProject);
});

const getTimeLines = async () => {
  try {
    const { data } = await axios.get(baseURL + props.idProject);
    timeLines.value = data.data;
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

  phase.value = timeLine.phase;
  start_date.value = timeLine.start_date;
  end_date.value = timeLine.end_date;
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

  <style  scoped>
</style>