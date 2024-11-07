<template>
  <div>
    <label :for="id" class="form-label m-0">{{ label }}</label>
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
<style scoped>
textarea {
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 50px;
  outline: none;
}
</style>
