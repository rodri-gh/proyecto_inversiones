<script setup>
import { RouterLink } from "vue-router";
import Cover from "@/components/Landing/Cover.vue";
import About from "@/components/Landing/About.vue";
import ContactForm from "@/components/Landing/ContactForm.vue";
</script>

<template>
  <main>
    <section id="home">
      <Cover />
    </section>
    <section id="about">
      <About />
    </section>
    <section id="contact">
      <ContactForm />
    </section>
    <h1>User Home</h1>
    <RouterLink class="btn btn-dark" to="/login">Iniciar Sesion</RouterLink>
  </main>
</template>
