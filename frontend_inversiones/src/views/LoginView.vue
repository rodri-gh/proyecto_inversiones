<template>
  <div class="row col-md-5 col-sm-12 mx-auto card shadow border-0 py-5 px-5">
    <div class="card-body">
      <div class="mb-3 col-md-12">
        <label for="email" class="form-label"
          >E-mail <span class="text-danger">*</span>
        </label>
        <input
          type="text"
          class="form-control"
          name="email"
          id="email"
          placeholder="Ingresa tu correo"
        />
      </div>
      <div class="mb-3 col-md-12">
        <label for="password" class="form-label"
          >Contraseña <span class="text-danger">*</span></label
        >
        <input
          type="password"
          class="form-control"
          name="password"
          id="password"
          placeholder="Ingresa tu contraseña"
        />
      </div>
      <div class="mb-3 col-md-12">
        <Switch
          :checked="shouldReceiveNewsletter"
          @toggle="toggle"
          label="Recuérdame"
        />
      </div>

      <div class="mb-3 col-md-12 mt-4 text-center fw-bold">
        <a class="nav-link forgot" href="#">¿Olvidaste tu contraseña?</a>
      </div>
      <div class="mb-3 col-md-12">
        <button class="btn btn-primary sesion py w-100 fw-bolder">
          Ingresar
        </button>
      </div>
      <div class="mb-3 col-md-12">
        <button class="btn btn-outline-secondary w-100 google">
          Ingresar con Google
        </button>
      </div>
      <div
        class="d-flex justify-content-center mb-3 col-md-12 mt-4 text-center"
      >
        <span class="mx-2"> ¿No tienes cuenta?</span>

        <a class="nav-link register-link fw-bolder" href="#">
          Regístrate gratis
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import Switch from "@/components/Switch.vue";
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Bai+Jamjuree:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");

* {
  font-family: "Bai Jamjuree", sans-serif;
}

.card {
  margin-top: 18% !important;
}
/* .px-5 {
  padding-left: 8rem !important;
  padding-right: 8rem !important;
} */
.forgot {
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
}
</style>