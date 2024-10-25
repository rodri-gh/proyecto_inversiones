<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      type="file"
      :id="id"
      @change="handleFileChange"
      class="form-control"
      :accept="accept"
    />
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  id: { type: String, required: true },
  accept: { type: String, default: "image/*" },
});

const emit = defineEmits(["update:modelValue"]);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  emit("update:modelValue", file);
};
</script>
