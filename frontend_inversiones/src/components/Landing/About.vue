<template>
  <div class="my-5">
    <div class="row">
      <div class="col-md-1"></div>

      <div class="col-md-5">
        <h1>Sobre nosotros</h1>
        <h7>
          En el fascinante universo de los minerales, cada uno cuenta una
          historia. Desde ek vrillo deslumbrante de la plata hasta el calido
          abrazo del cobre, cada mineral tiene su propio caracter y encanto.
          Preparate para un viaje que hara que tu corazon lata mas rapido! Nos
          apasiona compartir el conocimiento sobre estos tesoros de la Tierra.
          Aqui no solo aprenderas sobre sus propiedades, sino que tambien
          descubriras como se utilizan en la vida cotidiana. Si incluso en tu
          joyeria favorita! Asi que, si pensabas que los minerales eran solo
          rocas aburridas, piensalo de nuevo. Estamos aqui para romper esos
          mitos y mostrarte el lado divertido y colorido de la geologia!
        </h7>
      </div>
      <div class="col-md-6 img-about">
        <img
          src="@/assets/aboutMinerals.png"
          alt="minerales"
          width="auto"
          height="auto"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style  scoped>
.fondo {
  position: relative;
  width: 100%;
  height: 600px;
  background-image: url("@/assets/mineralsImage.jpeg");
  background-size: cover;

  background-position: center;
  flex-direction: column;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 1;
}
.fondo::after {
  content: "";
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