  <template>
  <div class="container col-md-8 mt-5">
    <div class="card shadow border-0">
      <div class="card-body">
        <h4 class="card-title text-center">Proyectos</h4>
        <div class="text-end">
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalProject"
          >
            <i class="fa fa-plus mx-1"></i> Nuevo
          </button>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Descripcion</th>

                <th scope="col">Estado del Proyecto</th>

                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="projects.length == 0">
                <td colspan="6" class="text-center">
                  No hay proyectos registrados
                </td>
              </tr>

              <tr v-for="project in projects" :key="project.id">
                <td>{{ project.name }}</td>
                <td>{{ project.description }}</td>

                <td v-if="project.status == 'open'">Abierto</td>
                <td v-else-if="project.status == 'in_transit'">En curso</td>
                <td v-else>Cerrado</td>

                <td>
                  <span v-if="project.deleted == 1" class="badge bg-success"
                    >Activo</span
                  >
                  <span v-else class="badge bg-danger">Inactivo</span>
                </td>

                <td>
                  <button
                    class="btn btn-warning btn-sm m-1"
                    @click="selectProject(project)"
                  >
                    <i class="fa fa-edit"></i>
                  </button>
                  <button
                    v-if="project.deleted == 1"
                    class="btn btn-danger btn-sm m-1"
                    @click="deleteProject(project.id)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                  <button
                    v-if="project.deleted == 0"
                    class="btn btn-success btn-sm m-1"
                    @click="deleteProject(project.id)"
                  >
                    <i class="fa fa-check"></i>
                  </button>

                  <RouterLink
                    :to="{
                      name: 'project-details',
                      params: { id: project.id },
                    }"
                    class="btn btn-info btn-sm m-1"
                  >
                    <i class="fa fa-eye"></i>
                  </RouterLink>
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
      id="modalProject"
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
            <h5 class="modal-title" id="modalTitleId">Datos del Proyecto</h5>
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
              <label for="name" class="form-label">Nombre</label>
              <input
                type="text"
                class="form-control"
                v-model="name"
                id="name"
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
              <label for="status" class="form-label">Estado del Proyecto</label>
              <select class="form-select" v-model="status" id="status">
                <option
                  v-for="(label, value) in statusOptions"
                  :key="value"
                  :value="value"
                >
                  {{ label }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="investment_goal" class="form-label"
                >Meta de recaudacion</label
              >
              <input
                type="number"
                class="form-control"
                v-model="investment_goal"
                id="investment_goal"
              />
            </div>

            <div class="mb-3">
              <label for="profit_percentage" class="form-label"
                >Porcentaje de ganancia</label
              >
              <input
                type="number"
                class="form-control"
                v-model="profit_percentage"
                id="profit_percentage"
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
              v-if="selectedProject && selectedProject.id == null"
              type="button"
              class="btn btn-primary"
              @click="createProject()"
            >
              Guardar
            </button>
            <button
              v-else
              type="button"
              class="btn btn-primary"
              @click="updateProject()"
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
import { RouterLink } from "vue-router";
import axios from "axios";

const baseURL = "http://localhost:3000/projects/";

const projects = ref([]);

const name = ref("");
const description = ref("");
const investment_goal = ref(0);
const profit_percentage = ref(0);

const selectedProject = ref({});

const statusOptions = {
  open: "Abierto",
  in_transit: "En curso",
  closed: "Cerrado",
};

const status = ref("open");

onMounted(() => {
  getProjects();
});

const getProjects = async () => {
  try {
    const { data } = await axios.get(baseURL);
    projects.value = data.data;
    console.log(projects.value);
  } catch (error) {
    console.log(error);
  }
};

const createProject = async () => {
  const project = {
    name: name.value,
    description: description.value,
    investment_goal: investment_goal.value,
    profit_percentage: profit_percentage.value,
  };

  try {
    const { data } = await axios.post(baseURL, project);
    console.log(data);
    var myModalEl = document.getElementById("modalProject");
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();

    getProjects();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const selectProject = (project) => {
  selectedProject.value = project;

  name.value = project.name;
  description.value = project.description;
  investment_goal.value = project.investment_goal;
  profit_percentage.value = project.profit_percentage;
  status.value = project.status;

  var myModalEl = document.getElementById("modalProject");
  var modal = new bootstrap.Modal(myModalEl);
  modal.show();
};

const updateProject = async () => {
  const project = {
    name: name.value,
    description: description.value,
    investment_goal: investment_goal.value,
    profit_percentage: profit_percentage.value,
    status: status.value,
  };

  try {
    const { data } = await axios.put(
      baseURL + selectedProject.value.id,
      project
    );
    console.log(data);
    var myModalEl = document.getElementById("modalProject");
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();

    getProjects();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const deleteProject = async (id) => {
  try {
    const { data } = await axios.patch(baseURL + id);
    console.log(data);
    getProjects();
  } catch (error) {
    console.log(error);
  }
};

const reset = () => {
  name.value = "";
  description.value = "";
  investment_goal.value = 0;
  profit_percentage.value = 0;
  selectedProject.value = {};
};
</script>

  <style  scoped>
</style>