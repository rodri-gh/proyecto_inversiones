<script setup>

</script>

<template>
    <footer class="footer">
        <div class="footer-section ">
            <h5>Sobre Nosotros</h5>
            <ul>
                <li><a href="#">Conocenos</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h5>Contacto</h5>
            <ul>
                <li><a href="mailto: Hamilo@proyectoinversiones.com">Escríbenos:  Hamilo@proyectoinversiones.com</a></li>
            </ul>
            <ul class="social-links">
                <li><a href="#" target="_blank"><img src="" alt="Facebook"/></a></li>
                <li><a href="#" target="_blank"><img src="" alt="Instagram" /></a></li>
                <li><a href="#" target="_blank"><img src="" alt="Tiktok" /></a></li>
                <li><a href="#" target="_blank"><img src="" alt="twiter" /></a></li>
            </ul>   
        </div>
        <div class="footer-section">
            <h5>Nuestras politicas</h5>
            <ul>
                <li><a href="#">Tratamiento de datos personales</a></li>
                <li><a href="#">Términos y condiciones </a></li>
            </ul>
        </div>
    </footer>
</template>

<style scoped>
.footer { 
  background-color: #f8f9fa;
  padding: 50px 100px; 
  display: flex;
  flex-wrap: wrap;
  justify-content: 10px; 
  border-top: 1px solid #ddd; 
  font-family: Arial, sans-serif;
  color: #333; 
}
.footer-section {
  flex: 1 1 200px; 
  margin: 5px 10px; 
}
.footer-section h5 {
  margin-bottom: 15px;
  font-size: 18px; 
  color: #007bff; 
}
.footer-section ul {
  list-style: none; 
  padding: 0;
}
.footer-section a {
  text-decoration: none;
  color: #555;
  transition: color 0.3s; 
}
.footer-section a:hover {
  color: #007bff; 
}

</style>
