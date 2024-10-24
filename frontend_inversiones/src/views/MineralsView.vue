  <template>
  <div class="container col-md-8 mt-5">
    <div class="card shadow border-0">
      <div class="card-body">
        <h4 class="card-title text-center">Minerales</h4>
        <Button
          data-bs-toggle="modal"
          data-bs-target="#modalMineral"
          text="Nuevo"
          icon="fa fa-plus"
        />
        <TableMinerals
          :headers="headers"
          :items="minerals"
          :actions="{
            edit: selectMineral,
            delete: deleteMineral,
          }"
        />
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
            <h5 class="modal-title" id="modalTitleId">Datos del Mineral</h5>
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
              <label for="price" class="form-label">Precio</label>
              <input
                type="number"
                class="form-control"
                v-model="price"
                id="price"
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
              <label for="image" class="form-label">Imagen</label>
              <input
                type="file"
                class="form-control"
                ref="image"
                id="image"
                @change="previewImage()"
                accept="image/*"
              />
            </div>
            <div v-if="previewUrl" class="mt-3">
              <img :src="previewUrl" alt="Vista_previa" class="img-fluid" />
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
              v-if="selectedMineral && selectedMineral.id == null"
              type="button"
              class="btn btn-primary"
              @click="createMineral()"
            >
              Guardar
            </button>
            <button
              v-else
              type="button"
              class="btn btn-primary"
              @click="updateMineral()"
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
import Button from "@/components/base/Button.vue";
import TableMinerals from "@/components/minerals/TableMinerals.vue";

const headers = [
  "Nombre",
  "Precio",
  "Descripción",
  "Imagen",
  "Estado",
  "Acciones",
];

const baseURL = "http://localhost:3000/minerals/";

const minerals = ref([]);

const name = ref("");
const price = ref("");
const description = ref("");
const image = ref(null);

const previewUrl = ref(null);

const selectedMineral = ref({});

onMounted(() => {
  getMinerals();
});

const getMinerals = async () => {
  try {
    const { data } = await axios.get(baseURL);
    minerals.value = data.data;
    console.log(minerals.value);
  } catch (error) {
    console.log(error);
  }
};

const previewImage = () => {
  const file = image.value.files[0];
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  } else {
    previewUrl.value = null;
  }
};

const createMineral = async () => {
  const file = image.value.files[0];

  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("price", price.value);
  formData.append("description", description.value);
  formData.append("image", file);

  try {
    const { data } = await axios.post(baseURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(data);
    var myModalEl = document.getElementById("modalMineral");
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();

    getMinerals();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const selectMineral = (mineral) => {
  selectedMineral.value = mineral;

  name.value = mineral.name;
  price.value = mineral.price;
  description.value = mineral.description;
  previewUrl.value = mineral.image;

  var myModalEl = document.getElementById("modalMineral");
  var modal = new bootstrap.Modal(myModalEl);
  modal.show();
};

const updateMineral = async () => {
  const file = image.value.files[0];

  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("price", price.value);
  formData.append("description", description.value);
  formData.append("image", file);

  try {
    const { data } = await axios.put(
      baseURL + selectedMineral.value.id,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(data);
    var myModalEl = document.getElementById("modalMineral");
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();

    getMinerals();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const deleteMineral = async (id) => {
  try {
    const { data } = await axios.patch(baseURL + id);
    console.log(data);
    getMinerals();
  } catch (error) {
    console.log(error);
  }
};

const reset = () => {
  name.value = "";
  price.value = "";
  description.value = "";
  image.value.value = null;
  previewUrl.value = null;
  selectedMineral.value = {};
};
</script>

<style  scoped>
</style>