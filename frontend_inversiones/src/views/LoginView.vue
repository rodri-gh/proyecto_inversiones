<template>
  <div class="row col-4 mx-auto card mt-5 shadow border-0 py-5 px-5 my-auto">
    <div class="card-body">
      <div class="mb-3 col-md-12">
        <label for="email" class="form-label">E-mail</label>
        <input type="text" class="form-control" name="email" id="email" />
      </div>
      <div class="mb-3 col-md-12">
        <label for="password" class="form-label">Contraseña</label>
        <input
          type="password"
          class="form-control"
          name="password"
          id="password"
        />
      </div>

      <Switch
        :checked="shouldReceiveNewsletter"
        @toggle="toggle"
        label="Recuérdame"
      />

      <div class="mb-3 col-md-12 mt-4 text-center">
        <a class="nav-link" href="#">¿Olvidaste tu contraseña?</a>
      </div>
      <div class="mb-3 col-md-12">
        <button class="btn btn-primary w-100">Ingresar</button>
      </div>
      <div class="mb-3 col-md-12">
        <button class="btn btn-outline-secondary w-100">
          Ingresar con Google
        </button>
      </div>
      <div class="mb-3 col-md-12 mt-4 text-center">
        <a class="nav-link" href="#">¿No tienes cuenta? Regístrate gratis </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import Switch from "@/components/Switch.vue";
</script>

<style scoped>
</style>