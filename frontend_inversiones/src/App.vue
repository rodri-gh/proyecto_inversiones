<script setup>
import { RouterView, useRouter } from "vue-router";
import { computed } from 'vue';
import { closeSession } from "./authService";
import WhatsAppButton from "./components/WhatsAppButton.vue";
 
const route = useRouter();

const hiddenRoutes = ["/login", "/"];

const ShowNav = () => {
  return !hiddenRoutes.includes(route.currentRoute.value.path);
};

const logOut = () => {
  closeSession(route);
};

const navLinks = computed(() => { 
  var user = JSON.parse(localStorage.getItem('user')); 
  var userRole = user?.role;
  let links = [
    { name: 'Home', path: '/home' }, 
    { name: 'Minerales', path: '/minerals' }, 
    { name: 'Post', path: '/posts' }, 
    { name: 'Category posts', path: '/category-posts' }, 
    { name: 'Projectos', path: '/projects' }, 
    { name: 'Users', path: '/users' }, 
    { name: 'Movimientos', path: '/movements' }, 
  ];
  if(userRole == 'super_user') { 
    links.push({ name: 'Solicitudes de Retiro', path: '/withdrawalrequests' })
    console.log('soy super user'); 
  } else if( userRole == 'admin') { 
    links.push({ name: 'Solicitudes de Retiro', path: '/withdrawalrequests' })
    console.log('soy admin'); 
  } else {
    console.log('soy client'); 
  }
  return links;
})
</script>

<template>
  <div>
    <header>
      <nav
        v-if="ShowNav()"
        class="navbar navbar-expand-lg navbar-light bg-light"
      >
        <a class="navbar-brand" href="#">Inversion Mineria</a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li v-for="link in navLinks" :key="link.name" class="nav-item">
              <router-link class="nav-link" :to="link.path">{{ link.name }}</router-link>
            </li>
          </ul>
        </div>
        <div id="button-out">
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
  background-color: #8a2be2; /* Color más oscuro al pasar el ratón */
}
</style>