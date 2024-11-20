<template>
  <div class="my-5">
    <div class="row">
      <div class="col-md-1"></div>

      <div class="col-md-5">
        <h1>{{ settings.aboutTitle }}</h1>
        <h7>{{ settings.aboutText }} </h7>
      </div>
      <div class="col-md-6 img-about">
        <img
          :src="settings.aboutImage"
          alt="minerales"
          width="auto"
          height="auto"
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
  max-width: 100%;
  height: auto;
}
.carousel-item img {
  width: 100%;
  height: 720px;
  object-fit: cover;
}
</style>