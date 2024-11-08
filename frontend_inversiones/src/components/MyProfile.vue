<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { getHeaderRequest, getUserIdOfLocalStorage } from "@/authService";
import Swal from "sweetalert2";
const userProfile = ref({});
const baseURL = "http://localhost:3000/user/";

const password = ref("");
const confirmPassword = ref("");
const newPhone = ref("");

onMounted(() => {
  getUserProfile();
});

const getUserProfile = async () => {
  try {
    var userId = getUserIdOfLocalStorage();
    var header = getHeaderRequest();
    const response = await axios.get(baseURL + userId, header);
    userProfile.value = response.data;
    newPhone.value = response.data.phone;
    console.log(response.data);
  } catch (e) {
    console.error(e);
  }
};

const updateProfile = async () => {
  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Las contraseñas no coinciden",
    });
    return;
  }
  try {
    var userId = getUserIdOfLocalStorage();
    var header = getHeaderRequest();
    const response = await axios.put(
      baseURL + "update/" + userId,
      {
        phone: newPhone.value,
        password: password.value,
      },
      header
    );
    console.log(response.data);

    getUserProfile();

    Swal.fire({
      icon: "success",
      title: "Actualizado",
      text: "Perfil actualizado correctamente",
    });
    password.value = "";
    confirmPassword.value = "";
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div class="container col-md-10 mt-5">
    <ul class="nav nav-tabs" id="userTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          id="all-tab"
          data-bs-toggle="tab"
          data-bs-target="#all"
          type="button"
          role="tab"
          aria-controls="all"
          aria-selected="true"
        >
          Datos personales
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="active-tab"
          data-bs-toggle="tab"
          data-bs-target="#active"
          type="button"
          role="tab"
          aria-controls="active"
          aria-selected="false"
        >
          Cuenta
        </button>
      </li>
    </ul>
    <div class="tab-content" id="userTabsContent">
      <div
        class="tab-pane fade show active"
        id="all"
        role="tabpanel"
        aria-labelledby="all-tab"
      >
        <div class="row pt-3">
          <div class="mb-3 col-md-6">
            <label for="name" class="form-label">Nombre</label>
            <input
              type="text"
              class="form-control"
              id="name"
              :value="userProfile.name"
              readonly
            />
          </div>
          <div class="mb-3 col-md-6">
            <label for="lastName" class="form-label">Apellidos</label>
            <input
              type="text"
              class="form-control"
              id="lastName"
              :value="userProfile.lastName"
              readonly
            />
          </div>
          <div class="mb-3 col-md-6">
            <label for="email" class="form-label">Correo</label>
            <input
              type="email"
              class="form-control"
              id="email"
              :value="userProfile.email"
              readonly
            />
          </div>
          <div class="mb-3 col-md-6">
            <label for="phone" class="form-label">Teléfono</label>
            <input
              type="phone"
              class="form-control"
              id="phone"
              :value="userProfile.phone"
              readonly
            />
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="active"
        role="tabpanel"
        aria-labelledby="active-tab"
      >
        <h2>Cambiar credenciales</h2>

        <div class="row pt-3">
          <div class="mb-3 col-md-6">
            <label for="password" class="form-label">Contraseña</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="password"
            />
          </div>
          <div class="mb-3 col-md-6">
            <label for="confirmPassword" class="form-label"
              >Confirmar contraseña</label
            >
            <input
              type="password"
              class="form-control"
              id="confirmPassword"
              v-model="confirmPassword"
            />
          </div>
          <div class="mb-3 col-md-6">
            <label for="newPhone" class="form-label">Teléfono</label>
            <input
              type="phone"
              class="form-control"
              id="newPhone"
              v-model="newPhone"
            />
          </div>
        </div>
        <div class="mb-3 text-end">
          <button class="btn btn-primary mx-auto" @click="updateProfile">
            Actualizar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  overflow: hidden;
  border: 2px solid #ccc;
}
.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.nav-tabs .nav-link {
  color: #495057;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-bottom-color: transparent;
}
.nav-link {
  border-radius: 0;
}
.nav-link.active {
  color: white;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}
.active {
  background-color: transparent;
}

.tab-content > .tab-pane {
  display: none;
}

.tab-content > .active {
  display: block;
}
</style>