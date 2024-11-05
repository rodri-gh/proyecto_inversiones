<script setup>
import { getHeaderRequest, getUserIdOfLocalStorage } from '@/authService';
import axios from 'axios';
import { ref, onMounted} from 'vue';

const baseUrl = 'http://localhost:3000/investment/user/'

const investments = ref([]); 

onMounted( async () => { 
    try { 
        const userId = getUserIdOfLocalStorage();
        const header = getHeaderRequest();
        const response = await axios.get(baseUrl+userId, header);
        investments.value = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        console.log(investments.value);
    } catch(e) { 
        console.error(e);
    }
})
</script>

<template>
    <div>
        <h3>Tus inversiones</h3>
        <div v-if="investments.length > 0 && investments != null" class="table-responsive">
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
        <div v-else>
            <p>No tienes inversiones</p>
        </div>
    </div>
</template>


