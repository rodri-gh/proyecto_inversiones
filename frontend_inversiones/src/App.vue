<script setup>
import { RouterView, useRouter } from "vue-router";
import { computed } from "vue";
import WhatsAppButton from "./components/WhatsAppButton.vue";
import FooterInfo from "./components/FooterInfo.vue";
import NavBar from "./components/NavBar.vue";

const route = useRouter();

const isRootRoute = computed(() => route.currentRoute.value.path === "/");

const hiddenRoutes = ["/login"];

const ShowNav = () => {
  return !hiddenRoutes.includes(route.currentRoute.value.path);
};
</script>
<template>
  <div class="app-container">
    <NavBar v-if="ShowNav()" />
    <main :class="['main-content', { 'no-padding': isRootRoute }]">
      <RouterView />
    </main>
    <WhatsAppButton />
    <FooterInfo v-if="ShowNav()" />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 60px; /* Default padding */
}

.no-padding {
  padding-top: 0; /* Remove padding when on root route */
}
</style>