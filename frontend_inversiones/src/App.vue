<script setup>
import { RouterView } from "vue-router";
import WhatsAppButton from "./components/WhatsAppButton.vue";
</script>

<template>
  <div>
    <header></header>
    <main>
      <RouterView />
    </main>
    <WhatsAppButton />
  </div>
</template>

<style scoped>
</style>
