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

export const authServiceToken = { 
    getToken() { 
        return localStorage.getItem('token');
    }, 
    setToken(token) { 
        return localStorage.setItem('token', token);
    },
    removeToken() { 
        return localStorage.removeItem('token');
    }
}

export function getHeaderRequest() { 
    const token = authServiceToken.getToken() || "";
    const header = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          'Cache-Control': 'no-cache'
        },
      };
    return header; 
}
    
export function getIdUser() { 
    const userId = JSON.parse(localStorage.getItem('user'))?.user_id;
    return userId;
}
