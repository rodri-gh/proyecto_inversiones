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
              <tr v-if="users.length == 0">
                <td colspan="7" class="text-center">
                  No existen usuarios registrados
                </td>
              </tr>

              <tr v-for="user in users" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.last_name }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.cellphone }}</td>
                <!-- <td>
                  <span v-if="user.status == 1" class="badge bg-success">Activo</span>
                  <span v-else class="badge bg-danger">Inactivo</span>
                </td> -->
                <td>
                  <button class="btn btn-warning btn-sm m-1" @click="selectUser(user)">
                    <i class="fa fa-edit"></i>
                  </button>
                  <!-- <button
                    v-if="user.status == 1" class="btn btn-danger btn-sm m-1"
                    @click="statusUser(user.id)">
                    <i class="fa fa-trash"></i>
                  </button>
                  <button
                    v-if="user.status == 0"
                    class="btn btn-success btn-sm m-1"
                    @click="statusUser(user.id)">
                    <i class="fa fa-check"></i>
                  </button> -->
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
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body px-5">
            <div class="mb-3 col-md-12">
              <label for="name" class="form-label">Nombres <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="name" id="name" placeholder="Ingrese su nombre" />

              <label for="lastname" class="form-label mt-3">Apellidos <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="lastname" id="lastname"
                placeholder="Ingrese su(s) apellido(s)" />

              <label for="username" class="form-label mt-3">Nombre de Ususario <span
                  class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="username" id="username"
                placeholder="Ingrese un nombre de Usuario" />

              <label for="email" class="form-label mt-3">Correo <span class="text-danger">*</span></label>
              <input type="email" class="form-control" v-model="email" id="email" placeholder="Ingrese su correo" />

              <label for="cellphone" class="form-label mt-3">Teléfono <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="cellphone" id="cellphone"
                placeholder="Ingrese su teléfono" />

              <label for="password" class="form-label mt-3">Contraseña <span class="text-danger">*</span></label>
              <input type="password" class="form-control" v-model="password" id="password"
                placeholder="Ingrese una contraseña" />
              <label for="confirmPassword" class="form-label mt-3">Repita su contraseña <span
                  class="text-danger">*</span></label>
              <input v-model="confirmPassword" type="password" class="form-control"
                placeholder="Confirmar Contraseña" />
              <div class="d-flex align-items-center gap-2">
                <input type="checkbox" class="form-check-input mt-3" id="terminos" v-model="terminos">
                <label for="terminos" class="form-check-label mt-3"> He leído y acepto los
                  <a href="#">Términos y Condiciones </a> y la
                  <a href="#">Política de Privacidad</a>
                </label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="button" class="btn btn-primary">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- para la Modal -->
    <!-- <div class="row col-md-5 col-sm-12 mx-auto card shadow border-0 py-5 px-5">
      <div class="card-body">

        <div class="mb-3 col-md-12">
          <label for="password" class="form-label">Contraseña <span class="text-danger">*</span></label>
          <input type="password" class="form-control" name="password" id="password"
            placeholder="Ingresa tu contraseña" />
        </div>
        <div class="mb-3 col-md-12">
          <Switch :checked="shouldReceiveNewsletter" @toggle="toggle" label="Recuérdame" />
        </div>

        <div class="mb-3 col-md-12 mt-4 text-center fw-bold">
          <a class="nav-link forgot" href="#">¿Olvidaste tu contraseña?</a>
        </div>
        <div class="mb-3 col-md-12">
          <button class="btn btn-primary sesion py w-100 fw-bolder">
            Ingresar
          </button>
        </div>
        <div class="mb-3 col-md-12">
          <button class="btn btn-outline-secondary w-100 google">
            Ingresar con Google
          </button>
        </div>
        <div class="d-flex justify-content-center mb-3 col-md-12 mt-4 text-center">
          <span class="mx-2"> ¿No tienes cuenta?</span>

          <a class="nav-link register-link fw-bolder" href="#">
            Regístrate gratis
          </a>
        </div>
      </div>
    </div> -->

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
const cellphone = ref("");
const password = ref("");
const confirmPassword = ref("");


//const previewUrl = ref(null);

const selectedUser = ref({});

onMounted(() => {
  getUsers();
});

const getUsers = async () => {
  try {
    const { data } = await axios.get(baseURL);
    users.value = data.data;
    console.log(users.value);
  } catch (error) {
    console.log(error);
  }
};

const createUser = async () => {

  if (name.value === "" || last_name.value === "" || username.value === "" || email.value === "" || cellphone.value === "" || password.value === "" || confirmPassword.value === "") {
    Swal.fire({
      icon: 'error',
      title: 'Campos vacíos!',
      text: 'Todos los campos son obligatorios',
    })
    return;
  }
  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: 'error',
      title: 'Las contraseñas no coinciden',
      text: 'Por favor, ingresa las mismas contraseñas',
    });
    password.value = "";
    confirmPassword.value = "";
    return;
  }
  const datos = {
    name: name.value,
    last_name: last_name.value,
    username: username.value,
    email: email.value,
    cellphone: cellphone.value,
    password: password.value
  }
  try {
    const { data } = await axios.post(baseURL, datos);
    Swal.fire({
      title: 'Hola ' + data.user.username + '!!',
      text: 'Le damos la bienvenida!',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    });
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

const selectUser = (user) => {
  selectedUser.value = user;

  name.value = user.name;
  last_name.value = user.last_name;
  username.value = user.username;
  email.value = user.email;
  cellphone.value = user.cellphone;

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
    cellphone: cellphone.value
  }

  try {
    const { data } = await axios.put(baseURL + selectedUser.value.id, datos);
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
    const { data } = await axios.patch(baseURL + id);
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
  cellphone.value = "";
};
</script>

<style scoped></style>