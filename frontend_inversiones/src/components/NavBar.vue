<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";

import { closeSession, getUserRoleOfLocalStorage } from "../authService";
import { RouterLink, useRouter } from "vue-router";
import axios from "axios";

const baseURL = "https://apiminerales.pruebasdeploy.online/site-setting";

const settings = ref([]);

onMounted(() => {
  getSettings();
});

const getSettings = async () => {
  try {
    const response = await axios.get(baseURL);
    settings.value = response.data[0];
    console.log("Setting:", settings.value);
  } catch (error) {
    console.error(error);
  }
};

const route = useRouter();
const isRootRoute = computed(() => route.currentRoute.value.path === "/");
const isLoggedIn = ref(!!localStorage.getItem("token"));
const isMobileMenuOpen = ref(false);
const lastScrollPosition = ref(0);
const isNavbarVisible = ref(true);
const scrollTimeout = ref(null);

// Control de scroll mejorado para evitar desaparición repentina
const handleScroll = () => {
  // Limpiar el timeout anterior si existe
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value);
  }

  const currentScrollPosition = window.scrollY;
  if (currentScrollPosition < 0) return;

  lastScrollPosition.value = currentScrollPosition;
};

// Asegurar que el navbar sea visible al hacer hover
const handleNavHover = () => {
  isNavbarVisible.value = true;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value);
  }
});

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const offset = window.innerHeight * 0.2;
    window.scrollTo({
      top: sectionTop - offset,
      behavior: "smooth",
    });
    isMobileMenuOpen.value = false; // Cerrar menú móvil después de click
  }
};

const logOut = () => {
  closeSession(route);
  isLoggedIn.value = false;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const navLinks = computed(() => {
  const userRole = getUserRoleOfLocalStorage();
  let links = [
    { name: "Marketplace", path: "/marketplace" },
    { name: "Panel de control", path: "/dashboard" },
  ];

  if (userRole === "super_user" || userRole === "admin") {
    links.push(
      { name: "Análisis", path: "/analysisAndReports" },
      { name: "Finanzas", path: "/finance" }
    );
  }

  return links;
});
</script>

<template>
  <div
    class="nav-wrapper"
    :class="{ 'nav-hidden': !isNavbarVisible }"
    @mouseenter="handleNavHover"
  >
    <nav class="navbar navbar-expand-lg floating-nav">
      <div class="navbar-container">
        <div class="navbar-left">
          <img
            :src="settings.logo"
            width="100"
            height="50"
            alt="Logo"
            class="navbar-logo"
          />
          <a class="navbar-brand mx-1" href="#">{{ settings.name }}</a>
        </div>

        <button
          class="navbar-toggler"
          :class="{ 'is-active': isMobileMenuOpen }"
          @click="toggleMobileMenu"
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div
          class="navbar-collapse"
          :class="{ show: isMobileMenuOpen }"
          id="navbarNav"
        >
          <div class="navbar-content">
            <ul class="navbar-nav">
              <li v-if="isRootRoute" class="nav-item">
                <a class="nav-link" @click="scrollToSection('home')">
                  <span>Inicio</span>
                </a>
              </li>

              <template v-if="isLoggedIn">
                <li v-for="link in navLinks" :key="link.name" class="nav-item">
                  <router-link class="nav-link" :to="link.path">
                    {{ link.name }}
                  </router-link>
                </li>
              </template>

              <li v-if="isRootRoute" class="nav-item">
                <a class="nav-link" @click="scrollToSection('about')">
                  Acerca de
                </a>
              </li>

              <li v-if="isRootRoute" class="nav-item">
                <a class="nav-link" @click="scrollToSection('faq')"> FAQ </a>
              </li>

              <li v-if="isRootRoute" class="nav-item">
                <a class="nav-link" @click="scrollToSection('contact')">
                  Contacto
                </a>
              </li>

              <li v-if="isRootRoute" class="nav-item">
                <a class="nav-link" @click="scrollToSection('blog')"> Blog </a>
              </li>
            </ul>
          </div>

          <div class="navbar-right">
            <button
              v-if="isLoggedIn"
              class="auth-button logout-button"
              @click="logOut()"
            >
              <span>Cerrar Sesión</span>
            </button>
            <RouterLink v-else class="auth-button login-button" to="/login">
              <span>Iniciar Sesión</span>
            </RouterLink>
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
  width: 90%;
  z-index: 1000;
  padding-top: 15px;
  transition: transform 0.3s ease-in-out;
}

.nav-hidden {
  transform: translate(-50%, -100%);
}

