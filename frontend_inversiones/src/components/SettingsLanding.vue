<template>
  <div class="container col-md-10 mt-5">
    <h4 class="card-title text-center mb-3">Ajustes de la Web</h4>
    <TableSettings
      :headers="headers"
      :items="settings"
      :actions="{
        edit: selectSetting,
      }"
    />

    <Modal
      modalId="modalSetting"
      title="Editar Ajustes de la Web"
      modalClass="modal-lg"
      :showSaveButton="false"
      :showUpdateButton="true"
      @onClose="reset()"
      @onSave="updateSettings()"
    >
      <template v-if="selectedField === 'appCommission'">
        <Input
          id="appCommission"
          label="Comision Para la App en %"
          v-model="tempSettings.appCommission"
          type="number"
          placeholder="Ingrese la comision"
        />
      </template>
      <template v-if="selectedField === 'name'">
        <Input
          id="name"
          label="Nombre"
          v-model="tempSettings.name"
          type="text"
          placeholder="Ingrese el nombre"
        />
      </template>
      <template v-if="selectedField === 'homeTitle'">
        <Input
          id="homeTitle"
          label="Título de Inicio"
          v-model="tempSettings.homeTitle"
          type="text"
          placeholder="Ingrese el título de inicio"
        />
      </template>
      <template v-if="selectedField === 'homeText'">
        <InputTextArea
          id="homeText"
          label="Texto de Inicio"
          v-model="tempSettings.homeText"
          placeholder="Ingrese el texto de inicio"
          rows="20"
        />
      </template>
      <template v-if="selectedField === 'logo'">
        <InputFile
          id="logo"
          label="Logo"
          @update:modelValue="handleLogoChange"
          accept="image/*"
          ref="inputFileRef"
        />
        <div v-if="previewLogoUrl" class="mt-3">
          <img
            :src="previewLogoUrl"
            alt="Vista_previa_logo"
            class="img-fluid"
          />
        </div>
      </template>
      <template v-if="selectedField === 'aboutTitle'">
        <Input
          id="aboutTitle"
          label="Título Sobre Nosotros"
          v-model="tempSettings.aboutTitle"
          type="text"
          placeholder="Ingrese el título sobre nosotros"
        />
      </template>
      <template v-if="selectedField === 'aboutText'">
        <InputTextArea
          id="aboutText"
          label="Texto Sobre Nosotros"
          v-model="tempSettings.aboutText"
          placeholder="Ingrese el texto sobre nosotros"
        />
      </template>
      <template v-if="selectedField === 'aboutImage'">
        <InputFile
          id="aboutImage"
          label="Imagen Sobre Nosotros"
          @update:modelValue="handleAboutImageChange"
          accept="image/*"
          ref="inputFileRef"
        />
        <div v-if="previewAboutImageUrl" class="mt-3">
          <img
            :src="previewAboutImageUrl"
            alt="Vista_previa_aboutImage"
            class="img-fluid"
          />
        </div>
      </template>
      <template v-if="selectedField === 'facebook'">
        <Input
          id="facebook"
          label="Facebook"
          v-model="tempSettings.facebook"
          type="text"
          placeholder="Ingrese el link de Facebook"
        />
      </template>
      <template v-if="selectedField === 'instagram'">
        <Input
          id="instagram"
          label="Instagram"
          v-model="tempSettings.instagram"
          type="text"
          placeholder="Ingrese el link de Instagram"
        />
      </template>
      <template v-if="selectedField === 'tiktok'">
        <Input
          id="tiktok"
          label="TikTok"
          v-model="tempSettings.tiktok"
          type="text"
          placeholder="Ingrese el link de TikTok"
        />
      </template>
      <template v-if="selectedField === 'x'">
        <Input
          id="x"
          label="X"
          v-model="tempSettings.x"
          type="text"
          placeholder="Ingrese el link de X"
        />
      </template>
      <template v-if="selectedField === 'phone'">
        <Input
          id="phone"
          label="Teléfono"
          v-model="tempSettings.phone"
          type="text"
          placeholder="Ingrese el teléfono"
        />
      </template>
      <template v-if="selectedField === 'whatsapp'">
        <Input
          id="whatsapp"
          label="WhatsApp"
          v-model="tempSettings.whatsapp"
          type="text"
          placeholder="Ingrese el WhatsApp"
        />
      </template>
      <template v-if="selectedField === 'email'">
        <Input
          id="email"
          label="Email"
          v-model="tempSettings.email"
          type="text"
          placeholder="Ingrese el email"
        />
      </template>
      <template v-if="selectedField === 'address'">
        <Input
          id="address"
          label="Dirección"
          v-model="tempSettings.address"
          type="text"
          placeholder="Ingrese la dirección"
        />
      </template>
      <template v-if="selectedField === 'businessHours'">
        <Input
          id="businessHours"
          label="Horario de Atención"
          v-model="tempSettings.businessHours"
          type="text"
          placeholder="Ingrese el horario de atención"
        />
      </template>
      <template v-if="selectedField === 'dataPolicyLink'">
        <Input
          id="dataPolicyLink"
          label="Política de Datos"
          v-model="tempSettings.dataPolicyLink"
          type="text"
          placeholder="Ingrese el link de política de datos"
        />
      </template>
      <template v-if="selectedField === 'termsConditionsLink'">
        <Input
          id="termsConditionsLink"
          label="Términos y Condiciones"
          v-model="tempSettings.termsConditionsLink"
          type="text"
          placeholder="Ingrese el link de términos y condiciones"
        />
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import TableSettings from "@/components/tables/TableSettings.vue";
import Modal from "@/components/base/Modal.vue";
import Input from "@/components/base/Input.vue";
import InputTextArea from "@/components/base/InputTextArea.vue";
import InputFile from "@/components/base/InputFile.vue";
import { openModal, closeModal } from "@/utils/modal";

