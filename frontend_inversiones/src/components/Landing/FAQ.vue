<template>
  <div class="text-center">
    <h1>Preguntas Frecuentes</h1>
    <div class="accordion w-50 mx-auto" id="faqAccordion">
      <div v-for="(faq, index) in FAQs" :key="index" class="accordion-item">
        <h2 class="accordion-header" :id="'heading' + index">
          <button
            class="accordion-button collapsed py-4"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="'#collapse' + index"
            :aria-expanded="false"
            :aria-controls="'collapse' + index"
            :class="{ collapsed: index !== 0 }"
          >
            {{ faq.question }}
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
const FAQs = [
  {
    question: "¿Qué son los minerales?",
    answer:
      "Los minerales son sustancias naturales, inorgánicas y de composición química definida.",
  },
  {
    question: "¿Cómo se clasifican los minerales?",
    answer:
      "Los minerales se clasifican según su composición química y estructura cristalina.",
  },
  {
    question: "¿Dónde se encuentran los minerales?",
    answer:
      "Los minerales se encuentran en todo tipo de formaciones geológicas, incluyendo rocas y suelos.",
  },
  {
    question: "¿Por qué son importantes los minerales?",
    answer:
      "Los minerales son fundamentales para la industria y la tecnología moderna.",
  },
  {
    question: "¿Cómo se extraen los minerales?",
    answer:
      "Los minerales se extraen mediante diversos métodos de minería, según su ubicación y características.",
  },
];
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
