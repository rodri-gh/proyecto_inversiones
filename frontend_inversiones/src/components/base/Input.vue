<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      :type="type"
      :id="id"
      :value="modelValue"
      @input="updateValue"
      class="form-control"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], required: true },
  label: { type: String, required: true },
  id: { type: String, required: true },
  placeholder: { type: String, default: "" },
  type: { type: String, default: "text" },
});

const emit = defineEmits(["update:modelValue"]);
const updateValue = (event) => {
  const value =
    event.target.type === "number"
      ? Number(event.target.value) || ""
      : event.target.value;
  emit("update:modelValue", value);
};
</script>
