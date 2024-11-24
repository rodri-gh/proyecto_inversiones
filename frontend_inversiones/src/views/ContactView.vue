<template>
  <div class="container col-md-12 mt-2">
    <h4 class="card-title text-center">
      Lista de Usuarios que requieren información
    </h4>
    <br />
    <CardsSummary :items="summaryContacts" />
    <ul class="nav nav-tabs" id="userTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="all-tab" data-bs-toggle="tab" data-bs-target="#all" type="button" role="tab"
          aria-controls="all" aria-selected="true">
          Todos
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="active-tab" data-bs-toggle="tab" data-bs-target="#active" type="button" role="tab"
          aria-controls="active" aria-selected="false">
          Respondidos
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="inactive-tab" data-bs-toggle="tab" data-bs-target="#inactive" type="button"
          role="tab" aria-controls="inactive" aria-selected="false">
          Pendientes
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="clients-tab" data-bs-toggle="tab" data-bs-target="#clients" type="button"
          role="tab" aria-controls="clients" aria-selected="false">
          Eliminados
        </button>
      </li>
    </ul>
    <div class="tab-content" id="userTabsContent">
      <div class="tab-pane fade show active" id="all" role="tabpanel" aria-labelledby="all-tab">
        <TableContacts :headers="headers" :items="contacts" :actions="{
          answer: answerContact,
          delete: deleteContact,
        }" />
      </div>
      <div class="tab-pane fade" id="active" role="tabpanel" aria-labelledby="active-tab">
        <TableContacts :headers="headers" :items="activeUsers" :actions="{
          answer: answerContact,
          delete: deleteContact,
        }" />
      </div>
      <div class="tab-pane fade" id="inactive" role="tabpanel" aria-labelledby="inactive-tab">
        <TableContacts :headers="headers" :items="inactiveUsers" :actions="{
          answer: answerContact,
          delete: deleteContact,
        }" />
        <div class="tab-pane fade" id="clients" role="tabpanel" aria-labelledby="clients-tab">
          <TableContacts :headers="headers" :items="clientUsers" :actions="{
            answer: answerContact,
            delete: deleteContact,
          }" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import TableContacts from "@/components/tables/TableContacts.vue";
import Swal from "sweetalert2";
import CardsSummary from "@/components/CardsSummary.vue";

const token = localStorage.getItem("token") || "";
const user = JSON.parse(localStorage.getItem("user")) || "";

const headers = [
  "Nombre",
  "Apellido",
  "Correo",
  "Teléfono",
  "Comentarios",
  "Solicitado",
  "Respuesta",
  "Estado",
  "Acciones",
];

const baseURL = `${import.meta.env.VITE_API_URL}/contact/`;
const contacts = ref([]);
const summaryContacts = ref([]);
const activeUsers = ref([]);
const inactiveUsers = ref([]);
const clientUsers = ref([]);

onMounted(() => {
  getContacts();
  const token = localStorage.getItem("token") || "";
});

const getContacts = async () => {
  try {
    const { data } = await axios.get(baseURL);
    contacts.value = data;
    activeUsers.value = data.filter((user) => user.answer === "answered");
    inactiveUsers.value = data.filter((user) => user.answer === "pending");
    clientUsers.value = data.filter((user) => user.deleted === 1);
    getsummaryContacts();
    console.log("Contactos data:", contacts.value);
  } catch (error) {
    console.log(error);
  }
};

const getsummaryContacts = () => {
  if (contacts.value.length > 0) {
    let userTotals = contacts.value.length;
    let contactAnswered = 0;
    let contactNotAnswered = 0;
    let contactDeleted = 0;
    for (var item of contacts.value) {
      if (item.answer === "answered") {
        contactAnswered++;
      }
      if (item.answer === "pending") {
        contactNotAnswered++;
      }
      if (item.deleted === 1) {
        contactDeleted++;
      }
    }
    summaryContacts.value = [
      { key: "Totales", value: userTotals },
      { key: "Respondidos", value: contactAnswered },
      { key: "Por Responder", value: contactNotAnswered },
      { key: "Eliminados", value: contactDeleted },
    ];
    console.log(summaryContacts.value);
  } else {
    console.log("el array de contacts para cards sumary esta vacio");
  }
};

const deleteContact = async (contact_id) => {
  try {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Está seguro?",
      text: "Se eliminará el contacto. Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      const { data } = await axios.delete(baseURL + contact_id);
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El contacto ha sido eliminado.",
      });
      await getContacts();
    }
  } catch (error) {
    console.log(error);
  }
};
const answerContact = async (contact_id, contact_email) => {
  try {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Está seguro?",
      text: "¿Desea enviar la información en este momento?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      //actualizar la columna answer a answered
      window.location.href = `mailto:${contact_email}`;
      const { data } = await axios.put(baseURL + contact_id, {
        answer: "answered",
      });
      console.log("data", data);

      await getContacts();
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
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

.tab-content>.tab-pane {
  display: none;
}

.tab-content>.active {
  display: block;
}
</style>
