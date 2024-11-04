<template>
  <div class="main-container">
    <div class="background"></div>
      <div class="login-card mt-5">
        <div class="header-image">
          <img src="@/assets/minerals.png" alt="">
        </div>
        <div class="logo">Minerales</div>
        <div class="login-form">
          <div>
            <Input
              id="username"
              v-model="username"
              type="text"
              label="Nombre de usuario"
              class="label"

            />
          </div>
          <div>
            <Input
              id="password"
              v-model="password"
              type="password"
              label="Contraseña"
              class="label"
            />
          </div>
          <div>
            <Switch
              :checked="shouldReceiveNewsletter"
              @toggle="toggle"
              label="Recuérdame"
            />
          </div>
          <!-- 
          <div class="mb-3 col-md-12 mt-4 text-center fw-bold">
            <a class="nav-link forgot" href="#">¿Olvidaste tu contraseña?</a>
          </div> -->
          <div class="mb-3 col-md-12">
            <Button
              text="Ingresar"
              @click="iniciarSesion()"
              class="sign-in-btn"
            />
          </div>
          <!--  <div class="mb-3 col-md-12">
            <button class="btn btn-outline-secondary w-100 google">
              Ingresar con Google
            </button>
          </div> -->
          <!--  <div
            class="d-flex justify-content-center mb-3 col-md-12 mt-4 text-center"
          >
            <span class="mx-2"> ¿No tienes cuenta?</span>

            <a class="nav-link register-link fw-bolder" href="#">
              Regístrate gratis
            </a>
          </div> -->
        </div>
      </div>
  </div>
</template>

<script setup>
import Switch from "@/components/Switch.vue";

import { onMounted, ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import Input from "@/components/base/Input.vue";
import Button from "@/components/base/Button.vue";

const router = useRouter();
const baseUrl = "http://localhost:3000/auth/login";
const baseUrGetUser = "http://localhost:3000/user/";

const username = ref("");
const password = ref("");

onMounted(() => {
  limpiar();
});

const iniciarSesion = async () => {
  if (username.value == "" || password.value == "") {
    Swal.fire({
      icon: "warning",
      title: "Error!",
      text: "Ingrese sus credenciales",
      timer: 1000,
      showConfirmButton: false,
    });
    return;
  }
  const datos = {
    username: username.value,
    password: password.value,
  };
  try {
    const { data } = await axios.post(baseUrl, datos);
    const userId = data.data.user_id;
    const header = {
      headers: {
        authorization: `Bearer ${data.token}`,
        'Cache-Control': 'no-cache'
      },
    };
    const dataUser = await axios.get(baseUrGetUser+userId, header)
    data.data.role = dataUser.data.data[0]?.role;
    console.log(data.data); 
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.data));
      router.push({ path: "/home" });
    }
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "Login fallido",
      text: "Credenciales incorrectas",
    });
  }
};

//verificar si es nesesario
const limpiar = () => {
  localStorage.clear();
  if (!localStorage.getItem("token")) {
    router.push({ path: "/login" });
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Bai+Jamjuree:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Bai Jamjuree", sans-serif;
}

body, html {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.main-container{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
}
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-image: url("@/assets/mineralsImage.jpeg");
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  z-index: -1;
}

.login-card {
  position: relative;
  width: 400px;
  height: 650px;
  background-color: #fff;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2) !important;
  z-index: 1;
}

.header-image {
  position: relative;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.header-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.logo {
  position: absolute;
  top: 33%;
  left: 30%;
  background-color: #e74c3c;
  color: white;
  padding: 20px 20px;
  border-radius: 40px;
  font-size: 20px;
  font-weight: bold;
  z-index: 2; /* Asegura que esté delante del formulario */
}

.login-form {
  padding: 38px 30px;
  position: relative;
}

.label{
  font-size: 16px;
}

.sign-in-btn {
  width: 100%;
  height: 50px;
  margin-top: 20px;
  padding: 12px;
  background-color: #e74c3c;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sign-in-btn:hover {
  background-color: #c0392b;
}
/* .px-5 {
  padding-left: 8rem !important;
  padding-right: 8rem !important;
} */
/* .forgot {
  color: #9627bb;
  font-size: 13px;
}
.register-link {
  color: #9627bb;
  font-size: 13px;
}
.register-link:hover {
  text-decoration: underline;
}
.forgot:hover {
  text-decoration: underline;
}
.sesion {
  background-color: #541269;
  border: none;
  height: 45px;
  font-size: 16px;
}
.sesion:hover {
  background-color: rgb(150, 39, 187);
}
.google {
  background-color: #e2e8f0;
  border: 1px solid rgb(141, 158, 178);
  height: 45px;
  color: rgb(141, 158, 178);
  font-size: 16px;
}
.google:hover {
  color: rgb(141, 158, 178);
}
input::placeholder {
  color: rgb(141, 158, 178);
  font-size: 12px;
}
label {
  font-size: 14px;
}
span {
  font-size: 13px;
} */
</style>