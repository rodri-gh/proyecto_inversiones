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
      modalClass="modal-fullscreen"
      :showSaveButton="false"
      :showUpdateButton="false"
    >
      <div class="row">
        <div class="col-12">
          <h5>{{ selectedPost.title }}</h5>
          <p>{{ selectedPost.summary }}</p>
          <div v-html="selectedPost.content"></div>
          <img
            v-if="selectedPost.cover_image"
            :src="selectedPost.cover_image"
            alt="Portada"
            class="img-fluid"
          />
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
</style>