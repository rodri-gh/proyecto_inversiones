<template>
  <div class="users-container">
    <div class="container col-md-10 mt-5">
      <h4 class="card-title text-center">Usuarios Registrados</h4>
      <div class="text-end">
        <Button
          data-bs-toggle="modal"
          data-bs-target="#modalUser"
          text="Nuevo"
          icon="fa fa-plus"
          class="btn-color"
        />
      </div>
      <CardsSummary :items="summaryUsers" />
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
            Todos
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
            Activos
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="inactive-tab"
            data-bs-toggle="tab"
            data-bs-target="#inactive"
            type="button"
            role="tab"
            aria-controls="inactive"
            aria-selected="false"
          >
            Inactivos
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="clients-tab"
            data-bs-toggle="tab"
            data-bs-target="#clients"
            type="button"
            role="tab"
            aria-controls="clients"
            aria-selected="false"
          >
            Clientes
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
          <TableUsers
            :headers="headersTable"
            :items="users"
            :actions="{
              edit: selectUser,
              delete: deleteUser,
            }"
          />
        </div>
        <div
          class="tab-pane fade"
          id="active"
          role="tabpanel"
          aria-labelledby="active-tab"
        >
          <TableUsers
            :headers="headers"
            :items="activeUsers"
            :actions="{
              edit: selectUser,
              delete: deleteUser,
            }"
          />
        </div>
        <div
          class="tab-pane fade"
          id="inactive"
          role="tabpanel"
          aria-labelledby="inactive-tab"
        >
          <TableUsers
            :headers="headers"
            :items="inactiveUsers"
            :actions="{
              edit: selectUser,
              delete: deleteUser,
            }"
          />
        </div>
        <div
          class="tab-pane fade"
          id="clients"
          role="tabpanel"
          aria-labelledby="clients-tab"
        >
          <TableUsers
            :headers="headers"
            :items="clientUsers"
            :actions="{
              edit: selectUser,
              delete: deleteUser,
            }"
          />
        </div>
      </div>

      <Modal
        modalId="modalUser"
        title="Registro de Usuario"
        :showSaveButton="!selectedUser?.id"
        :showUpdateButton="Boolean(selectedUser?.id)"
        @onClose="reset()"
        @onSave="createUser()"
      >
        <Input
          id="name"
          label="Nombre"
          v-model="name"
          type="text"
          placeholder="Ingrese el nombre"
        />
        <Input
          id="lastName"
          label="Apellidos"
          v-model="lastName"
          type="text"
          placeholder="Ingrese los apellidos"
        />
        <Input
          label="Nro de Documento"
          v-model="documentNumber"
          type="text"
          placeholder="Ingrese el número de documento"
        />
        <Input
          id="email"
          label="Correo"
          v-model="email"
          type="email"
          placeholder="Ingrese un correo electrónico"
        />
        <Input
          id="phone"
          label="Teléfono"
          v-model="phone"
          type="text"
          placeholder="Ingrese número de teléfono"
        />

        <div v-if="rol === 'super_user'" class="mb-3">
          <label for="" class="form-label">Rol</label>
          <select class="form-select form-select" v-model="role" id="role">
            <option value="">Selecione un rol</option>
            <option value="admin">Administrador</option>
            <option value="client">Cliente</option>
          </select>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "@/components/base/Button.vue";
import TableUsers from "@/components/tables/TableUsers.vue";
import Modal from "@/components/base/Modal.vue";
import Input from "@/components/base/Input.vue";
import { openModal, closeModal } from "@/utils/modal";
import { getUserRoleOfLocalStorage } from "@/authService";
import CardsSummary from "@/components/CardsSummary.vue";
import { existAlert, validateInputs } from "@/utils/validateInputs";

const headersTable = [
  "Nombre(s)",
  "Apellidos",
  "Nombre de usuario",
  "Correo",
  "Teléfono",
  "Estado",
  "Acciones",
];

