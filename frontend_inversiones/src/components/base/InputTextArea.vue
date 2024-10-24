<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <textarea
      :id="id"
      :value="modelValue"
      @input="updateValue"
      class="form-control"
      :placeholder="placeholder"
      :rows="rows"
    ></textarea>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, required: true },
  label: { type: String, required: true },
  id: { type: String, required: true },
  placeholder: { type: String, default: "" },
  rows: { type: Number, default: 3 },
});

const emit = defineEmits(["update:modelValue"]);

const updateValue = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>
