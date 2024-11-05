<template>
    <div class="container col-md-10">
        <h4 class="card-title text-center">Lista de Usuarios que requieren información</h4>
        <br><br>
        <TableContacts :headers="headers" :items="contacts" :actions="{
            answer: answerContact,
            delete: deleteContact,
        }" />
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import TableContacts from "@/components/tables/TableContacts.vue";
import Swal from "sweetalert2";

const token = localStorage.getItem("token") || "";
const user = JSON.parse(localStorage.getItem("user")) || "";

const headers = [
    "Nombre",
    "Apellido",
    "Correo",
    "Teléfono",
    "Comentarios",
    "Solicitado",
    "Respuesta",
    "Estado",
    "Acciones"
];

const baseURL = "http://localhost:3000/contact/";
const contacts = ref([]);

onMounted(() => {
    getContacts();
    const token = localStorage.getItem("token") || "";
});

const getContacts = async () => {
    try {
        const { data } = await axios.get(baseURL);
        contacts.value = data;
        console.log("Contactos:", contacts.value);
    } catch (error) {
        console.log(error);
    }
};

const deleteContact = async (contact_id) => {
    try {
        const result = await Swal.fire({
            icon: "warning",
            title: "¿Está seguro?",
            text: "Se eliminará el contacto. Esta acción no se puede deshacer.",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        })
        if (result.isConfirmed) {
            const { data } = await axios.delete(baseURL + contact_id);
            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "El contacto ha sido eliminado.",
            });
            await getContacts();
        }
    } catch (error) {
        console.log(error);
    }
};
const answerContact = async (contact_id) => {
    try {
        const result = await Swal.fire({
            icon: "warning",
            title: "¿Está seguro?",
            text: "¿Desea enviar la información en este momento?",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, enviar',
            cancelButtonText: 'Cancelar'
        })
        if (result.isConfirmed) {
            const { data } = await axios.patch(baseURL + contact_id);
            const contact = contacts.value.find(c => c.contact_id === contact_id);
            if (contact) {
                contact.answer = 'answered'; // Actualiza el estado localmente
            }
            console.log(data);
            await getContacts();
        }
    } catch (error) {
        console.log(error);
    }
};

</script>
<style></style>