const headers = ["Campo", "Valor", "Acciones"];

const baseURL = `${import.meta.env.VITE_API_URL}/site-setting`;

const settings = ref({});
const tempSettings = ref({});
const previewLogoUrl = ref(null);
const previewAboutImageUrl = ref(null);
const inputFileRef = ref(null);
const selectedField = ref(null);

onMounted(() => {
  getSettings();
});

const getSettings = async () => {
  try {
    const response = await axios.get(baseURL);
    settings.value = response.data[0];
    tempSettings.value = { ...settings.value };
    if (settings.value.logo) {
      previewLogoUrl.value = settings.value.logo;
    }
    if (settings.value.aboutImage) {
      previewAboutImageUrl.value = settings.value.aboutImage;
    }
  } catch (error) {
    console.error(error);
  }
};

const handleLogoChange = (file) => {
  tempSettings.value.logo = file;
  if (file) {
    previewLogoUrl.value = URL.createObjectURL(file);
  } else {
    previewLogoUrl.value = null;
  }
};

const handleAboutImageChange = (file) => {
  tempSettings.value.aboutImage = file;
  if (file) {
    previewAboutImageUrl.value = URL.createObjectURL(file);
  } else {
    previewAboutImageUrl.value = null;
  }
};

const selectSetting = (field) => {
  selectedField.value = field;
  tempSettings.value = { ...settings.value };
  openModal("modalSetting");
};
const updateSettings = async () => {
  const formData = new FormData();

  if (
    selectedField.value === "logo" &&
    tempSettings.value.logo instanceof File
  ) {
    formData.append("logo", tempSettings.value.logo);
  } else if (
    selectedField.value === "aboutImage" &&
    tempSettings.value.aboutImage instanceof File
  ) {
    formData.append("about_image", tempSettings.value.aboutImage);
  } else {
    const fieldName =
      selectedField.value === "aboutImage"
        ? "about_image"
        : selectedField.value;
    formData.append(fieldName, tempSettings.value[selectedField.value]);
  }

  try {
    await axios.put(`${baseURL}/${settings.value.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await getSettings();
    closeModal("modalSetting");
  } catch (error) {
    console.error(error);
  }
};
const reset = () => {
  previewLogoUrl.value = settings.value.logo;
  previewAboutImageUrl.value = settings.value.aboutImage;
  inputFileRef.value?.reset();
};
</script>

<style scoped>
.container {
  max-height: 800px;
  overflow-y: auto;
  margin-top: 20px;
}
</style>