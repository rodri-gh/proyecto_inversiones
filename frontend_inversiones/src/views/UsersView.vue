<template>
  <div class="container col-md-8 mt-5">
    <div class="card shadow border-0">
      <div class="card-body">
        <h4 class="card-title text-center">Usuarios Registrados</h4>
        <div class="text-end">
          <Button data-bs-toggle="modal" data-bs-target="#modalUser" text="Nuevo" icon="fa fa-plus" />
        </div>
        <TableMinerals :headers="headers" :items="users" :actions="{
          edit: selectUser,
          delete: deleteUser,
        }" />
      </div>
    </div>
    <Modal modalId="modalUser" title="Registro de Usuario" :showSaveButton="!selectedUser?.id"
      :showUpdateButton="Boolean(selectedUser?.id)" @onClose="reset()" @onSave="createUser()">
      <Input id="name" label="Nombre" v-model="name" type="text" placeholder="Ingrese el nombre" />
      <Input id="last_name" label="Apellidos" v-model="last_name" type="text" placeholder="Ingrese los apellidos" />
      <Input id="username" label="Nombre de Usuario" v-model="username" type="text"
        placeholder="Ingrese un nombre de Usuario" />
      <Input id="email" label="Correo" v-model="email" type="email" placeholder="Ingrese un correo electrónico" />
      <Input id="phone" label="phone" v-model="phone" type="text" placeholder="Ingrese número de teléfono" />
      <Input id="password" label="Escriba una contraseña" v-model="password" type="password" placeholder="**********" />
      <Input id="confirmPassword" label="Repita la contraseña" v-model="confirmPassword" type="password"
        placeholder="Confirmar contraseña" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "@/components/base/Button.vue";
import TableMinerals from "@/components/tables/TableUsers.vue";
import Modal from "@/components/base/Modal.vue";
import Input from "@/components/base/Input.vue";
import { openModal, closeModal } from "@/utils/modal";

const headers = [
  "Nombre(s)",
  "Apellidos",
  "Nombre de usuario",
  "Correo",
  "Teléfono",
  "Estado",
  "Acciones",
];
const baseURL = "http://localhost:3000/user/";

const users = ref([]);
const name = ref("");
const last_name = ref("");
const username = ref("");
const email = ref("");
const phone = ref("");
const password = ref("");
const confirmPassword = ref("");
const selectedUser = ref({});

const token = localStorage.getItem("token") || "";

const header = {
  headers: {
    authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};
onMounted(async () => {
  getUsers();
});
const getUsers = async () => {
  try {
    const { data } = await axios.get(baseURL, header);
    users.value = data.data;
    console.log(users.value);
  } catch (error) {
    console.log(error);
  }
};
const selectUser = (user) => {
  selectedUser.value = user;
  name.value = user.name;
  last_name.value = user.last_name;
  username.value = user.username;
  email.value = user.email;
  phone.value = user.phone;

  openModal("modalUser");
};

const createUser = async () => {
  if (!validateUserInput()) return;

  const method = selectedUser.value.id ? "put" : "post";
  const url = selectedUser.value.id ? `${baseURL}${selectedUser.value.id}` : baseURL;
  const datos = {
    name: name.value,
    last_name: last_name.value,
    username: username.value,
    email: email.value,
    phone: phone.value,
    password: password.value
  };
  try {
    await axios[method](url, datos, header);
    closeModal("modalUser");
    getUsers();
    reset();
    Swal.fire({
      icon: "success",
      title: selectedUser.value.id ? "Usuario actualizado!" : "Registro exitoso!",
      showConfirmButton: false,
      timer: 2500,
    });
  } catch (error) {
    console.log(error);
  }
};
const validateUserInput = () => {
  if (
    name.value === "" ||
    last_name.value === "" ||
    username.value === "" ||
    email.value === "" ||
    phone.value === "" ||
    password.value === "" ||
    confirmPassword.value === ""
  ) {
    Swal.fire({
      icon: "error",
      title: "Campos vacíos!",
      text: "Todos los campos son obligatorios",
    });
    return false;
  }
  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: "error",
      title: "Las contraseñas no coinciden",
      text: "Por favor, ingresa las mismas contraseñas",
    });
    password.value = "";
    confirmPassword.value = "";
    return false;
  }
  return true;
};
const deleteUser = async (id) => {
  try {
    const { data } = await axios.delete(baseURL + id, header);
    console.log(data);
    getUsers();
  } catch (error) {
    console.log(error);
  }
};

const reset = () => {
  name.value = "";
  last_name.value = "";
  username.value = "";
  email.value = "";
  phone.value = "";
  password.value = "";
  confirmPassword.value = "";
  selectedUser.value = {};
};
</script>

<style scoped></style>