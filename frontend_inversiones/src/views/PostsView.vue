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

    <Modal
      modalId="modalPost"
      title="Datos del Post"
      modalClass="modal-fullscreen"
      :showSaveButton="!selectedPost?.post_id"
      :showUpdateButton="Boolean(selectedPost?.post_id)"
      @onClose="reset()"
      @onSave="savePost()"
    >
      <div class="row">
        <Input
          class="col-6"
          id="title"
          label="Titulo"
          v-model="title"
          type="text"
        />

        <Select
          :options="categoryPosts"
          label="Categoría del post"
          value-key="category_post_id"
          label-key="name"
          v-model="category_post_id"
          select-class="col-6"
        />
      </div>

      <InputTextArea id="summary" label="Resumen" v-model="summary" />

      <div class="mb-3">
        <label for="content" class="form-label">Contenido</label>
        <div id="editor"></div>
      </div>

      <InputFile
        id="cover_image"
        label="Portada"
        @update:modelValue="handleImageChange"
        accept="image/*"
      />
      <div v-if="previewUrl" class="mt-3 text-center">
        <img :src="previewUrl" alt="Vista_previa" class="img-fluid" />
      </div>
    </Modal>
  </div>
</template>

  <script setup>
import { ref, onMounted, nextTick } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { RouterLink } from "vue-router";
import axios from "axios";
import Select from "@/components/base/Select.vue";
import Input from "@/components/base/Input.vue";
import InputTextArea from "@/components/base/InputTextArea.vue";
import Modal from "@/components/base/Modal.vue";
import InputFile from "@/components/base/InputFile.vue";
import { openModal, closeModal } from "@/utils/modal";

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

const handleImageChange = (file) => {
  cover_image.value = file;
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  } else {
    previewUrl.value = null;
  }
};

const savePost = async () => {
  content.value = quillEditor.root.innerHTML;

  const method = selectedPost.value.post_id ? "put" : "post";
  const url = selectedPost.value.post_id
    ? `${baseURL}${selectedPost.value.post_id}`
    : baseURL;

  const formData = createFormData();

  try {
    await axios[method](url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    closeModal("modalPost");
    getPosts();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const createFormData = () => {
  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("summary", summary.value);
  formData.append("content", content.value);
  if (cover_image.value) {
    formData.append("cover_image", cover_image.value);
  }
  formData.append("user_id", user_id);
  formData.append("category_post_id", category_post_id.value);
  return formData;
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
  openModal("modalPost");
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