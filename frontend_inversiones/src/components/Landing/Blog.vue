<template>
  <div class="text-center bg-white py-2">
    <h1>Nuestro Blog</h1>
    <Carousel v-bind="config">
      <Slide v-for="(post, index) in posts.slice(0, 10)" :key="index">
        <div class="carousel__item">
          <img :src="post.cover_image" :alt="post.title" class="img-fluid" />
          <h2>{{ post.title }}</h2>
          <button @click="goToPost(post.id)" class="my-1">Leer más...</button>
        </div>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";

const posts = ref([]);
const router = useRouter();

const baseURL = "https://apiminerales.pruebasdeploy.online/post/";

const getPosts = async () => {
  try {
    const { data } = await axios.get(baseURL);
    posts.value = data;
  } catch (error) {
    console.log(error);
  }
};

const goToPost = (postId) => {
  router.push({
    name: "post-details",
    params: { id: postId },
  });
};

onMounted(() => {
  getPosts();
});

const config = {
  itemsToShow: 3.95,
  wrapAround: true,
  transition: 500,
};
</script>

<style scoped>
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

.carousel__item {
  margin-bottom: 20px;
}

.carousel__item img {
  max-width: 100%;
  height: auto;
}

.carousel__item h2 {
  font-size: 24px;
  margin: 10px 0;
}
</style>