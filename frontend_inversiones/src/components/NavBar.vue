<script setup>
import { computed, ref } from "vue";
import { closeSession } from "../authService";
import { RouterLink, useRouter } from "vue-router";

const route = useRouter();

const isRootRoute = computed(() => route.currentRoute.value.path === "/");

const isLoggedIn = ref(!!localStorage.getItem("token"));

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
  isLoggedIn.value = false;
};

const navLinks = computed(() => {
  var user = JSON.parse(localStorage.getItem("user"));
  var userRole = user?.role;
  let links = [
    { name: "Marketplace", path: "/marketplace" },
    { name: "Panel de control", path: "/dashboard" },
  ];

  return links;
});
</script>

<template>
  <div class="nav-wrapper">
    <nav class="navbar navbar-expand-lg floating-nav">
      <div class="navbar-container">
        <div class="navbar-left">
          <img
            src="https://i.pinimg.com/originals/b4/25/66/b4256667e1af5e793841db4165ad470a.png"
            width="100"
            height="50"
            alt="Logo"
            class="navbar-logo"
          />
          <a class="navbar-brand mx-1" href="#">Minerales</a>
        </div>
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
          <ul class="navbar-nav navbar-center">
            <li v-if="isRootRoute" class="nav-item">
              <a class="nav-link" @click="scrollToSection('home')">Inicio</a>
            </li>
            <template v-if="isLoggedIn">
              <li v-for="link in navLinks" :key="link.name" class="nav-item">
                <router-link class="nav-link" :to="link.path">
                  {{ link.name }}
                </router-link>
              </li>
            </template>
            <li v-if="isRootRoute" class="nav-item">
              <a class="nav-link" @click="scrollToSection('about')"
                >Acerca de</a
              >
            </li>

            <li v-if="isRootRoute" class="nav-item">
              <a class="nav-link" @click="scrollToSection('carousel')">Blogs</a>
            </li>
            <li v-if="isRootRoute" class="nav-item">
              <a class="nav-link" @click="scrollToSection('faq')">FAQ</a>
            </li>
            <li v-if="isRootRoute" class="nav-item">
              <a class="nav-link" @click="scrollToSection('contact')"
                >Contacto</a
              >
            </li>
            <li v-if="isRootRoute" class="nav-item">
              <a class="nav-link" @click="scrollToSection('blog')">Blog</a>
            </li>
          </ul>
          <div class="navbar-right">
            <button v-if="isLoggedIn" class="logout-button" @click="logOut()">
              Cerrar Sesion
            </button>
            <RouterLink v-else class="logout-button" to="/login"
              >Iniciar Sesion</RouterLink
            >
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
  background-color: var(--navbar-bg) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  border-radius: 80px;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  opacity: 0.9;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0.5rem;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.navbar-center {
  display: flex;
  justify-content: center;
  flex-grow: 1;
}

.navbar-right {
  display: flex;
  align-items: center;
}
.navbar-logo {
  border-radius: 70px;
}

.logout-button {
  background-color: var(--button-primary);
  color: white;
  border: none;
  border-radius: 70px;
  padding: 10px 20px;
  font-size: 16px;
  height: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
  line-height: 1.6;
}

.logout-button:hover {
  background-color: var(--button-primary-hover);
}

.nav-link {
  cursor: pointer;
}
.nav-item {
  transition: background-color 0.3s ease, border-radius 0.3s ease;
}

.nav-item:hover {
  background-color: var(--navbar-bg-hover);
  border-radius: 18px;
}
li {
  padding: 0 10px;
}

@media (max-width: 991px) {
  .navbar-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .navbar-center {
    justify-content: flex-start;
  }

  .navbar-right {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .navbar-left {
    display: none;
  }

  .floating-nav {
    max-width: 100%;
    border-radius: 25px;
  }
}
</style>