  <template>
  <div class="container col-md-4 mt-5">
    <div class="card shadow border-0">
      <div class="card-body">
        <h4 class="card-title text-center">Categoria Posts</h4>
        <div class="text-end">
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalCategoryPost"
          >
            <i class="fa fa-plus mx-1"></i> Nuevo
          </button>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="categoryPosts.length == 0">
                <td colspan="6" class="text-center">
                  No hay categorias registradas
                </td>
              </tr>

              <tr v-for="categoryPost in categoryPosts" :key="categoryPost.id">
                <td>{{ categoryPost.name }}</td>

                <!--   <td>
                  <span
                    v-if="categoryPost.deleted == 1"
                    class="badge bg-success"
                    >Activo</span
                  >
                  <span v-else class="badge bg-danger">Inactivo</span>
                </td> -->
                <td>
                  <button
                    class="btn btn-warning btn-sm m-1"
                    @click="selectCategoryPost(categoryPost)"
                  >
                    <i class="fa fa-edit"></i>
                  </button>
                  <button
                    v-if="categoryPost.deleted == 1"
                    class="btn btn-danger btn-sm m-1"
                    @click="deleteCategoryPost(categoryPost.id)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                  <button
                    v-if="categoryPost.deleted == 0"
                    class="btn btn-success btn-sm m-1"
                    @click="deleteCategoryPost(categoryPost.id)"
                  >
                    <i class="fa fa-check"></i>
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
      id="modalCategoryPost"
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
            <h5 class="modal-title" id="modalTitleId">Categoria-Post</h5>
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
              v-if="selectedCategoryPost && selectedCategoryPost.id == null"
              type="button"
              class="btn btn-primary"
              @click="createCategoryPost()"
            >
              Guardar
            </button>
            <button
              v-else
              type="button"
              class="btn btn-primary"
              @click="updateCategoryPost()"
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

const baseURL = "http://localhost:3000/categoryPosts/";

const categoryPosts = ref([]);

const name = ref("");

const selectedCategoryPost = ref({});

onMounted(() => {
  getCategoryPosts();
});

const getCategoryPosts = async () => {
  try {
    const { data } = await axios.get(baseURL);
    categoryPosts.value = data.data;
    console.log(categoryPosts.value);
  } catch (error) {
    console.log(error);
  }
};

const createCategoryPost = async () => {
  const categoryPost = {
    name: name.value,
  };
  try {
    const { data } = await axios.post(baseURL, categoryPost);
    console.log(data);
    var myModalEl = document.getElementById("modalCategoryPost");
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();

    getCategoryPosts();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const selectCategoryPost = (categoryPost) => {
  selectedCategoryPost.value = categoryPost;

  name.value = categoryPost.name;

  var myModalEl = document.getElementById("modalCategoryPost");
  var modal = new bootstrap.Modal(myModalEl);
  modal.show();
};

const updateCategoryPost = async () => {
  const categoryPost = {
    name: name.value,
  };

  try {
    const { data } = await axios.put(
      baseURL + selectedCategoryPost.value.id,
      categoryPost
    );
    console.log(data);
    var myModalEl = document.getElementById("modalCategoryPost");
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();

    getCategoryPosts();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const deleteCategoryPost = async (id) => {
  try {
    const { data } = await axios.patch(baseURL + id);
    console.log(data);
    getCategoryPosts();
  } catch (error) {
    console.log(error);
  }
};

const reset = () => {
  name.value = "";

  selectedCategoryPost.value = {};
};
</script>

  <style  scoped>
</style>