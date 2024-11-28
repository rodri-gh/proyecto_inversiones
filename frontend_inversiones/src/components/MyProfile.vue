<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import {
  getHeaderRequest,
  getUserIdOfLocalStorage,
  closeSession,
} from "@/authService";
import { closeModal } from "@/utils/modal";
import Swal from "sweetalert2";

const userProfile = ref({});
const baseURL = `${import.meta.env.VITE_API_URL}/user/`;

const password = ref("");
const confirmPassword = ref("");
const newPhone = ref("");
const tempPhone = ref("");

const passwordError = ref("");
const confirmPasswordError = ref("");

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
    tempPhone.value = response.data.phone;
    console.log(response.data);
  } catch (e) {
    console.error(e);
  }
};

const validatePassword = () => {
  const passwordValue = password.value;
  const confirmPasswordValue = confirmPassword.value;
  passwordError.value = "";
  confirmPasswordError.value = "";

  if (passwordValue.length < 8) {
    passwordError.value = "La contraseña debe tener al menos 8 caracteres.";
  } else if (!/[A-Z]/.test(passwordValue)) {
    passwordError.value =
      "La contraseña debe tener al menos una letra mayúscula.";
  } else if (!/[0-9]/.test(passwordValue)) {
    passwordError.value = "La contraseña debe tener al menos un número.";
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)) {
    passwordError.value =
      "La contraseña debe tener al menos un carácter especial.";
  }

  if (passwordValue !== confirmPasswordValue) {
    confirmPasswordError.value = "Las contraseñas no coinciden.";
  }

  return !passwordError.value && !confirmPasswordError.value;
};

const updatePassword = async () => {
  if (!validatePassword()) {
    return;
  }

  try {
    var userId = getUserIdOfLocalStorage();
    var header = getHeaderRequest();
    const response = await axios.put(
      baseURL + "update/" + userId,
      {
        password: password.value,
      },
      header
    );
    console.log(response.data);
    //cerrar el modal

    getUserProfile();

    Swal.fire({
      icon: "success",
      title: "Actualizado",
      text: "Contraseña actualizada correctamente",
    });
    password.value = "";
    confirmPassword.value = "";
  } catch (e) {
    console.error(e);
  }
};

const updatePhone = async () => {
  try {
    var userId = getUserIdOfLocalStorage();
    var header = getHeaderRequest();
    const response = await axios.put(
      baseURL + "update/" + userId,
      {
        phone: tempPhone.value,
      },
      header
    );
    console.log(response.data);

    closeModal("phoneModal");
    getUserProfile();

    Swal.fire({
      icon: "success",
      title: "Actualizado",
      text: "Teléfono actualizado correctamente",
      showConfirmButton: false,
      timer: 1500,
    });
    newPhone.value = tempPhone.value;
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div>
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
              <label for="documentNumber" class="form-label"
                >Nro. de Documento</label
              >
              <input
                type="text"
                class="form-control"
                id="documentNumber"
                :value="userProfile.documentNumber"
                readonly
              />
            </div>
            <div class="mb-3 col-md-6">
              <label for="phone" class="form-label">Teléfono</label>
              <input
                type="phone"
                class="form-control"
                id="phone"
                :value="newPhone"
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
            <div class="mb-3 col-md-12">
              <button
                class="btn btn-primary mt-2"
                data-bs-toggle="modal"
                data-bs-target="#passwordModal"
              >
                Cambiar contraseña
              </button>
            </div>
            <div class="mb-3 col-md-6">
              <label for="newPhone" class="form-label">Teléfono</label>
              <input
                type="phone"
                class="form-control"
                id="newPhone"
                :value="newPhone"
                readonly
              />
            </div>
            <div class="mb-3 col-md-12">
              <button
                class="btn btn-primary mt-2"
                data-bs-toggle="modal"
                data-bs-target="#phoneModal"
              >
                Cambiar teléfono
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para cambiar contraseña -->
      <div
        class="modal fade"
        id="passwordModal"
        tabindex="-1"
        aria-labelledby="passwordModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="passwordModalLabel">
                Cambiar contraseña
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                />
                <div v-if="passwordError" class="text-danger">
                  {{ passwordError }}
                </div>
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label"
                  >Confirmar contraseña</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="confirmPassword"
                />
                <div v-if="confirmPasswordError" class="text-danger">
                  {{ confirmPasswordError }}
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="updatePassword"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para cambiar teléfono -->
      <div
        class="modal fade"
        id="phoneModal"
        tabindex="-1"
        aria-labelledby="phoneModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="phoneModalLabel">Cambiar teléfono</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="tempPhone" class="form-label">Teléfono</label>
                <input
                  type="phone"
                  class="form-control"
                  id="tempPhone"
                  v-model="tempPhone"
                />
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="updatePhone"
              >
                Guardar cambios
              </button>
            </div>
          </div>
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

.text-danger {
  color: red;
}
</style>