<template>
  <div class="post-container">
    <div class="row">
      <div class="col-12">
        <h5 class="modal-post-title">{{ post.title }}</h5>
        <p class="modal-post-summary">{{ post.summary }}</p>
        <div class="modal-post-content" v-html="post.content"></div>
        <img
          v-if="post.cover_image"
          :src="post.cover_image"
          alt="Portada"
          class="post-image"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const post = ref({});

const baseURL = "http://localhost:3000/post/";

const getPost = async () => {
  try {
    const { data } = await axios.get(`${baseURL}${route.params.id}`);
    post.value = data;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getPost();
});
</script>

<style scoped>
.modal-post {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
}

.post-container {
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
.post-image {
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
  .post-container {
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