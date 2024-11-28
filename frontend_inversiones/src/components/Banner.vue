<template>
    <div class="alert alert-custom mb-0" role="alert">
      <div class="banner-container">
        <div class="banner-text">{{ currentAd }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const ads = [
    'Genera ganancias pasivas mientras duermes!',
    'Aprovecha los mercados financieros de manera sencilla y segura.',
    'Inversiones con total transparencia y sin comisiones ocultas.',
    'Multiplica tu capital con opciones que se adaptan a ti!',
    'Comienza con una pequeña inversión y mira cómo crece.',
    'Haz que tu dinero trabaje para ti, sin comisiones altas.'
  ];
  
  const currentAd = ref('');
  
  const pickRandomAd = () => {
    const randomIndex = Math.floor(Math.random() * ads.length);
    currentAd.value = ads[randomIndex];
  }
  
  const changeAdPeriodically = () => {
    pickRandomAd();
    setInterval(pickRandomAd, 6000);
  }
  
  onMounted(() => {
    changeAdPeriodically();
  });
  </script>
  
  <style scoped>
  .banner-text {
    white-space: nowrap;
    font-weight: bold;
    animation: slideIn 6s linear infinite;
    min-width: 100%;
    font-size: 16px;
    color: rgb(68, 60, 55);
  }
  
  @keyframes slideIn {
    0% {
      transform: translateX(40%);
      opacity: 0;
    }
    10% {
      transform: translateX(0);
      opacity: 1;
    }
    90% {
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      transform: translateX(-40%);
      opacity: 0;
    }
  }
  </style>
  