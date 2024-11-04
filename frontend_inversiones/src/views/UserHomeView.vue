<script setup>
import { RouterLink } from "vue-router";
import Cover from "@/components/Landing/Cover.vue";
import About from "@/components/Landing/About.vue";
import ContactForm from "@/components/Landing/ContactForm.vue";
import Carousel from "@/components/Landing/Carousel.vue";
import FAQ from "@/components/Landing/FAQ.vue";
import Blog from "@/components/Landing/Blog.vue";
</script>

<template>
  <main>
    <section id="home">
      <Cover />
    </section>
    <section id="about">
      <About />
    </section>
    <section id="faq">
      <FAQ />
    </section>
    <section id="blog">
      <Blog />
    </section>

    <section id="contact">
      <ContactForm />
    </section>
  </main>
</template>
<style scoped>
main {
  background-color: #eaeaec;
}
</style>
