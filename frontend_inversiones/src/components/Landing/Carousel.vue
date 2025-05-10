<template>
  <div>
    <div
      id="carouselAction"
      class="carousel slide my-5 text-center"
      data-bs-ride="carousel"
    >
      <h1>Explora nuestra coleccion</h1>
      <div class="carousel-inner">
        <div
          v-for="(image, index) in mineralImages"
          :key="index"
          :class="['carousel-item', { active: index === 0 }]"
        >
          <img :src="image.src" class="d-block w-100" :alt="image.alt" />
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselAction"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselAction"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import Minerals1 from "@/assets/mineralsImage.jpeg";
import Minerals2 from "@/assets/coloresMinerals.jpg";
import Minerals3 from "@/assets/aboutMinerals.png";

const mineralImages = [
  { src: Minerals1, alt: "image 1" },
  { src: Minerals2, alt: "image 2" },
  { src: Minerals3, alt: "image 3" },
];
</script>

<style scoped>
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