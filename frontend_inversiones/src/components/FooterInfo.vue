<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const baseURL = "http://localhost:3000/site-setting";

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
</script>

<template>
  <div class="m-0">
    <div class="row">
      <footer class="footer">
        <div class="footer-section text-center">
          <h5>Siguenos en Redes</h5>
          <ul class="social-links d-flex justify-content-center gap-3">
            <li>
              <a :href="settings.facebook" target="_blank"
                ><img
                  src="../assets/iconFacebook.png"
                  alt="Facebook"
                  width="50px"
                  height="50px"
              /></a>
            </li>
            <li>
              <a :href="settings.instagram" target="_blank"
                ><img
                  width="50px"
                  height="50px"
                  src="../assets/iconInstagram.png"
                  alt="Instagram"
              /></a>
            </li>
            <li>
              <a :href="settings.tiktok" target="_blank"
                ><img
                  width="50px"
                  height="50px"
                  src="../assets/iconTikTok.png"
                  alt="Tiktok"
              /></a>
            </li>
            <li>
              <a :href="settings.x" target="_blank"
                ><img
                  width="50px"
                  height="50px"
                  src="../assets/IconX.png"
                  alt="twiter"
              /></a>
            </li>
          </ul>
        </div>
        <div class="footer-section">
          <h5>Datos de Contacto</h5>
          <ul>
            <li>
              <a href="#">Telefono: {{ settings.phone }}</a>
            </li>
            <li>
              <a href="#">WhatsApp: {{ settings.whatsapp }}</a>
            </li>
            <li>
              <a :href="'mailto:' + settings.email"
                >Email: {{ settings.email }}</a
              >
            </li>
            <li>
              <a href="#">Direccion: {{ settings.address }}</a>
            </li>
            <li>
              <a href="#">Horario de Atencion: {{ settings.businessHours }}</a>
            </li>
          </ul>
        </div>
        <div class="footer-section">
          <h5>Nuestras politicas</h5>
          <ul>
            <li>
              <a :href="settings.dataPolicyLink" target="_blank"
                >Tratamiento de datos personales</a
              >
            </li>
            <li>
              <a :href="settings.termsConditionsLink" target="_blank"
                >Términos y condiciones
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
    <div class="footer-reserved-rights">
      <p>&copy; 2024 {{ settings.name }} - Todos los derechos reservados.</p>
    </div>
  </div>
</template>

<style scoped>
.footer {
  background-color: #f8f9fa;
  padding: 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border-top: 1px solid #ddd;
  font-family: Arial, sans-serif;
}
.footer-section {
  flex: 1 1 200px;
  margin: 5px 10px;
}
.footer-section h5 {
  margin-bottom: 15px;
  font-size: 20px;
  color: #002fff;
}
.footer-section ul {
  list-style: none;
  padding: 0;
}
.footer-section a {
  text-decoration: none;
  color: #555;
  transition: color 0.3s;
}
.footer-section a:hover {
  color: #ff6600;
}
.footer-reserved-rights {
  text-align: center;
  padding: 6px;
  background-color: #000000;
}
.footer-reserved-rights p {
  margin: 0;
  font-size: 14px;
  color: #ffffff;
}
</style>