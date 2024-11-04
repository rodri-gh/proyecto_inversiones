<script setup>

</script>

<template>
  <div class="m-0">
    <div class="row">
      <footer class="footer">
          <div class="footer-section text-center">
              <h5>Siguenos en Redes</h5>
              <ul class="social-links d-flex justify-content-center gap-3">
              <li><a href="#" target="_blank"><img src="../assets/iconFacebook.png" alt="Facebook" width="50px" height="50px"/></a></li>
              <li><a href="#" target="_blank"><img width="50px" height="50px" src="../assets/iconInstagram.png" alt="Instagram" /></a></li>
              <li><a href="#" target="_blank"><img width="50px" height="50px" src="../assets/iconTikTok.png" alt="Tiktok" /></a></li>
              <li><a href="#" target="_blank"><img width="50px" height="50px" src="../assets/IconX.png" alt="twiter" /></a></li>
            </ul>  
          </div>
          <div class="footer-section">
              <h5>Datos de Contacto</h5>
              <ul>
                <li><a href="#">Telefono: +34 123 456 789</a></li>
                <li><a href="#">WhatsApp: +34 123 456 789</a></li>
                <li><a href="mailto: info@mineralesfascinantes.com">Email:  info@mineralesfascinantes.com</a></li>
                <li><a href="#">Direccion: Bolivia, Plurinational State of</a></li>
                <li><a href="#">Horario de Atencion: Lunes a Viernes: 9:00-18:00</a></li>
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
    </div>
    <div class="footer-reserved-rights">
      <p>&copy; 2024 Minerales Fascinantes. Todos los derechos reservados.</p>
    </div>
  </div>
</template>

<style scoped>
.footer { 
  background-color: #f8f9fa;
  padding: 40px ; 
  display: flex;
  flex-wrap: wrap;
  justify-content: center; 
  border-top: 1px solid #ddd; 
  font-family: Arial, sans-serif; 
}
.footer-section {
  flex: 1 1 200px; 
  margin: 5px 10px; 
}
.footer-section h5 {
  margin-bottom: 15px;
  font-size: 20px; 
  color: #002fff; 
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
  color: #ff6600; 
}
.footer-reserved-rights {
  text-align: center;
  padding: 6px;
  background-color: #000000;
}
.footer-reserved-rights p {
  margin: 0;
  font-size: 14px;
  color: #ffffff;
}
</style>