<script setup>
import InvestmentsOfUser from '@/components/InvestmentsOfUser.vue';
import Contacts from '@/components/Contacts.vue';
const username = JSON.parse(localStorage.getItem('user'))?.username;
</script>

<template>
  <div class="m-5 text-center">
    <main>
      <br>
      <h2>Hola {{ username }}</h2>
      <br>
      <h5>estas son tus inversiones</h5>
      <br>
      <InvestmentsOfUser />
      <Contacts/>
    </main>

  </div>
</template>
