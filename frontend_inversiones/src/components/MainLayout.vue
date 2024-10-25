<script setup>
import { getStatusAuthentication, closeSession } from "../auth";
import { ref, onMounted } from "vue";
import WhatsAppButton from "./WhatsAppButton.vue";
import { useRouter } from "vue-router"; 

const router = useRouter();

const isLoggedIn = ref(false);
onMounted(() => {
  isLoggedIn.value = getStatusAuthentication();
});
const logOut = () => {
    closeSession(router); 
    isLoggedIn.value = false;
};
</script>

<template>
  <div id="app" class="container-fluidn">
    <header v-if="isLoggedIn" >
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Inversion Mineria</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/home">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/minerals">Minerals</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/post">Post</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/projects">Projects</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/users">Users</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/withdrawalrequests">Solicitudes de Retiro</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/movements">Movimientos</router-link>
            </li>
          </ul>
        </div>
        <div id="buttom-out">
            <button class="logout-button" @click="logOut">Cerrar Sesion</button>
        </div>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
    <WhatsAppButton />
  </div>
</template>

<style scoped>
.logout-button {
    background-color: #59369e; /* Color lila */
    color: white; /* Color del texto */
    border: none; /* Sin borde */
    border-radius: 10px; /* Bordes redondeados */
    padding: 10px 20px; /* Espaciado interno */
    font-size: 16px; /* Tamaño de fuente */
    cursor: pointer; /* Cambia el cursor al pasar el ratón */
    transition: background-color 0.3s ease; /* Transición suave al cambiar el color */
}

.logout-button:hover {
    background-color: #8A2BE2; /* Color más oscuro al pasar el ratón */
}
</style>