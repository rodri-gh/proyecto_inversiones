<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { getHeaderRequest, getUserIdOfLocalStorage } from '@/authService';

const userProfile = ref({});
const baseURL = 'http://localhost:3000/user/';

onMounted(async () => {
    getUserProfile();
})

const getUserProfile = async () => {
    try { 
        var userId = getUserIdOfLocalStorage();
        var header = getHeaderRequest();
        const response = await axios.get(baseURL+userId, header); 
        userProfile.value = response.data;
        console.log(response.data)
    } catch(e) { 
        console.error(e);
    }
}
</script>

<template>
    <div>
        <div class="profile-image my-4">
                <img src="@/assets/ImageProfile.png" alt="Imagen de usuario">
        </div>
        <div class=""> 
            <h4>{{  userProfile.name }} {{ userProfile.last_name }}</h4>
            <br>
            <h4>{{ userProfile.role }}</h4>
            <h5>______________</h5>
            <br>
            <h4> &#x1F4E9;  {{ userProfile.email }}</h4>
            <h4> &#x1F4DE;  {{ userProfile.phone }}</h4>
            <h4>&#x1F6E1; {{ userProfile.two_factor_enabled }}</h4>
        </div>
    </div>
</template>

<style scoped>
.profile-image { 
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    overflow: hidden;
    border: 2px solid #ccc;
}
.profile-image img {
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
}
</style>