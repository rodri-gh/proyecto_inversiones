<template>
  <div class="text-center mx-auto col-md-5 my-5">
    <h1>¡Contáctanos Ya!</h1>
    <div class="row">
      <Input v-model="name" id="name" placeholder="Nombre" class="col-md-6" />
      <Input v-model="lastname" id="lastname" placeholder="Apellido" class="col-md-6" />

      <Input v-model="email" id="email" placeholder="Correo" class="col-md-6" />
      <Input v-model="phone" id="phone" placeholder="Teléfono" class="col-md-6" />
      <InputTextArea id="comments" v-model="comments" placeholder="Mensaje" />
      <div>
        <Button text="Enviar Mensaje" buttonClass="btn-primary py-3 px-4 fw-semibold" @click="saveContact()" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import Input from "../base/Input.vue";
import InputTextArea from "../base/InputTextArea.vue";
import Button from "../base/Button.vue";

const baseURL = "http://localhost:3000/contacts/";
const name = ref("");
const lastname = ref("");
const email = ref("");
const phone = ref("");
const comments = ref("");

const saveContact = async () => {
  if (!validateContactInput()) return;
  const datos = {
    name: name.value,
    lastname: lastname.value,
    email: email.value,
    phone: phone.value,
    comments: comments.value,
  };
  try {
    const { data } = await axios.post(baseURL, datos);
    console.log(data);
    Swal.fire({
      icon: "success",
      title: "Datos enviados con éxito!",
      text: "Se le enviará más información al correo proporcionado",
      showConfirmButton: false,
      timer: 2500,
    })
    getContacts();
    reset();
  } catch (error) {
    console.log(error);
  }
};
const validateContactInput = () => {
  if (!name.value || !lastname.value || !email.value || !phone.value || !comments.value) {
    Swal.fire({
      icon: "warning",
      title: "Campos vacíos!",
      text: "Todos los campos son obligatorios",
    });
    return false;
  }
  return true;
};
const reset = () => {
  name.value = "";
  lastname.value = "";
  email.value = "";
  phone.value = "";
  comments.value = "";
};
</script>

<style scoped>
Button {
  border-radius: 2rem !important;
}
</style>