const baseURL = `${import.meta.env.VITE_API_URL}/user/`;

const rol = getUserRoleOfLocalStorage();

const users = ref([]);
const activeUsers = ref([]);
const inactiveUsers = ref([]);
const clientUsers = ref([]);
const name = ref("");
const lastName = ref("");
const email = ref("");
const phone = ref("");
const role = ref("");
const documentNumber = ref("");

const selectedUser = ref({});
const summaryUsers = ref([]);

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
    users.value = data;
    activeUsers.value = data.filter((user) => user.deleted === 0);
    inactiveUsers.value = data.filter((user) => user.deleted === 1);
    clientUsers.value = data.filter((user) => user.role === "client");
    console.log(users.value);
    getsummaryUsers();
  } catch (error) {
    console.log(error);
  }
};
const selectUser = (user) => {
  selectedUser.value = user;
  name.value = user.name;
  lastName.value = user.lastName;
  documentNumber.value = user.documentNumber;
  email.value = user.email;
  phone.value = user.phone;
  role.value = user.role;
  openModal("modalUser");
};

const getsummaryUsers = () => {
  if (users.value.length > 0) {
    let userTotals = users.value.length;
    let userActives = 0;
    let userAdmins = 0;
    let userClients = 0;
    for (var item of users.value) {
      if (item.deleted === 1) {
        userActives++;
      }
      if (item.role === "admin") {
        userAdmins++;
      }
      if (item.role === "client") {
        userClients++;
      }
    }
    summaryUsers.value = [
      { key: "Usuarios Totales", value: userTotals },
      { key: "Usuarios activos", value: userActives },
      { key: "Administradores", value: userAdmins },
      { key: "Clientes", value: userClients },
    ];
    console.log(summaryUsers.value);
  } else {
    console.log("el array de users para cards sumary esta vacio");
  }
};

const createUser = async () => {
  console.log("documentNumber", documentNumber.value);

  if (
    !validateInputs([
      {
        value: name.value,
        name: "Nombre",
        type: "text",
      },
      {
        value: lastName.value,
        name: "Apellidos",
        type: "text",
      },
      {
        value: documentNumber.value,
        name: "Nro de Documento",
        type: "text",
      },
      {
        value: email.value,
        name: "Correo",
        type: "email",
      },
      {
        value: phone.value,
        name: "Teléfono",
        type: "text",
      },
      {
        value: role.value,
        name: "Rol",
        type: "select",
      },
    ])
  ) {
    return;
  }

  const method = selectedUser.value.id ? "put" : "post";
  const url = selectedUser.value.id
    ? `${baseURL}${selectedUser.value.id}`
    : baseURL;
  const datos = {
    name: name.value,
    lastName: lastName.value,
    documentNumber: documentNumber.value,
    email: email.value,
    phone: phone.value,
    role: role.value,
  };
  try {
    await axios[method](url, datos, header);
    closeModal("modalUser");
    getUsers();
    reset();
    Swal.fire({
      icon: "success",
      title: selectedUser.value.id
        ? "Usuario actualizado!"
        : "Registro exitoso!",
      showConfirmButton: false,
      timer: 2500,
    });
  } catch (error) {
    if (error.response && error.response.status === 400) {
      existAlert(error.response.data.message);
    } else {
      console.log(error);
    }
    console.log(error);
  }
};

const deleteUser = async (id) => {
  try {
    const { data } = await axios.patch(baseURL + id, header);
    console.log(data);
    getUsers();
  } catch (error) {
    console.log(error);
  }
};

const reset = () => {
  name.value = "";
  lastName.value = "";
  email.value = "";

  phone.value = "";
  selectedUser.value = {};
  role.value = "";
};
</script>

<style scoped>
.users-container {
  max-height: 850px;
  overflow-y: auto;
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
.nav-tabs .nav-link.active {
  color: white;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.tab-content > .tab-pane {
  display: none;
}

.tab-content > .active {
  display: block;
}
</style>