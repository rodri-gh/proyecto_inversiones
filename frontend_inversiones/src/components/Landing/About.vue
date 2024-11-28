<template>
  <div class="py-5 bg-white">
    <div class="row">
      <div class="col-md-1"></div>

      <div class="col-md-5 d-flex flex-column justify-content-center">
        <h1 class="py-2">{{ settings.aboutTitle || "Titulo de cabecera" }}</h1>
        <h7 class="py-2">{{ settings.aboutText || "Texto acerca de" }} </h7>
      </div>
      <div class="col-md-6 img-about text-center">
        <img
          :src="
            settings.aboutImage ||
            'https://as1.ftcdn.net/v2/jpg/01/80/37/76/1000_F_180377624_wOuVL0f23adqaXxGdOkOVglYuilE8Bhu.jpg'
          "
          alt="minerales"
          width="auto"
          height="auto"
          class="img-fluid img-about rounded-5"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const baseURL = `${import.meta.env.VITE_API_URL}/site-setting`;

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

<style  scoped>
.fondo {
  position: relative;
  width: 100%;
  height: 600px;
  background-image: url("@/assets/mineralsImage.jpeg");
  background-size: cover;

  background-position: center;
  flex-direction: column;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 1;
}
.fondo::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  pointer-events: none;
  z-index: 0;
}
h1 {
  color: rgb(255, 94, 0);
  z-index: 2;
}
p {
  color: rgb(255, 255, 255);
  z-index: 2;
}
.button-config {
  background-color: transparent;
  border: 2px solid white;
  border-radius: 20px;
  padding: 9px;
  color: white;
  margin: 30px;
  z-index: 2;
}
.img-about img {
  max-width: 50%;
  height: auto;
}
.carousel-item img {
  width: 100%;
  height: 720px;
  object-fit: cover;
}
</style>