<template>
  <div>
    <router-link to="/" class="btn btn-primary"><i class="fas fa-globe"></i> Ir a la Web</router-link>
      <div class="navbar-tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="selectedTab = tab"
          :class="{ active: selectedTab === tab }"
        >
          {{ tab }}
        </button>
      </div>

      <div class="tab-content mt-3">
        <div v-if="selectedTab === 'Categoria Post'">
          <CategoryPostView />
        </div>
        <div v-if="selectedTab === 'Post'">
          <PostsView />
        </div>
        <div v-if="selectedTab === 'FAQs'">
          <FaqAdmin />
        </div>
      </div>
  </div>
</template>
  
<script setup>
import { onMounted, ref } from "vue";
import CategoryPostView from "@/views/CategoryPostView.vue";
import PostsView from "@/views/PostsView.vue";
import FaqAdmin from "./FaqAdmin.vue";
import { getUserRoleOfLocalStorage } from "@/authService";
import { useRouter } from "vue-router";

const selectedTab = ref('Categoria Post');
const tabs = ['Categoria Post',
    'Post', 'FAQs'];
const roleUser = getUserRoleOfLocalStorage(); 
const router = useRouter();

onMounted(() => {
  console.log(roleUser);
  if(roleUser === 'client') { 
    router.push({ path: "/" });
  }
});

</script>

<style scoped>
.navbar-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  border-radius: 30px;
}

.navbar-tabs button {
  padding: 10px 20px;
  border: none;
  border-radius: 30px !important;
  background-color: #ffffff;
  cursor: pointer;
  border-radius: 5px;
}

.navbar-tabs button.active {
  background-color: #204d7c;
  border-radius: 30px;
  color: white;
}

.navbar-tabs button:hover {
  background-color: #879dda;
  color: #04090e;
  border-radius: 10px;
}

.tab-content {
  padding: 10px;
  border-radius: 5px;
}
</style>