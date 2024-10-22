<script setup>
</script>

<template>
    <div class="whatsapp-container">
        <a
        href="https://wa.me/59171462777?text=Hola%2C%20estoy%20interesado%20en%20tu%20producto"
        class="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        >
            <img src="../assets/iconWatsApp.png" alt="WhatsApp">
            <span class="tooltip-text">¿Necesitas ayuda? Escribenos!</span><!-- PALABRA del tooltip -->
        </a>
    </div>
</template>

<style scoped>
.whatsapp-container {
  position: fixed; /* da fijo en la pantalla */
  bottom: 25px; /* esta a 20px del fondo */
  right: 30px; /* esta a 20px de la derecha */
  z-index: 1000; /* con superposición alta */
}
.whatsapp-float {
  position: relative; /* es necesario para el tooltip */
  display: inline-block; /* para posicionar correctamente */
  background-color: #25d366;
  border-radius: 50%; 
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* sombra */
  transition: transform 0.2s; /* suavizado en hover */
}

.whatsapp-float:hover {
  transform: scale(1.1); /* agranda el icono al pasar el mouse */
}

/* Tamaño del ícono */
.whatsapp-float img {
  width: 42px; 
  height: 42px;
}

/* estilo para el tooltip */
.tooltip-text {
  visibility: hidden; /* oculto por defecto */
  width: 140px; 
  background-color: #333; 
  color: #fff; 
  text-align: center; 
  border-radius: 5px;
  padding: 5px 10px;
  position: absolute; /* posición absoluta respecto al contenedor */
  bottom: 60px; 
  left: 50%; /* centramos horizontalmente */
  transform: translateX(-50%); 
  opacity: 0; /* es invisible para animación */
  transition: opacity 0.3s; /* suave de aparición */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
}

.whatsapp-float:hover .tooltip-text {
  visibility: visible; /* mostrar tooltip */
  opacity: 1; /* hacer visible */
}
</style>

