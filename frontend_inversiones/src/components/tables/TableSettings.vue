<template>
  <table class="table table-striped">
    <thead>
      <tr>
        <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(value, key) in filteredItems" :key="key">
        <td>{{ getFieldLabel(key) }}</td>
        <td v-if="isImageField(key)">
          <img
            :src="value"
            :alt="getFieldLabel(key)"
            height="60px"
            width="60px"
            class="img-fluid rounded-1"
          />
        </td>
        <td v-else>{{ value }}</td>
        <td>
          <Button
            @click="() => actions.edit(key)"
            icon="fa fa-edit"
            buttonClass="btn-edit btn-sm m-1"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { computed } from "vue";
import Button from "@/components/base/Button.vue";

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Object,
    required: true,
  },
  actions: {
    type: Object,
    required: true,
  },
});

const filteredItems = computed(() => {
  const { id, ...rest } = props.items;
  return rest;
});

const getFieldLabel = (key) => {
  const labels = {
    logo: "Logo",
    name: "Nombre de la página",
    homeTitle: "Título de Inicio",
    homeText: "Texto de Inicio",
    aboutTitle: "Título Sobre Nosotros",
    aboutText: "Texto Sobre Nosotros",
    aboutImage: "Imagen Sobre Nosotros",
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    x: "X",
    phone: "Teléfono",
    whatsapp: "WhatsApp",
    email: "Email",
    address: "Dirección",
    businessHours: "Horario de Atención",
    dataPolicyLink: "Política de Datos",
    termsConditionsLink: "Términos y Condiciones",
  };
  return labels[key] || key;
};

const isImageField = (key) => {
  return key === "logo" || key === "aboutImage";
};
</script>