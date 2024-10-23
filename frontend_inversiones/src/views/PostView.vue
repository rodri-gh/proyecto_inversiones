  <template>
  <div class="container col-md-8 mt-5">
    <div class="card shadow border-0">
      <div class="card-body">
        <h4 class="card-title text-center">Posts</h4>
        <div class="text-end">
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalPost"
          >
            <i class="fa fa-plus mx-1"></i> Nuevo
          </button>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Título</th>
                <th scope="col">Resumen</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="posts.length == 0">
                <td colspan="6" class="text-center">
                  No hay posts registrados
                </td>
              </tr>

              <tr v-for="post in posts" :key="post.id">
                <td>{{ post.title }}</td>
                <td>{{ post.summary }}</td>

                <td>
                  <span v-if="post.status == 1" class="badge bg-success"
                    >Activo</span
                  >
                  <span v-else class="badge bg-danger">Inactivo</span>
                </td>
                <td>
                  <button
                    class="btn btn-warning btn-sm m-1"
                    @click="selectPost(post)"
                  >
                    <i class="fa fa-edit"></i>
                  </button>
                  <button
                    v-if="post.status == 1"
                    class="btn btn-danger btn-sm m-1"
                    @click="deletePost(post.post_id)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                  <button
                    v-if="post.status == 0"
                    class="btn btn-success btn-sm m-1"
                    @click="deletePost(post.post_id)"
                  >
                    <i class="fa fa-check"></i>
                  </button>
                  <RouterLink class="btn btn-info btn-sm m-1">
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
      id="modalPost"
      tabindex="-1"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      role="dialog"
      aria-labelledby="modalTitleId"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-fullscreen"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitleId">Datos del post</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="reset()"
            ></button>
          </div>
          <div class="modal-body">
            <!--Seleccionar la categoria del post-->
            <div class="row">
              <div class="mb-3 col-6">
                <label for="title" class="form-label">Titulo</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="title"
                  id="title"
                />
              </div>
              <div class="mb-3 col-6">
                <label for="category_post_id" class="form-label"
                  >Categoria del post</label
                >
                <select
                  class="form-select"
                  v-model="category_post_id"
                  id="category_post_id"
                >
                  <option value="" selected>Selecciona una categoria</option>
                  <option
                    v-for="categoryPost in categoryPosts"
                    :key="categoryPost.category_post_id"
                    :value="categoryPost.category_post_id"
                  >
                    {{ categoryPost.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label for="summary" class="form-label">Resumen</label>
              <textarea
                class="form-control"
                v-model="summary"
                id="summary"
              ></textarea>
            </div>

            <div class="mb-3">
              <label for="content" class="form-label">Contenido</label>
              <div id="editor"></div>
            </div>

            <div class="mb-3">
              <label for="cover_image" class="form-label">Portada</label>
              <input
                type="file"
                class="form-control"
                ref="cover_image"
                id="cover_image"
                @change="previewCover_image()"
                accept="cover_image/*"
              />
            </div>
            <div v-if="previewUrl" class="mt-3 text-center">
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
              v-if="selectedPost && selectedPost.post_id == null"
              type="button"
              class="btn btn-primary"
              @click="createPost()"
            >
              Guardar
            </button>
            <button
              v-else
              type="button"
              class="btn btn-primary"
              @click="updatePost()"
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
import { ref, onMounted, nextTick } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { RouterLink } from "vue-router";
import axios from "axios";
const categoryURL = "http://localhost:3000/categoryPosts/";

const categoryPosts = ref([]);

const baseURL = "http://localhost:3000/posts/";

const posts = ref([]);

const title = ref("");
const summary = ref("");
const content = ref("");
const cover_image = ref(null);
let quillEditor;

//obtener de localstorage el user_id del objeto user
const user = JSON.parse(localStorage.getItem("user"));

const user_id = user.user_id;
const category_post_id = ref("");

const previewUrl = ref(null);

const selectedPost = ref({});

onMounted(() => {
  getPosts();
  getCategoryPosts();

  quillEditor = new Quill("#editor", {
    theme: "snow", // Estilo de tema
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        ["link", "blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
    },
  });

  if (content.value) {
    quillEditor.root.innerHTML = content.value;
  }
});

const getPosts = async () => {
  try {
    const { data } = await axios.get(baseURL);
    posts.value = data.data;
    console.log("Los posts:", posts.value);
  } catch (error) {
    console.log(error);
  }
};

const getCategoryPosts = async () => {
  try {
    const { data } = await axios.get(categoryURL);
    categoryPosts.value = data.data;
    console.log("Las categorias:", categoryPosts.value);
  } catch (error) {
    console.log(error);
  }
};

const previewCover_image = () => {
  const file = cover_image.value.files[0];
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  } else {
    previewUrl.value = null;
  }
};

const createPost = async () => {
  const file = cover_image.value.files[0];
  content.value = quillEditor.root.innerHTML;

  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("summary", summary.value);
  formData.append("content", content.value);
  formData.append("cover_image", file);
  formData.append("user_id", user_id);
  formData.append("category_post_id", category_post_id.value);

  try {
    const { data } = await axios.post(baseURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(data);
    var myModalEl = document.getElementById("modalPost");
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();

    getPosts();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const selectPost = (post) => {
  selectedPost.value = post;

  console.log(selectedPost.value);

  title.value = post.title;
  summary.value = post.summary;
  category_post_id.value = post.category_post_id;
  nextTick(() => {
    quillEditor.root.innerHTML = post.content;
  });

  previewUrl.value = post.cover_image;

  var myModalEl = document.getElementById("modalPost");
  var modal = new bootstrap.Modal(myModalEl);
  modal.show();
};

const updatePost = async () => {
  const file = cover_image.value.files[0];
  content.value = quillEditor.root.innerHTML;

  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("summary", summary.value);
  formData.append("content", content.value);
  formData.append("cover_image", file);
  formData.append("user_id", user_id);
  formData.append("category_post_id", category_post_id.value);

  try {
    const { data } = await axios.put(
      baseURL + selectedPost.value.post_id,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(data);
    var myModalEl = document.getElementById("modalPost");
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();

    getPosts();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const deletePost = async (id) => {
  try {
    const { data } = await axios.patch(baseURL + id);
    console.log(data);
    getPosts();
  } catch (error) {
    console.log(error);
  }
};

const reset = () => {
  title.value = "";
  summary.value = "";
  content.value = "";
  cover_image.value.value = null;
  previewUrl.value = null;
  selectedPost.value = {};
  quillEditor.root.innerHTML = "";
};
</script>

<style  scoped>
@import "quill/dist/quill.snow.css";

#editor {
  height: 300px;
  margin-bottom: 20px;
}
</style>