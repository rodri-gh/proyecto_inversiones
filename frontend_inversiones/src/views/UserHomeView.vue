<script setup>
import { RouterLink } from "vue-router";
import Minerals1 from '@/assets/mineralsImage.jpeg'; 
import Minerals2 from '@/assets/coloresMinerals.jpg';
import Minerals3 from '@/assets/aboutMinerals.png';
import FooterInfo from '@/components/FooterInfo.vue';

const mineralImages = [ 
  { src: Minerals1, alt: 'image 1' },
  { src: Minerals2, alt: 'image 2' },
  { src: Minerals3, alt: 'image 3' },
]
</script>

<template>
  <div>
    <header>
      <!--AQUI IRIA EL NAVBAR FLOTANTE DE RODRIGO-->

      <!--BORRAR ESTE ROUTER LINK-->
      <RouterLink class="btn btn-dark" to="/login">Iniciar Sesion</RouterLink>
    </header>
   <main>
        <!--primera vista Cotiza e invierte Aqui-->
        <div class="fondo">    
          <h1>Cotiza e invierte Aqui</h1>
          <p>Ahora puedes invertir hasta en 2 minerales y en diferentes proyectos</p>
          <button class="button-config">Comienza Aqui!</button>
        </div>
        <!--Sobre nosotros-->
        <div class="my-5">
          <div class="row">

            <div class="col-md-1">
            </div>

            <div class="col-md-5">
              <h1>Sobre nosotros </h1>
              <h7>
                En el fascinante universo de los minerales, cada uno
                cuenta una historia. Desde ek vrillo deslumbrante de la plata
                hasta el calido abrazo del cobre, cada mineral tiene su propio
                caracter y encanto. Preparate para un viaje que hara que 
                tu corazon lata mas rapido!
                Nos apasiona compartir el conocimiento sobre estos tesoros
                de la Tierra. Aqui no solo aprenderas sobre sus propiedades,
                sino que tambien descubriras como se utilizan en la vida 
                cotidiana. Si incluso en tu joyeria favorita!
                Asi que, si pensabas que los minerales eran solo rocas 
                aburridas, piensalo de nuevo. Estamos aqui para romper esos
                mitos y mostrarte el lado divertido y colorido de la geologia!
              </h7>
            </div>
            <div class="col-md-6 img-about">
                <img src="@/assets/aboutMinerals.png" alt="minerales" width="auto" height="auto">
              </div>
          </div>
        </div>

        <!--Explora nuestra coleccion-->
        <div id="carouselAction" class="carousel slide my-5 text-center" data-bs-ride="carousel">
          <h1>Explora nuestra coleccion</h1>
          <div class="carousel-inner">
            <div
              v-for="(image, index) in mineralImages"
              :key="index"
              :class="['carousel-item', { active: index === 0}]"
            >
              <img :src="image.src" class="d-block w-100" :alt="image.alt" />
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselAction" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Anterior</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselAction" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Siguiente</span>
          </button>
        </div>

    </main>
    <footer>
      <FooterInfo />
    </footer>
  </div>
</template>

<style scoped>
.fondo{ 
  position: relative;
  width: 100%;
  height: 600px;
  background-image: url('@/assets/mineralsImage.jpeg'); 
  background-size: cover;

  background-position: center;
  flex-direction: column; 
  display: flex;
  justify-content: flex-end;  
  align-items: center;
  z-index: 1;
}
.fondo::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7); 
  pointer-events: none;
  z-index: 0; 
}
h1 {
  color: rgb(255, 94, 0);
  z-index: 2; 
}
p {
  color: rgb(255, 255, 255);
  z-index: 2; 
}
.button-config {
  background-color: transparent;
  border: 2px solid white;
  border-radius: 20px;
  padding: 9px;
  color: white;
  margin: 30px;
  z-index: 2;
}
.img-about img {
  max-width: 100%;
  height: auto;
}
.carousel-item img {
  width: 100%;
  height: 720px;
  object-fit: cover; 
}
</style>