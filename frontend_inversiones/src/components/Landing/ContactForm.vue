<template>
  <div class="text-center mx-auto col-md-5 py-4">
    <h1>¡Contáctanos Ya!</h1>
    <div class="row">
      <Input
        v-model="name"
        id="name"
        placeholder="Nombre"
        class="col-md-6 m-0"
      />
      <Input
        v-model="lastName"
        id="lastName"
        placeholder="Apellido"
        class="col-md-6 m-0"
      />

      <Input v-model="email" id="email" placeholder="Correo" class="col-md-6" />
      <Input
        v-model="phone"
        id="phone"
        placeholder="Teléfono"
        class="col-md-6 m-0"
      />
      <InputTextArea id="comment" v-model="comment" placeholder="Mensaje" />
      <div>
        <Button
          text="Enviar Mensaje"
          buttonClass="btn-primary py-3 px-4 fw-semibold mt-4 m-0"
          @click="saveContact()"
        />
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

const baseURL = "https://apiminerales.pruebasdeploy.online/contact/";
const name = ref("");
const lastName = ref("");
const email = ref("");
const phone = ref("");
const comment = ref("");

const saveContact = async () => {
  if (!validateContactInput()) return;
  const datos = {
    name: name.value,
    lastName: lastName.value,
    email: email.value,
    phone: phone.value,
    comment: comment.value,
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
    });
    // getContacts();
    reset();
  } catch (error) {
    console.log(error);
  }
};
const validateContactInput = () => {
  if (
    !name.value ||
    !lastName.value ||
    !email.value ||
    !phone.value ||
    !comment.value
  ) {
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
  lastName.value = "";
  email.value = "";
  phone.value = "";
  comment.value = "";
};
</script>

<style scoped>
Button {
  border-radius: 2rem !important;
}
</style>