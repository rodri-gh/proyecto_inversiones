<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div>
    <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/about">Contacto</RouterLink>
      </nav>
    </div>
  </header>
  
  <RouterView />
  </div>


</template>

<style scoped>
</style>
