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
                            <tr v-if="withdrawals.length == 0">
                                <td colspan="5" class="text-center">
                                    No hay solicitudes de retiro registradas
                                </td>
                            </tr>

                            <tr v-for="withdrawal in withdrawals" :key="withdrawal.withdrawalRequestId">
                                <td>{{ withdrawal.receiveAmount }} </td>
                                <td>
                                    <span v-if="withdrawal.status === 'approved'" class="badge bg-success">Aprovado</span>
                                    <span v-else class="badge bg-danger">Pendiente</span>
                                </td>
                                <td>
                                    <button class="btn btn-warning btn-sm m-1" @click="selectWithdrawal(withdrawal)">
                                        <i class="fa fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm m-1" @click="deleteWithdrawal(withdrawal.withdrawalRequestId)">
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
      :showSaveButton="!selectedMineral?.withdrawalRequestId"
      :showUpdateButton="Boolean(selectedMineral?.withdrawalRequestId)"
      @onClose="reset()"
      @onSave="saveMineral()"
    >
      <Input
        id="requestAmount"
        label="Cantidad"
        v-model="requestAmount"
        type="number"
        placeholder="Ingrese la cantidad"
      />

      <InputFile
        id="photoDocument"
        label="Ingrese foto de identidad"
        @update:modelValue="handleImageChange"
        accept="image/*"
      />

      <InputFile
        id="selfiePhoto"
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
import TableMinerals from "@/components/tables/TableMinerals.vue";
import Modal from "@/components/base/Modal.vue";
import Input from "@/components/base/Input.vue";
import InputTextArea from "@/components/base/InputTextArea.vue";
import InputFile from "@/components/base/InputFile.vue";
import { openModal, closeModal } from "@/utils/modal";
import { getHeaderRequest } from "@/authService";

const withdrawals = ref([]);
const requestAmount = ref("");
const selectedWithdrawal = ref(null); //recorda cambiar
const photoDocument = ref(null); 
const selfiePhoto = ref(null);
const selectedMineral = ref({});
const previewUrl = ref(null);
const baseURL = "http://localhost:3000/withdrawal-request/";
const header = getHeaderRequest();



const fetchWithdrawals = async () => {
    try {
        const response = await axios.get(baseURL, header);
        withdrawals.value = response.data; // Asumiendo que el backend devuelve un array de solicitudes
        //withdrawals.value = withdrawals.value.filter((w) => w.deleted == 1);
        console.log(withdrawals.value);
        console.log('datos recibidos exitosamente')
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
        requestAmount: requestAmount.value,
    };

    try {
        await axios.put(
            `http://localhost:3000/withdrawal/${selectedWithdrawal.value.id}`,
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
    requestAmount.value = withdrawal.requestAmount;
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
  requestAmount.value = mineral.name;
//price.value = mineral.price;
  //description.value = mineral.description;
 // previewUrl.value = mineral.image;
openModal("modalMineral");
};

const saveMineral = async () => {
  const method = selectedMineral.value.withdrawalRequestId ? "put" : "post";
  const url = selectedMineral.value.withdrawalRequestId
    ? `${baseURL}${selectedMineral.value.withdrawalRequestId}`
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
  requestAmount.value = "";
  photoDocument.value = null;
  selfiePhoto.value = null;
  previewUrl.value = null;
  selectedMineral.value = {};
};

fetchWithdrawals(); 

const createFormData = () => {
const formData = new FormData(); 
    formData.append("investment_id", 1);/////// predeterminado  (enlazar )
    formData.append("user_id", 1); 

    console.log(parseFloat(requestAmount.value));



    formData.append("requestAmount", requestAmount.value);
    formData.append("commission_apply", requestAmount.value);
    formData.append("receive_amount", requestAmount.value);
    
    if (photoDocument.value) {
        formData.append("photoDocument", photoDocument.value);
    }
    if (selfiePhoto.value) {
        formData.append("selfiePhoto", selfiePhoto.value);
    }
return formData;
};


const handleImageChange = (file) => {
  photoDocument.value = file;
  selfiePhoto.value = file;
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  } else {
    previewUrl.value = null;
  }
};




</script>

<style scoped>

</style>