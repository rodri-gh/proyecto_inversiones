// modulo de autentificacion
import { ref } from 'vue';

const isLoggedIn = ref(!!localStorage.getItem("token"));

export function verifyAuthentication(router) {
  isLoggedIn.value = !!localStorage.getItem("token");
  if (!isLoggedIn.value) {
    router.push("/login")
  } else {
    router.push("/")
  }
}

export function closeSession(router) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  isLoggedIn.value = false;
  router.push({ path: "/login" })
}

export function getStatusAuthentication() {
  const token = localStorage.getItem("token");
  return token !== null;
}

export const authServiceToken = {
  getToken() {
    return localStorage.getItem('token');
  },
  setToken(token) {
    return localStorage.setItem('token', token);
  },
  removeToken() {
    return localStorage.removeItem('token');
  }
}

export function getHeaderRequest() {
  const token = authServiceToken.getToken() || "";
  const header = {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      'Cache-Control': 'no-cache'
    },
  };
  return header;
}

export function getHeaderRequestMultiPartFormData() {
  const token = authServiceToken.getToken() || "";
  const header = {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
      'Cache-Control': 'no-cache'
    },
  };
  return header;
}

export function getUserIdOfLocalStorage() {
  const user = JSON.parse(localStorage.getItem('user'));
  var userId = user?.user_id;
  return userId;
}

export function getUserRoleOfLocalStorage() {
  var user = JSON.parse(localStorage.getItem('user'));
  var userRole = user?.role;
  return userRole;
}

export function getPhaseOfProject() {
  var phases = [
    { key: 'Contrato', value: 14.28 },
    { key: 'Inversion', value: 28.56 },
    { key: 'Ganancia', value: 42.84 },
    { key: 'Compra de Mineral', value: 57.12 },
    { key: 'Envio', value: 71.4 },
    { key: 'Entrega', value: 85.68 },
    { key: 'Pago', value: 100 },
  ]
  return phases;
}

export function userNameOfLocalStorage() {
  var user = JSON.parse(localStorage.getItem('user'));
  var userName = user?.username;
  return userName;
}



