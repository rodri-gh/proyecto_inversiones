<template>
  <div>
    <div class="navbar-tabs">
      <button v-for="tab in tabs" :key="tab" @click="selectedTab = tab" :class="{ active: selectedTab === tab }">
        {{ tab }}
      </button>
    </div>

    <div class="tab-content mt-3">
      <div v-if="selectedTab === 'Retiro Solicitudes'">
        <WithdrawalRequestsView />
      </div>
      <div v-if="selectedTab === 'Contacto Solicitudes'">
        <ContactView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import WithdrawalRequestsView from "@/views/WithdrawalRequestsView.vue";
import ContactView from "@/views/ContactView.vue";

const selectedTab = ref('Retiro Solicitudes');
const tabs = ['Retiro Solicitudes',
  'Contacto Solicitudes'];


onMounted(() => {
});


</script>

<style scoped>
.navbar-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  border-radius: 30px;
}

.navbar-tabs button {
  padding: 10px 20px;
  border: none;
  border-radius: 30px !important;
  background-color: #ffffff;
  cursor: pointer;
  border-radius: 5px;
}

.navbar-tabs button.active {
  background-color: #006d72;
  border-radius: 30px;
  color: white;
}

.navbar-tabs button:hover {
  background-color: #82afb8;
  color: #04090e;
  border-radius: 10px;
}

.tab-content {
  padding: 10px;
  border-radius: 5px;
}
</style>