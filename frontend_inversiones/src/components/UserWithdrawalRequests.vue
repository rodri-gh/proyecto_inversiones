<script setup>
import { getHeaderRequest, getUserIdOfLocalStorage } from '@/authService';
import axios from 'axios';
import { ref, onMounted} from 'vue';

const baseUrl = 'http://localhost:3000/withdrawal_request/user/'

const withdrawalRequests = ref([]); 

onMounted( async () => { 
    try { 
        const userId = getUserIdOfLocalStorage();
        const header = getHeaderRequest();
        const response = await axios.get(baseUrl+userId, header);
        console.log(response.data);
        withdrawalRequests.value = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        console.log(withdrawalRequests.value);
    } catch(e) { 
        console.error(e);
    }
})
</script>

<template>
    <div>
        <h3>Tus Solicitudes de Retiro</h3>
        <div v-if="withdrawalRequests.length > 0" class="table-responsive">
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
                    <tr v-for="item in withdrawalRequests" :key="item.withdrawal_requests_id">
                        <td>{{ item.request_amount }}</td>
                        <td>{{  item.request_amount }}</td>
                        <td>{{ item.request_amount }}</td>
                        <td>{{ item.request_amount }}</td>
                    </tr>
                    <tr></tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <p>No tienes Solicitudes de retiro</p>
        </div>
    </div>
</template>


