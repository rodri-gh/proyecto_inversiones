<template>
  <div>
    <h1>{{ post.title }}</h1>
    <img :src="post.cover_image" :alt="post.title" />
    <p>{{ post.content }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const post = ref({});

const baseURL = "http://localhost:3000/post/";

const getPost = async () => {
  try {
    const { data } = await axios.get(`${baseURL}${route.params.id}`);
    post.value = data;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getPost();
});
</script>

<style scoped>
</style>