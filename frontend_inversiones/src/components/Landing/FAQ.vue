<template>
  <div class="text-center">
    <h1>Preguntas Frecuentes</h1>
    <div class="accordion w-50 mx-auto" id="faqAccordion">
      <div v-for="(faq, index) in faqs" :key="index" class="accordion-item">
        <h2 class="accordion-header" :id="'heading' + index">
          <button
            v-if="faq.deleted == 0"
            class="accordion-button collapsed py-4"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="'#collapse' + index"
            :aria-expanded="false"
            :aria-controls="'collapse' + index"
            :class="{ collapsed: index !== 0 }"
          >
            {{ faq.ask }}
          </button>
        </h2>
        <div
          :id="'collapse' + index"
          class="accordion-collapse collapse"
          :aria-labelledby="'heading' + index"
          data-bs-parent="#faqAccordion"
        >
          <div class="accordion-body text-start">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

const baseURL = "https://apiminerales.pruebasdeploy.online/faq/";
const faqs = ref([]);

const ask = ref("");
const answer = ref("");

onMounted(() => {
  getFaqs();
});

const getFaqs = async () => {
  try {
    const { data } = await axios.get(baseURL);
    faqs.value = data;
    console.log("FAQs data:", faqs.value);
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
.accordion-button:not(.collapsed) {
  background-color: white;
  color: black;
  box-shadow: none;
}

.accordion-button {
  border: none;
  border-radius: 1rem !important;
}

.accordion-item {
  border: none;
  border-radius: 1rem !important;
  margin-bottom: 1rem;
}

.accordion-header {
  margin-bottom: 1rem;
}

.accordion-body {
  padding-left: 1.5rem;
}
</style>
