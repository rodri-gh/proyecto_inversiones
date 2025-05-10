<script setup>
import { ref, reactive } from "vue";
import axios from "axios";
const name = ref("");
const email = ref("");
const phone = ref("");
const comments = ref("");
const form = reactive({
  name: "",
  lastname: "",
  email: "",
  phone: "",
  comments: "",
  answer: "",
});

//testeando contacto

const handleSubmit = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/contacts`,
      form
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
</script>



<template>
  <div class="container md-6">
    <div class="contact-form">
      <h2>¡Contactanos Ya!</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <input
            v-model="form.name"
            id="name"
            type="text"
            placeholder="Nombre"
            required
          />
          <input
            v-model="form.email"
            id="email"
            type="email"
            placeholder="Email"
            required
          />
          <input
            v-model="form.phone"
            id="phone"
            type="number"
            placeholder="Telefono"
            required
          />
        </div>
        <textarea
          v-model="form.comments"
          id="comments"
          placeholder="Mensaje"
          required
        ></textarea>
        <button type="submit">Enviar Mensaje</button>
      </form>
    </div>

    <div class="contact-info">
      <h3>Datos de Contacto</h3>
      <div class="info-box">
        <p>Teléfono: +34 123 456 789</p>
        <p>WhatsApp: +34 123 456 789</p>
        <p>Email: info@mineralesfascinantes.com</p>
        <p>Dirección: Bolivia</p>
        <p>Horario de Atención: Lunes a Viernes: 9:00 - 18:00</p>
      </div>
      <div class="video-box">
        <iframe
          width="100%"
          height="200"
          src="https://www.youtube.com/watch?v=nhBVL41-_Cw"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>


<style scoped>
.contact-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f0f0f0;
}

.contact-form {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
}

.contact-form h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.form-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

input[type="text"],
input[type="email"],
input[type="number"],
textarea {
  width: 100%;
  padding: 10px;
  border-radius: 20px;
}

textarea {
  resize: none;
  height: 80px;
}

button {
  background-color: #f57c00;
  color: #fff;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
}

button:hover {
  background-color: #e67c00;
}

.contact-info {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.contact-info h3 {
  font-size: 22px;
  margin-bottom: 10px;
}

.info-box {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  text-align: left;
  margin-bottom: 10px;
}

.video-box {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  text-align: left;
  margin-bottom: 10px;
  overflow: hidden;
}
</style>

