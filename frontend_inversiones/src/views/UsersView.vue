<template>
  <div class="container col-md-8 mt-5">
    <div class="card shadow border-0">
      <div class="card-body">
        <h4 class="card-title text-center">Usuarios</h4>
        <div class="text-end">
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalUser">
            <i class="fa fa-plus mx-1"></i> Nuevo
          </button>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Nombre(s)</th>
                <th scope="col">Apellidos</th>
                <th scope="col">Nombre de Usuario</th>
                <th scope="col">Correo</th>
                <th scope="col">Teléfono</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="users.length === 0">
                <td colspan="7" class="text-center">
                  No existen usuarios registrados
                </td>
              </tr>

              <tr v-for="user in users" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.last_name }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone }}</td>
                <td>
                  <span v-if="user.deleted == 1" class="badge bg-success">Activo</span>
                  <span v-else class="badge bg-danger">Inactivo</span>
                </td>
                <td>
                  <button class="btn btn-warning btn-sm m-1" @click="selectUser(user)">
                    <i class="fa fa-edit"></i>
                  </button>
                  <button v-if="user.deleted == 1" @click="deleteUser(user.id)" class="btn btn-danger btn-sm m-1">
                    <i class="fa fa-trash"></i>
                  </button>
                  <button v-if="user.deleted == 0" @click="deleteUser(user.id)" class="btn btn-primary btn-sm m-1">
                    <i class="fa fa-check"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Modal -->

    <div class="modal fade" id="modalUser" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"
      role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitleId">Registro de Usuario</h5>
            <button type="button" @click="reset()" class="btn-close" data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body px-5">
            <div class="mb-3 col-md-12">
              <label for="name" class="form-label">Nombres <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="name" id="name" placeholder="Ingrese su nombre" />

              <label for="lastname" class="form-label mt-3">Apellidos <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="last_name" id="lastname"
                placeholder="Ingrese su(s) apellido(s)" />

              <label for="username" class="form-label mt-3">Nombre de Ususario <span
                  class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="username" id="username"
                placeholder="Ingrese un nombre de Usuario" />

              <label for="email" class="form-label mt-3">Correo <span class="text-danger">*</span></label>
              <input type="email" class="form-control" v-model="email" id="email" placeholder="Ingrese su correo" />

              <label for="phone" class="form-label mt-3">Teléfono <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="phone" id="phone" placeholder="Ingrese su teléfono" />

              <label for="password" class="form-label mt-3">Contraseña <span class="text-danger">*</span></label>
              <input type="password" class="form-control" v-model="password" id="password"
                placeholder="Ingrese una contraseña" />
              <label for="confirmPassword" class="form-label mt-3">Repita su contraseña <span
                  class="text-danger">*</span></label>
              <input v-model="confirmPassword" type="password" class="form-control"
                placeholder="Confirmar Contraseña" />
            </div>
            <div class="modal-footer">
              <button type="button" @click="reset()" class="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button v-if="selectedUser && selectedUser.id == null" type="button" @click="createUser()"
                class="btn btn-primary">
                Guardar
              </button>
              <button v-else @click="updateUser()" type="button" class="btn btn-primary">Actualizar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

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

const createUser = async () => {
  if (!validateUserInput()) return;

  const datos = {
    name: name.value,
    last_name: last_name.value,
    username: username.value,
    email: email.value,
    phone: phone.value,
    password: password.value,
  }

  try {
    const { data } = await axios.post(baseURL, datos, header);
    console.log(data);
    getUsers();
    reset();

    var myModalEl = document.getElementById('modalUser');
    var modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();
  } catch (error) {
    console.log(error);
  }
};

const validateUserInput = () => {

  if (name.value === "" || last_name.value === "" || username.value === "" || email.value === "" || phone.value === "" || password.value === "" || confirmPassword.value === "") {
    Swal.fire({
      icon: 'error',
      title: 'Campos vacíos!',
      text: 'Todos los campos son obligatorios',
    })
    return false;
  }
  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: 'error',
      title: 'Las contraseñas no coinciden',
      text: 'Por favor, ingresa las mismas contraseñas',
    });
    password.value = "";
    confirmPassword.value = "";
    return false;
  }

  return true;
};

const selectUser = (user) => {
  selectedUser.value = user;

  name.value = user.name;
  last_name.value = user.last_name;
  username.value = user.username;
  email.value = user.email;
  phone.value = user.phone;

  var myModalEl = document.getElementById("modalUser");
  var modal = new bootstrap.Modal(myModalEl);
  modal.show();
};

const updateUser = async () => {
  const datos = {
    name: name.value,
    last_name: last_name.value,
    username: username.value,
    email: email.value,
    phone: phone.value,
    password: password.value,
  }

  try {
    const { data } = await axios.put(baseURL + selectedUser.value.id, datos, header);
    console.log(data);
    var myModalEl = document.getElementById("modalUser");
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();

    getUsers();
    reset();
  } catch (error) {
    console.log(error);
  }
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
};
</script>

<style scoped></style>