<template>
    <div class="container py-3 row">
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
</template>
<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import axios from "axios";

const contacts = ref([]);

const baseURL = "http://localhost:3000/contacts/";

const name = ref("");
const lastname = ref("");
const email = ref("");
const phone = ref("");
const comments = ref("");

const selectedContact = ref({});

// onMounted(() => {
//     //getContacts();
// });

const getContacts = async () => {
    // try {
    //     const { data } = await axios.get(baseURL);
    //     contactos.value = data.data;
    //     console.log("Contactos:", contacts.value);
    // } catch (error) {
    //     console.log(error);
    // }
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
        //getProjects();
        reset();
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