.floating-nav {
  background-color: var(--navbar-bg) !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 80px;
  margin: 0 auto;
  width: 100%;
  max-width: auto;
  opacity: 0.95;
  /* transition: all 0.3s ease; */
}

.floating-nav:hover {
  opacity: 1;
  /* transform: translateY(-2px); */
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1.5rem;
  flex-wrap: nowrap;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.logo-link:hover {
  transform: scale(1.05);
}

.navbar-logo {
  border-radius: 70px;
  transition: transform 0.3s ease;
}

.navbar-brand {
  color: var(--text-primary);
  font-weight: 600;
  margin-left: 1rem;
  font-size: 1.25rem;
}

.navbar-nav {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  flex-wrap: nowrap;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.navbar-nav::-webkit-scrollbar {
  display: none;
}

.navbar-right {
  margin-left: auto;
  flex-shrink: 0;
}

.nav-link {
  white-space: nowrap;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: 18px;
  transition: all 0.3s ease;
}

.nav-link .icon {
  margin-right: 0.5rem;
  font-size: 1.1em;
}

.nav-link:hover {
  background-color: var(--navbar-bg-hover);
  transform: translateY(-2px);
}

.auth-button {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 70px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.logout-button {
  background-color: var(--button-primary);
  color: white;
}

.login-button {
  background-color: #e6743c;
  color: white;
}

.auth-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.auth-button .icon {
  margin-right: 0.5rem;
}

/* Estilos del botón hamburguesa */
.navbar-toggler {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  margin-right: 10px;
}

.navbar-toggler span {
  width: 2rem;
  height: 0.25rem;
  background: var(--text-primary);
  /* border-radius: 10px; */
  transition: all 0.3s linear;
  position: relative;
  transform-origin: 1px;
}

.navbar-toggler.is-active span:first-child {
  transform: rotate(45deg);
}

.navbar-toggler.is-active span:nth-child(2) {
  opacity: 0;
}

.navbar-toggler.is-active span:last-child {
  transform: rotate(-45deg);
}

@media (max-width: 1260px) {
  .nav-wrapper {
    width: 95%;
    padding-top: 10px;
  }

  .floating-nav {
    border-radius: 25px;
  }

  .navbar-container {
    padding: 0.5rem;
    position: relative;
  }

  .navbar-toggler {
    display: flex;
    margin-left: auto;
    z-index: 1001;
  }

  /* Contenedor del menú desplegable */
  .navbar-collapse {
    display: none;
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    right: 0;
    background-color: var(--navbar-bg);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  /* Cuando el menú está activo */
  .navbar-collapse.show {
    display: block !important;
    opacity: 1;
    visibility: visible;
  }

  /* Contenedor del contenido del navbar */
  .navbar-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  /* Lista de navegación */
  .navbar-nav {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    gap: 0.5rem;
  }

  /* Elementos de navegación */
  .nav-item {
    width: 100%;
    margin: 0;
  }

  /* Enlaces de navegación */
  .nav-link {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1rem;
    color: var(--text-primary);
    text-decoration: none;
    border-radius: 10px;
    transition: background-color 0.2s ease;
  }

  .nav-link:hover {
    background-color: var(--navbar-bg-hover);
  }

  /* Contenedor de los botones de autenticación */
  .navbar-right {
    width: 100%;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  /* Botones de autenticación */
  .auth-button {
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
  }

  /* Ajustes del logo */
  .navbar-left {
    display: flex;
    align-items: center;
  }

  .logo-link {
    display: flex;
    align-items: center;
  }

  /* Animación para el menú desplegable */
  .navbar-collapse {
    transform: translateY(-10px);
    transition: all 0.3s ease;
    opacity: 0;
    visibility: hidden;
  }

  .navbar-collapse.show {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
}

/* Estilos específicos para pantallas muy pequeñas */
@media (max-width: 480px) {
  .nav-wrapper {
    width: 100%;
    padding: 10px;
  }

  .navbar-collapse {
    position: fixed;
    top: 80px;
    left: 10px;
    right: 10px;
    max-height: calc(100vh - 90px);
    overflow-y: auto;
    margin: 0;
  }

  .navbar-brand {
    font-size: 1rem;
  }

  .navbar-logo {
    width: 80px;
    height: 40px;
  }
}

/* Transiciones y animaciones */
.nav-hidden {
  transform: translate(-50%, -100%);
}

/* Animación del menú desplegable */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.navbar-collapse.show {
  animation: slideIn 0.3s ease forwards;
}

/* Mejora de la visibilidad del contenido */
.nav-link {
  color: var(--text-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link .icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}
</style>