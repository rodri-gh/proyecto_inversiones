<template>
    <div class="container col-md-8 mt-5">
        <div class="card shadow border-0">
            <div class="card-body">
                <h4 class="card-title text-center">Solicitudes de Retiro</h4>
                <div class="text-end">
                </div>
                <Button
            data-bs-toggle="modal"
            data-bs-target="#modalMineral"
            text="Nueva solicitud de retiro"
            icon="fa fa-plus"
            />
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="withdrawals.length === 0">
                                <td colspan="5" class="text-center">
                                    No hay solicitudes de retiro registradas
                                </td>
                            </tr>

                            <tr v-for="withdrawal in withdrawals" :key="withdrawal.withdrawal_requests_id">
                                <td>{{ withdrawal.receive_amount }} </td>
                                <td>
                                    <span v-if="withdrawal.status === 'approved'" class="badge bg-success">Aprovado</span>
                                    <span v-else class="badge bg-danger">Pendiente</span>
                                </td>
                                <td>
                                    <button class="btn btn-warning btn-sm m-1" @click="selectWithdrawal(withdrawal)">
                                        <i class="fa fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm m-1" @click="deleteWithdrawal(withdrawal.withdrawal_requests_id)">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <Modal
      modalId="modalMineral"
      title="Datos del Mineral"
      :showSaveButton="!selectedMineral?.withdrawal_requests_id"
      :showUpdateButton="Boolean(selectedMineral?.withdrawal_requests_id)"
      @onClose="reset()"
      @onSave="saveMineral()"
    >
      <Input
        id="request_amount"
        label="Cantidad"
        v-model="request_amount"
        type="number"
        placeholder="Ingrese la cantidad"
      />

      <InputFile
        id="photo_document"
        label="Ingrese foto de identidad"
        @update:modelValue="handleImageChange"
        accept="image/*"
      />

      <InputFile
        id="selfie_photo"
        label="Ingrese su selfie"
        @update:modelValue="handleImageChange"
        accept="image/*"
      />

      <div v-if="previewUrl" class="mt-3">
        <img :src="previewUrl" alt="Vista_previa" class="img-fluid" />
      </div>
    </Modal>
    </div>
</template>


<script setup>



import { ref, onMounted } from "vue";
import axios from "axios";
import Button from "@/components/base/Button.vue";
import Modal from "@/components/base/Modal.vue";
import Input from "@/components/base/Input.vue";
import InputFile from "@/components/base/InputFile.vue";
import { openModal, closeModal } from "@/utils/modal";

const withdrawals = ref([]);
const request_amount = ref("");
const selectedWithdrawal = ref(null); //recorda cambiar
const photo_document = ref(null); 
const selfie_photo = ref(null);
const selectedMineral = ref({});
const previewUrl = ref(null);
const baseURL = "http://localhost:3000/withdrawal_request/";



const fetchWithdrawals = async () => {
    try {
        const response = await axios.get("http://localhost:3000/withdrawal_request");
        withdrawals.value = response.data; 
        console.log(response.data);
        withdrawals.value = withdrawals.value.filter((w) => w.deleted = 1 );
    } catch (error) {
        console.error("Error fetching withdrawals:", error);    
    }
};

const updateWithdrawal = async () => {
    if (!selectedWithdrawal.value || !selectedWithdrawal.value.id) {
        console.error("No hay una solicitud de retiro seleccionada o el ID es inválido.");
        return;
    }

    const requestData = {
        request_amount: request_amount.value,
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
        await axios.patch(`http://localhost:3000/withdrawal_request/${id}`);
        withdrawals.value = withdrawals.value.filter((w) => w.deleted == 1); // Eliminar de la lista
        fetchWithdrawals();
    } catch (error) {
        console.error("Error deleting withdrawal:", error);
    }
};

const selectWithdrawal = (withdrawal) => {
    selectedWithdrawal.value = withdrawal;
    request_amount.value = withdrawal.request_amount;
};


//revisando si funcionan las imagenes 
const previewImage = (event) => {
    if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
        console.error("No se ha seleccionado ningún archivo.");
        return;
    }
    const file = event.target.files[0];
    console.log("Archivo seleccionado:", file);
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log("Preview de imagen:", e.target.result); // URL de la imagen
        };
        reader.readAsDataURL(file);
    } else {
        console.error("No se pudo leer el archivo.");
    }
};


const selectMineral = (mineral) => {
  selectedMineral.value = mineral;
  request_amount.value = mineral.name;
//price.value = mineral.price;
  //description.value = mineral.description;
 // previewUrl.value = mineral.image;
openModal("modalMineral");
};

const saveMineral = async () => {
  const method = selectedMineral.value.withdrawal_requests_id ? "put" : "post";
  const url = selectedMineral.value.withdrawal_requests_id
    ? `${baseURL}${selectedMineral.value.withdrawal_requests_id}`
    : baseURL;
 
  const formData = createFormData();
  console.log(Array.from(formData));
    for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }


  try {
    await axios[method](url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
 
    closeModal("modalMineral");
    getMinerals();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const reset = () => {
  request_amount.value = "";
  photo_document.value = null;
  selfie_photo.value = null;
  previewUrl.value = null;
  selectedMineral.value = {};
};

fetchWithdrawals(); 

const createFormData = () => {
const formData = new FormData(); 
    formData.append("investment_id", 1);/////// predeterminado  (enlazar )
    formData.append("user_id", 1); 

    console.log(parseFloat(request_amount.value));



    formData.append("request_amount", request_amount.value);
    formData.append("commission_apply", request_amount.value);
    formData.append("receive_amount", request_amount.value);
    
    if (photo_document.value) {
        formData.append("photo_document", photo_document.value);
    }
    if (selfie_photo.value) {
        formData.append("selfie_photo", selfie_photo.value);
    }
return formData;
};


const handleImageChange = (file) => {
  photo_document.value = file;
  selfie_photo.value = file;
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  } else {
    previewUrl.value = null;
  }
};
</script>

<style scoped>
</style>