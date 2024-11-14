<template>
  <div class="container py-5">
    <!-- Back Button -->
    <div class="mb-4">
      <router-link 
        to="/user-home" 
        class="btn btn-primary d-flex align-items-center gap-2"
        style="width: fit-content"
      >
        
        Volver al inicio
      </router-link>
    </div>

    <!-- Cover Image Card -->
    <div class="text-center mb-4">
      <div class="image-container mx-auto">
        <img
          v-if="post.cover_image"
          :src="post.cover_image"
          :alt="post.title"
          class="post-cover-image img-fluid rounded shadow-sm"
        />
      </div>
    </div>

    <!-- Post Header -->
    <div class="post-header text-center mb-5">
      <h1 class="display-4 fw-bold mb-3">{{ post.title }}</h1>
      <p class="lead text-muted">{{ post.summary }}</p>
    </div>

    <!-- Content Tabs -->
    <div class="content-tabs">
      <!-- Tab Navigation -->
      <div class="tab-scroll-container">
        <ul class="nav nav-tabs custom-tabs" id="postTabs" role="tablist">
          <li 
            v-for="(section, index) in contentSections" 
            :key="index" 
            class="nav-item"
            role="presentation"
          >
            <button
              class="nav-link"
              :class="{ active: index === 0 }"
              :id="'tab-' + index"
              data-bs-toggle="tab"
              :data-bs-target="'#content-' + index"
              type="button"
              role="tab"
              :aria-controls="'content-' + index"
              :aria-selected="index === 0"
            >
              {{ section.title }}
            </button>
          </li>
        </ul>
      </div>
      
      <!-- Tab Content -->
      <div class="tab-content p-4 bg-white shadow-sm rounded-bottom" id="postTabContent">
        <div
          v-for="(section, index) in contentSections"
          :key="index"
          class="tab-pane fade"
          :class="{ 'show active': index === 0 }"
          :id="'content-' + index"
          role="tabpanel"
          :aria-labelledby="'tab-' + index"
        >
          <div class="content-section" v-html="section.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const post = ref({});
const contentSections = ref([]);

const baseURL = "http://localhost:3000/post/";

const parseContent = (content) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const sections = [];
  let currentSection = null;
  let currentContent = [];

  // Convert NodeList to Array for easier manipulation
  const elements = Array.from(doc.body.children);

  elements.forEach((element) => {
    if (element.tagName === 'H1' || element.tagName === 'H2') {
      // If we have a previous section, save it
      if (currentSection) {
        sections.push({
          title: currentSection,
          content: currentContent.join('')
        });
      }
      // Start new section
      currentSection = element.textContent;
      currentContent = [];
    } else {
      // Add to current section's content
      currentContent.push(element.outerHTML);
    }
  });

  // Don't forget to add the last section
  if (currentSection) {
    sections.push({
      title: currentSection,
      content: currentContent.join('')
    });
  }

  return sections.slice(0, 6); // Limitar a 6 pestañas
};

const getPost = async () => {
  try {
    const { data } = await axios.get(`${baseURL}${route.params.id}`);
    post.value = data;
    if (post.value.content) {
      contentSections.value = parseContent(post.value.content);
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getPost();
});
</script>

<style scoped>
.image-container {
  max-width: 600px; /* Ajusta este valor según necesites */
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 8px;
}

.post-cover-image {
  width: 100%;
  height: auto;
  max-height: 300px; /* Altura máxima de la imagen */
  object-fit: contain; /* Mantiene la proporción sin recortar */
}

.content-tabs {
  max-width: 900px;
  margin: 0 auto;
}

/* Contenedor para el scroll horizontal de las pestañas */
.tab-scroll-container {
  overflow-x: auto;
  margin-bottom: -1px; /* Para alinear con el contenido */
  /*quitar el scroll vertical */
  overflow-y: hidden;
}

/* Estilos personalizados para las pestañas */
.custom-tabs {
  border-bottom: none;
  white-space: nowrap;
  min-width: 100%;
  display: flex;
  flex-wrap: nowrap;
}

.nav-tabs .nav-link {
  color: #495057;
  border: 2px solid transparent;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  padding: 0.75rem 1.25rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  margin-right: 4px;
  background-color: #f8f9fa;
  
}

.nav-tabs .nav-link:hover {
  border-color: #FFA500;
  color: #FFA500;
}

.nav-tabs .nav-link.active {
  color: #FFA500;
  background-color: #fff;
  border-color: #FFA500 #FFA500 #fff;
  border-top-width: 2px;
  border-right-width: 2px;
  border-left-width: 2px;
  font-weight: 600;
}

.tab-content {
  border: 2px solid #FFA500;
  border-top: none;
  border-radius: 0 0 0.5rem 0.5rem;
}

.content-section {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #2c3e50;
}

.content-section :deep(p) {
  margin-bottom: 1.5rem;
}

.content-section :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

.post-header {
  max-width: 800px;
  margin: 0 auto;
}

/* Personalización del scroll horizontal */
.tab-scroll-container::-webkit-scrollbar {
  height: 6px;
}

.tab-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.tab-scroll-container::-webkit-scrollbar-thumb {
  background: #FFA500;
  border-radius: 3px;
}

.tab-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #FF8C00;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .image-container {
    max-width: 100%;
  }

  .post-cover-image {
    max-height: 250px;
  }

  .nav-tabs .nav-link {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .post-header h1 {
    font-size: 2rem;
  }
}
</style>