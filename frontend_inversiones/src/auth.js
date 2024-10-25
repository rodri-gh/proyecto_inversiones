// modulo de autentificacion
import { ref } from 'vue';

const isLoggedIn = ref(!!localStorage.getItem("token"));

export function verifyAuthentication(router) { 
    isLoggedIn.value = !!localStorage.getItem("token");
    if( !isLoggedIn.value) { 
        router.push("/login")
    } else {
        router.push("/")
    }
}

export function closeSession(router) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    isLoggedIn.value = false; 
    router.push({ path: "/login" })
}

export function getStatusAuthentication() { 
    const token = localStorage.getItem("token");
    return token !== null;
}

