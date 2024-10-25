<template>
    <div class="container py-3 row justify-content-center">
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
                                <label for="name" class="form-label">Nombre</label>
                                <input type="text" v-model="name" id="name" class="form-control" required />
                                <div class="invalid-feedback">Por favor, ingresa tu nombre</div>
                            </div>
                            <div class="col-6">
                                <label for="lastname" class="form-label">Apellido</label>
                                <input type="text" v-model="lastname" id="lastname" class="form-control" required />
                                <div class="invalid-feedback">Por favor, ingresa tu apellido</div>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-6">
                                <label for="email" class="form-label">Correo</label>
                                <input type="email" v-model="email" id="email" class="form-control" required />
                                <div class="invalid-feedback">Por favor, ingresa tu correo</div>
                            </div>
                            <div class="col-6">
                                <label for="phone" class="form-label">Teléfono</label>
                                <input type="text" v-model="phone" id="phone" class="form-control" required />
                                <div class="invalid-feedback">Por favor, ingresa tu número de teléfono</div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="comments" class="form-label">Comentarios</label>
                            <textarea class="form-control" v-model="comments" id="comments"></textarea>
                        </div>
                        <div class="col-12 text-center">
                            <button type="button" class="btn btn-warning me-2" @click="reset()">
                                Restablecer
                            </button>
                            <button type="button" class="btn btn-primary ms-2" @click="saveContact()">
                                Enviar
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <!-- <div v-if="token && (user.role == 'admin' || user.role == 'super_user')"> -->
        <div>
            <div class="card shadow border-0">
                <div class="card-body">
                    <h4 class="card-title text-center">Lista de Usuarios que requieren información</h4>
                    <div class="text-end">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                            data-bs-target="#modalContact">
                            <i class="fa fa-plus mx-1"></i> Nuevo
                        </button>
                    </div>

                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Apellido</th>
                                    <th scope="col">Correo</th>
                                    <th scope="col">Teléfono</th>
                                    <th scope="col">comentarios</th>
                                    <th scope="col">Fecha de Envío</th>
                                    <th scope="col">Respuesta</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="contacts.length == 0">
                                    <td colspan="6" class="text-center">
                                        No hay solicitudes enviadas
                                    </td>
                                </tr>

                                <tr v-for="contact in contacts" :key="contact.contact_id">
                                    <td>{{ contact.name }}</td>
                                    <td>{{ contact.lastname }}</td>
                                    <td>{{ contact.email }}</td>
                                    <td>{{ contact.phone }}</td>
                                    <td>{{ contact.comments }}</td>
                                    <td>{{ new Date(created_date).toLocaleDateString() }}</td>
                                    <td>
                                        <span v-if="contact.answer === 'pending'"
                                            class="badge bg-danger">Pendiente</span>
                                        <span v-if="contact.answer === 'answered'"
                                            class="badge bg-success">Respondido</span>
                                    </td>
                                    <td>
                                        <span v-if="contact.deleted == 1" class="badge bg-success">Activo</span>
                                        <span v-else class="badge bg-danger">Inactivo</span>
                                    </td>
                                    <td>
                                        <button class="btn btn-warning btn-sm m-1"
                                            @click="AnswerContact(contact.contact_id)"
                                            :disabled="contact.answer === 'answered'">
                                            <i class="fa fa-envelope"></i>
                                        </button>
                                        <button v-if="contact.deleted == 1" class="btn btn-danger btn-sm m-1"
                                            @click="deleteContact(contact.contact_id)">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                        <button v-if="contact.deleted == 0" class="btn btn-success btn-sm m-1"
                                            @click="deleteContact(contact.contact_id)">
                                            <i class="fa fa-check"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import axios from "axios";

const token = localStorage.getItem("token") || "";
const user = JSON.parse(localStorage.getItem("user")) || "";

const contacts = ref([]);

const baseURL = "http://localhost:3000/contacts/";

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
        getContacts();
        reset();
    } catch (error) {
        console.log(error);
    }
};

const deleteContact = async (contact_id) => {
    try {
        const { data } = await axios.delete(baseURL + contact_id);
        console.log(data);
        getContacts();
    } catch (error) {
        console.log(error);
    }
};
const AnswerContact = async (contact_id) => {
    try {
        const { data } = await axios.patch(baseURL + contact_id);

        const contact = contacts.value.find(c => c.contact_id === contact_id);
        if (contact) {
            contact.answer = 'answered'; // Actualiza el estado localmente
        }
        console.log(data);
        getContacts();
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