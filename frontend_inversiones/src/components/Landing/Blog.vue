<template>
  <div class="text-center bg-white py-5">
    <h2 class="mb-4">Nuestro Blog</h2>
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

const baseURL = `${import.meta.env.VITE_API_URL}/post/`;

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
  itemsToShow: 1,
  wrapAround: true,
  transition: 500,
  breakpoints: {
    768: {
      itemsToShow: 2,
      snapAlign: "center",
    },
    1024: {
      itemsToShow: 3,
      snapAlign: "center",
    },
    1280: {
      itemsToShow: 3.95,
      snapAlign: "center",
    },
  },
};
</script>

<style scoped>
button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 70px;
  padding: 10px 20px;
  font-size: 16px;
  height: 50px;
  cursor: pointer;
  text-decoration: none;
  line-height: 1.6;
}

button:hover {
  opacity: 0.9;
}
/*imagen con tamaño fijo*/
img {
  height: 200px !important;
  border-radius: 15px !important;
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
  margin: 0 8px;
  min-height: 300px;
  width: 100%;
}
.carousel__item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 15px;
}
.carousel__item h2 {
  font-size: 18px;
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

@media (max-width: 768px) {
  .carousel__item {
    min-height: 250px;
  }

  .carousel__item h2 {
    font-size: 16px;
  }

  button {
    padding: 8px 16px;
    font-size: 14px;
    height: 40px;
  }

  .carousel__slide {
    transform: none !important;
    opacity: 1 !important;
  }
}

@media (max-width: 480px) {
  .carousel__item img {
    height: 150px;
  }

  .carousel__item {
    min-height: 220px;
  }
}
.carousel__prev,
.carousel__next {
  background-color: var(--primary-color) !important;
  border-radius: 50%;
  width: 32px !important;
  height: 32px !important;
  font-size: 14px;
}

@media (max-width: 768px) {
  .carousel__prev,
  .carousel__next {
    display: none !important;
  }
}
</style>