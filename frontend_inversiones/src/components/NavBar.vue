<script setup>
import { computed } from "vue";
import { closeSession } from "../authService";
import { RouterLink, useRouter } from "vue-router";

const route = useRouter();

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const offset = window.innerHeight * 0.2;
    window.scrollTo({
      top: sectionTop - offset,
      behavior: "smooth",
    });
  }
};

const logOut = () => {
  closeSession(route);
};

const navLinks = computed(() => {
  var user = JSON.parse(localStorage.getItem("user"));
  var userRole = user?.role;
  let links = [
    { name: "Home", path: "/home" },
    { name: "Minerales", path: "/minerals" },
    { name: "Post", path: "/posts" },
    { name: "Category posts", path: "/category-posts" },
    { name: "Projectos", path: "/projects" },
    { name: "Users", path: "/users" },
    { name: "Movimientos", path: "/movements" },
    ...(userRole === "super_user" || userRole === "admin"
      ? [{ name: "Solicitudes de Retiro", path: "/withdrawalrequests" }]
      : []),
  ];

  return links;
});
</script>

<template>
  <div class="nav-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-light floating-nav">
      <div class="navbar-container">
        <a class="navbar-brand" href="#">Inversion Mineria</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" @click="scrollToSection('home')">Inicio</a>
            </li>
            <li v-for="link in navLinks" :key="link.name" class="nav-item">
              <router-link class="nav-link" :to="link.path">
                {{ link.name }}
              </router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click="scrollToSection('about')"
                >Acerca de</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" @click="scrollToSection('contact')"
                >Contacto</a
              >
            </li>
          </ul>
          <div id="button-out">
            <button class="logout-button" @click="logOut()">
              Cerrar Sesion
            </button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.nav-wrapper {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  z-index: 1000;
  padding-top: 15px;
}

.floating-nav {
  background-color: #fff !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.logout-button {
  background-color: #59369e;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #8a2be2;
}

.nav-link {
  cursor: pointer;
}

.nav-link:hover {
  color: #59369e !important;
  transition: color 0.3s ease;
}

@media (max-width: 991px) {
  .navbar-container {
    flex-direction: column;
    align-items: flex-start;
  }

  #button-out {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .floating-nav {
    max-width: 100%;
    border-radius: 0;
  }
}
</style>