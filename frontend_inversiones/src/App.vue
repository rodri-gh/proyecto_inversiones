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
    <header>
      <NavBar v-if="ShowNav()" />
    </header>
    <main :class="['main-content', { 'no-padding': isRootRoute }]">
      <RouterView />
    </main>
    <footer>
      <WhatsAppButton />
      <FooterInfo v-if="ShowNav()" />
    </footer>
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
}

.no-padding {
  padding-top: 0;
}
</style>