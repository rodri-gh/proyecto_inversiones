<template>
    <div class="container col-md-8 mt-5">
        <div class="card shadow border-0">
            <div class="card-body">
                <h4 class="card-title text-center">Solicitudes de Retiro</h4>
                <div class="text-end">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#modalWithdrawal">
                        <i class="fa fa-plus mx-1"></i> Nueva Solicitud
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Método de Pago</th>
                                <th scope="col">Notas</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="withdrawals.length == 0">
                                <td colspan="5" class="text-center">
                                    No hay solicitudes de retiro registradas
                                </td>
                            </tr>

                            <tr v-for="withdrawal in withdrawals" :key="withdrawal.id">
                                <td>{{ withdrawal.amount }}</td>
                                <td>{{ withdrawal.paymentMethod }}</td>
                                <td>{{ withdrawal.notes }}</td>
                                <td>
                                    <span v-if="withdrawal.status === 'active'" class="badge bg-success">Activo</span>
                                    <span v-else class="badge bg-danger">Inactivo</span>
                                </td>
                                <td>
                                    <button class="btn btn-warning btn-sm m-1" @click="selectWithdrawal(withdrawal)">
                                        <i class="fa fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm m-1" @click="deleteWithdrawal(withdrawal.id)">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- modal para retirar -->
        <div class="modal fade" id="modalWithdrawal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"
            role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalTitleId">
                            Datos de la Solicitud de Retiro
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="reset()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="amount" class="form-label">Cantidad</label>
                            <input type="number" class="form-control" v-model="amount" id="amount" required />
                        </div>

                        <div class="mb-3">
                            <label for="paymentMethod" class="form-label">Método de Pago</label>
                            <select class="form-select" v-model="paymentMethod" id="paymentMethod" required>
                                <option value="">Seleccione un método</option>
                                <option value="bank">Transferencia Bancaria</option>
                                <option value="paypal">PayPal</option>
                                <option value="crypto">Criptomonedas</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="image" class="form-label">Sube una foto de tu DNI</label>
                            <input
                            type="file"
                            class="form-control"
                            ref="dniImage"
                            id="dniImage"
                            @change="previewImage()"
                            accept="image/png, image/jpeg"
                            />
                        </div>

                        <div class="mb-3">
                            <label for="image" class="form-label">Sube una selfie</label>
                            <input
                            type="file"
                            class="form-control"
                            ref="selfieImage"
                            id="selfieImage"
                            @change="previewImage()"
                            accept="image/png, image/jpeg"
                            />
                        </div>

                        <div class="mb-3">
                            <label for="notes" class="form-label">Notas (opcional)</label>
                            <textarea class="form-control" v-model="notes" id="notes"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="reset()">
                            Cancelar
                        </button>
                        <button v-if="selectedWithdrawal && selectedWithdrawal.id == null" type="button"
                            class="btn btn-primary" @click="createWithdrawal()">
                            Guardar
                        </button>
                        <button v-else type="button" class="btn btn-primary" @click="updateWithdrawal()">
                            Solicitar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from "vue";
import axios from "axios";

const amount = ref("");
const paymentMethod = ref("");
const notes = ref("");
const withdrawals = ref([]);
const selectedWithdrawal = ref(null);

const fetchWithdrawals = async () => {
    try {
        const response = await axios.get("http://localhost:3000/withdrawals");
        withdrawals.value = response.data; // Asumiendo que el backend devuelve un array de solicitudes
    } catch (error) {
        console.error("Error fetching withdrawals:", error);
    }
};

const createWithdrawal = async () => {
    const requestData = {
        amount: amount.value,
        paymentMethod: paymentMethod.value,
        notes: notes.value,
    };

    try {
        const response = await axios.post(
            "http://localhost:3000/withdrawals",
            requestData
        );
        withdrawals.value.push(response.data); 
        reset();
    } catch (error) {
        console.error("Error creating withdrawal:", error);
    }
};

const updateWithdrawal = async () => {
    if (!selectedWithdrawal.value || !selectedWithdrawal.value.id) {
        console.error("No hay una solicitud de retiro seleccionada o el ID es inválido.");
        return;
    }

    const requestData = {
        amount: amount.value,
        paymentMethod: paymentMethod.value,
        notes: notes.value,
    };

    try {
        await axios.put(
            `http://localhost:3000/withdrawals/${selectedWithdrawal.value.id}`,
            requestData
        );
        const index = withdrawals.value.findIndex(
            (w) => w.id === selectedWithdrawal.value.id
        );
        if (index !== -1) {
            withdrawals.value[index] = {
                ...selectedWithdrawal.value,
                ...requestData,
            };
        }
        reset();
    } catch (error) {
        console.error("Error updating withdrawal:", error);
    }
};

const deleteWithdrawal = async (id) => {
    try {
        await axios.delete(`http://localhost:3000/withdrawals/${id}`);
        withdrawals.value = withdrawals.value.filter((w) => w.id !== id); // Eliminar de la lista
    } catch (error) {
        console.error("Error deleting withdrawal:", error);
    }
};

const selectWithdrawal = (withdrawal) => {
    selectedWithdrawal.value = withdrawal;
    amount.value = withdrawal.amount;
    paymentMethod.value = withdrawal.paymentMethod;
    notes.value = withdrawal.notes;
};

const reset = () => {
    selectedWithdrawal.value = null;
    amount.value = "";
    paymentMethod.value = "";
    notes.value = "";
};

const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log(e.target.result); // Muestra la URL de la imagen en consola
        };
        reader.readAsDataURL(file);
    }
};

fetchWithdrawals(); 
</script>

<style scoped>

</style>