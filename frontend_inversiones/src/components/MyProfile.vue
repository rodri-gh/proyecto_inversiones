<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { getHeaderRequest, getIdUser } from '@/authService';

const userProfile = ref({});
const baseURL = 'http://localhost:3000/user/';

onMounted(async () => {
    getUserProfile();
})

const getUserProfile = async () => {
    try { 
        const response = await axios.get(baseURL+getIdUser(), getHeaderRequest()); 
        userProfile.value = response.data.data[0];
        console.log(response.data.data)
    } catch(e) { 
        console.error(e);
    }
}
</script>

<template>
    <div>
        <h4>nombre: {{  userProfile.name }}</h4>
        <h4>Apellido: {{ userProfile.last_name }}</h4>
        <h4>Rol: {{ userProfile.role }}</h4>
        <h4>Email: {{ userProfile.email }}</h4>
        <h4>Telefono: {{ userProfile.phone }}</h4>
        <h4>Autentificacion de dos Factores: {{ userProfile.two_factor_enabled }}</h4>
    </div>
</template>

<style scoped>
</style>