<template>
  <div class="container col-md-10 mt-5">
    <h4 class="card-title text-center">Posts</h4>

    <div class="text-end">
      <Button
        data-bs-toggle="modal"
        data-bs-target="#modalPost"
        text="Nuevo"
        icon="fa fa-plus"
      />
    </div>
    <TablePosts
      :headers="headers"
      :items="posts"
      :actions="{ view: viewPost, edit: selectPost, delete: deletePost }"
    />

    <Modal
      modalId="modalPost"
      title="Datos del Post"
      modalClass="modal-fullscreen"
      :showSaveButton="!selectedPost?.id"
      :showUpdateButton="Boolean(selectedPost?.id)"
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
          value-key="id"
          label-key="name"
          v-model="category_post_id"
          selectClass="col-6"
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
        ref="inputFileRef"
      />
      <div v-if="previewUrl" class="mt-3 text-center">
        <img :src="previewUrl" alt="Vista_previa" class="img-fluid" />
      </div>
    </Modal>

    <Modal
      modalId="modalViewPost"
      title="Vista del Post"
      modalClass="modal-fullscreen modal-post"
      :showSaveButton="false"
      :showUpdateButton="false"
    >
      <div class="modal-post-container">
        <div class="row">
          <div class="col-12">
            <h5 class="modal-post-title">{{ selectedPost.title }}</h5>
            <p class="modal-post-summary">{{ selectedPost.summary }}</p>
            <div class="modal-post-content" v-html="selectedPost.content"></div>
            <img
              v-if="selectedPost.cover_image"
              :src="selectedPost.cover_image"
              alt="Portada"
              class="modal-post-image"
            />
          </div>
        </div>
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
import Button from "@/components/base/Button.vue";
import { openModal, closeModal } from "@/utils/modal";
import TablePosts from "@/components/tables/TablePosts.vue";

const headers = ["Titulo", "Resumen", "Estado", "Acciones"];

const categoryURL = "http://localhost:3000/category-post/";

const categoryPosts = ref([]);

const baseURL = "http://localhost:3000/post/";

const posts = ref([]);

const title = ref("");
const summary = ref("");
const content = ref("");
const cover_image = ref(null);
let quillEditor;

const inputFileRef = ref(null);

const user = JSON.parse(localStorage.getItem("user"));

const user_id = user.user_id;
const category_post_id = ref("");

const previewUrl = ref(null);

const selectedPost = ref({});

onMounted(() => {
  getPosts();
  getCategoryPosts();

  quillEditor = new Quill("#editor", {
    theme: "snow",
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
const style = document.createElement('style');
  style.innerHTML = `
    .ql-editor h1 {
      font-size: 2em;
      color: #2c3e50;
      border-bottom: 2px solid #eee;
      padding-bottom: 0.5em;
      margin-bottom: 0.5em;
    }
    .ql-editor h2 {
      font-size: 1.5em;
      color: #34495e;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.3em;
      margin-bottom: 0.3em;
    }
  `;
  document.head.appendChild(style);

  if (content.value) {
    quillEditor.root.innerHTML = content.value;
  }

  

const getPosts = async () => {
  try {
    const { data } = await axios.get(baseURL);
    posts.value = data;
    console.log("Los posts:", posts.value);
  } catch (error) {
    console.log(error);
  }
};

const getCategoryPosts = async () => {
  try {
    const { data } = await axios.get(categoryURL);
    categoryPosts.value = data;
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

  const method = selectedPost.value.id ? "put" : "post";
  const url = selectedPost.value.id
    ? `${baseURL}${selectedPost.value.id}`
    : baseURL;

  const formData = createFormData();

  try {
    await axios[method](url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Post guardado");
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

const viewPost = (post) => {
  selectedPost.value = post;
  openModal("modalViewPost");
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
  cover_image.value = null;
  previewUrl.value = null;
  selectedPost.value = {};
  quillEditor.root.innerHTML = "";
  inputFileRef.value?.reset();
};
</script>

<style scoped>
@import "quill/dist/quill.snow.css";

#editor {
  height: 300px;
  margin-bottom: 20px;
}

.modal-post {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
}

.modal-post-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

/* Título del post */
.modal-post-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
  line-height: 1.2;
}

/* Resumen del post */
.modal-post-summary {
  font-size: 1.25rem;
  color: #555;
  margin-bottom: 2rem;
  font-weight: 400;
  line-height: 1.5;
}

/* Contenido principal */
.modal-post-content {
  font-size: 1.125rem;
  color: #444;
  margin: 2rem 0;
  letter-spacing: 0.01em;
}

/* Imagen de portada */
.modal-post-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 2rem 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* Estilos para el contenido HTML renderizado */
.modal-post-content h1,
.modal-post-content h2,
.modal-post-content h3,
.modal-post-content h4,
.modal-post-content h5,
.modal-post-content h6 {
  color: #1a1a1a;
  margin: 1.5rem 0 1rem;
  line-height: 1.3;
}

.modal-post-content p {
  margin-bottom: 1.2rem;
}

.modal-post-content img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 1.5rem 0;
}

.modal-post-content a {
  color: #0066cc;
  text-decoration: none;
}

.modal-post-content a:hover {
  text-decoration: underline;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .modal-post-container {
    padding: 1rem;
  }

  .modal-post-title {
    font-size: 2rem;
  }

  .modal-post-summary {
    font-size: 1.1rem;
  }

  .modal-post-content {
    font-size: 1rem;
  }
}

/* Personalización del scroll del modal */
.modal-fullscreen {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

.modal-fullscreen::-webkit-scrollbar {
  width: 8px;
}

.modal-fullscreen::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.modal-fullscreen::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.modal-fullscreen::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>