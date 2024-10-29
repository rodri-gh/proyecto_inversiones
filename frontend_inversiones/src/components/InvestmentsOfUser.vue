<script setup>
import { getHeaderRequest } from '@/authService';
import axios from 'axios';
import { ref, onMounted} from 'vue';

const baseUrl = 'http://localhost:3000/investments/'

const investments = ref([]); 

onMounted( async () => { 
    try { 
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.user_id;
        const header = getHeaderRequest();
        const response = await axios.get(baseUrl+userId, header);
        investments.value = response.data.data;
    } catch(e) { 
        console.error(e);
    }
})
</script>

<template>
    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Id del proyecto</th>
                    <th scope="col">Cantidad </th>
                    <th scope="col">Porcentage de beneficio</th>
                    <th scope="col">fecha de inversion</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="investment in investments" :key="investment.id">
                    <td>{{ investment.project_id }}</td>
                    <td>{{  investment.amount }}</td>
                    <td>{{ investment.profit_percentage }}</td>
                    <td>{{ investment.investment_date }}</td>
                </tr>
                <tr></tr>
            </tbody>
        </table>
    </div>
</template>


