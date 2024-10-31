<template>
  <div class="text-center">
    <h1>Nuestro Blog</h1>
    <Carousel v-bind="config">
      <Slide v-for="(mineral, index) in mineralImages" :key="index">
        <div class="carousel__item">
          <img :src="mineral.src" :alt="mineral.alt" class="img-fluid" />
          <button class="my-1">Leer mas...</button>
        </div>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
</template>

<script setup>
import Minerals1 from "@/assets/mineralsImage.jpeg";

import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";

const mineralImages = [
  { src: Minerals1, alt: "image 1" },
  { src: Minerals1, alt: "image 2" },
  { src: Minerals1, alt: "image 3" },
];

const config = {
  itemsToShow: 3.95,
  wrapAround: true,
  transition: 500,
};
</script>

<style  scoped>
button {
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

button:hover {
  background-color: var(--button-primary-hover);
}

.carousel__slide {
  padding: 5;
}

.carousel__viewport {
  perspective: 2000px;
}

.carousel__track {
  transform-style: preserve-3d;
}

.carousel__slide--sliding {
  transition: 0.5s;
}

.carousel__slide {
  opacity: 0.9;
  transform: rotateY(-20deg) scale(0.9);
}

.carousel__slide--active ~ .carousel__slide {
  transform: rotateY(20deg) scale(0.9);
}

.carousel__slide--prev {
  opacity: 1;
  transform: rotateY(-10deg) scale(0.95);
}

.carousel__slide.carousel__slide--next {
  opacity: 1;
  transform: rotateY(10deg) scale(0.95);
}

.carousel__slide--active {
  opacity: 1;
  transform: rotateY(0) scale(1);
}
</style>