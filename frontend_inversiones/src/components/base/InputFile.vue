<template>
  <div>
    <label :for="id" class="form-label m-0">{{ label }}</label>
    <input
      type="file"
      :id="id"
      @change="handleFileChange"
      class="form-control m-0"
      :accept="accept"
      ref="fileInput"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  label: { type: String, required: true },
  id: { type: String, required: true },
  accept: { type: String, default: "image/*" },
});

const emit = defineEmits(["update:modelValue"]);
const fileInput = ref(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  emit("update:modelValue", file);
};
defineExpose({
  reset: () => {
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  },
});
</script>
