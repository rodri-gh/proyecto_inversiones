<template>
    <div class="mt-5">
        <!-- <div v-if="token && (user.role != 'admin' && user.role != 'super_user')"> -->
        <div class="container col-md-10">
            <div class="row col-md-12">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h1 class="text-center mb-5">Contáctanos</h1>
                            <div class="row">
                                <div class="col-lg-6 mb-4 mb-lg-0">
                                    <div class="contact-info bg-white p-4 rounded shadow-sm">
                                        <h2 class="h4 mb-4">Encuéntranos en:</h2>
                                        <ul class="list-unstyled">
                                            <li class="mb-3">
                                                <span>123 Calle, Ciudad, País</span>
                                            </li>
                                            <li class="mb-3">
                                                <span>+591 7654321</span>
                                            </li>
                                            <li class="mb-3">
                                                <span>informacion@ejemplo.com</span>
                                            </li>
                                            <li>
                                                <span>Lun - Vie: 9:00 AM - 5:00 PM</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body justify-content-center">
                            <div class="mb-3 row">
                                <div class="col-6">
                                    <Input id="name" label="Nombre" v-model="name" type="text" />
                                </div>
                                <div class="col-6">
                                    <Input id="lastname" label="Apellido" v-model="lastname" type="text" />
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <div class="col-6">
                                    <Input id="email" label="Correo" v-model="email" type="email" />
                                </div>
                                <div class="col-6">
                                    <Input id="phone" label="Teléfono" v-model="phone" type="text" />
                                </div>
                            </div>
                            <div class="mb-3">
                                <InputTextArea id="comments" label="Comentarios" v-model="comments" />
                            </div>
                            <div class="col-12 text-center">
                                <Button text="Restablecer" buttonClass="btn-outline-secondary mx-2" @click="reset()" />
                                <Button text="Enviar" buttonClass="btn-primary mx-2" @click="saveContact()" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container col-md-10 mt-5">
            <!-- <div v-if="token && (user.role == 'admin' || user.role == 'super_user')"> -->
            <div class="col-md-12">
                <div class="card shadow border-0">
                    <div class="card-body">
                        <h4 class="card-title text-center">Lista de Usuarios que requieren información</h4>
                        <TableContacts :headers="headers" :items="contacts" :actions="{
                            answer: answerContact,
                            delete: deleteContact,
                        }" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
//import { RouterLink } from "vue-router";
import axios from "axios";
import Button from "@/components/base/Button.vue";
import TableContacts from "@/components/tables/TableContacts.vue";
import InputTextArea from "@/components/base/InputTextArea.vue";
import Input from "@/components/base/Input.vue";
import Swal from "sweetalert2";

const token = localStorage.getItem("token") || "";
const user = JSON.parse(localStorage.getItem("user")) || "";

const headers = [
    "Nombre",
    "Apellido",
    "Correo",
    "Teléfono",
    "Comentarios",
    "Fecha de envío",
    "Respuesta",
    "Estado",
    "Acciones"
];

const baseURL = "http://localhost:3000/contacts/";

const contacts = ref([]);
const name = ref("");
const lastname = ref("");
const email = ref("");
const phone = ref("");
const comments = ref("");
const created_date = new Date();

onMounted(() => {
    getContacts();
    const token = localStorage.getItem("token") || "";
});

const getContacts = async () => {
    try {
        const { data } = await axios.get(baseURL);
        contacts.value = data.data;
        console.log("Contactos:", contacts.value);
    } catch (error) {
        console.log(error);
    }
};
const saveContact = async () => {
    if (!validateContactInput()) return;
    const datos = {
        name: name.value,
        lastname: lastname.value,
        email: email.value,
        phone: phone.value,
        comments: comments.value,
    };
    try {
        const { data } = await axios.post(baseURL, datos);
        console.log(data);
        Swal.fire({
            icon: "success",
            title: "Datos enviados con éxito!",
            text: "Se le enviará más información al correo proporcionado",
            showConfirmButton: false,
            timer: 2500,
        })
        getContacts();
        reset();
    } catch (error) {
        console.log(error);
    }
};
const validateContactInput = () => {
    if (!name.value || !lastname.value || !email.value || !phone.value || !comments.value) {
        Swal.fire({
            icon: "warning",
            title: "Campos vacíos!",
            text: "Todos los campos son obligatorios",
        });
        return false;
    }
    return true;
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

const reset = () => {
    name.value = "";
    lastname.value = "";
    email.value = "";
    phone.value = "";
    comments.value = "";
};
</script>
<style></style>