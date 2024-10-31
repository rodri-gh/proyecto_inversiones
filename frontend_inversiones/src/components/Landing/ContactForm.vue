<template>
  <div class="text-center mx-auto col-md-5 my-5">
    <h1>¡Contáctanos Ya!</h1>
    <div class="row">
      <Input v-model="name" id="name" placeholder="Nombre" />

      <Input v-model="email" id="email" placeholder="Correo" class="col-md-6" />
      <Input
        v-model="phone"
        id="phone"
        placeholder="Teléfono"
        class="col-md-6"
      />
      <InputTextArea id="comments" v-model="comments" placeholder="Mensaje" />
      <div>
        <Button
          text="Enviar Mensaje"
          buttonClass="btn-primary py-3 px-4 fw-semibold"
          @click="$emit('aqui el nombre de tu metodo que envia el formulario')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Input from "../base/Input.vue";
import InputTextArea from "../base/InputTextArea.vue";
import Button from "../base/Button.vue";
const name = ref("");
const email = ref("");
const phone = ref("");
const comments = ref("");
</script>

<style scoped>
Button {
  border-radius: 2rem !important;
}
</style>