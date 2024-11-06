<script setup>
import { getHeaderRequest } from '@/authService';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const baseUrlContract = 'http://localhost:3000/contract/'
const header = getHeaderRequest();
const contracts = ref([]);

const getContracts = async () => {
    try { 
        const response = await axios.get(baseUrlContract, header);
        contracts.value = response.data;
        console.log(response.data);
    } catch(e) {
        console.log(e);
    }
};

onMounted(() => {
    console.log("sgdfgdsfg")
    getContracts();
});

</script>

<template>
    <div v-for="item in contracts" :key="item.id">
        <p>Codigo: {{ item.contractCode }}</p>
        <p>Fecha: {{ item.contractDate }}</p>
        <p>Archivo: {{ item.contractFilePath }}</p>
        <p>Inversion; {{ item.investmentId }}</p>
        <p>Projecto: {{ item.projectId }}</p>
        <p>Usuario: {{ item.userId }}</p>
    </div>
</template>

<style scoped>

</style>