<template>
  <div :class="['mb-3', selectClass]">
    <label :for="id" class="form-label">{{ label }}</label>
    <select
      :id="id"
      class="form-select"
      :value="modelValue"
      @change="updateValue"
    >
      <option :value="defaultOptionValue" disabled>
        {{ defaultOptionText }}
      </option>
      <option v-if="options.length == 0" value="">{{ emptyMessage }}</option>
      <option
        v-for="option in options"
        :key="option[valueKey]"
        :value="option[valueKey]"
      >
        {{ option[labelKey] }}
      </option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [String, Number], required: true },
  options: { type: Array, required: true },
  label: { type: String, default: "Selecciona una opción" },
  valueKey: { type: String, required: true },
  labelKey: { type: String, required: true },
  defaultOptionText: { type: String, default: "Seleccione una opción" },
  defaultOptionValue: { type: [String, Number], default: "" },
  id: { type: String, default: "customSelect" },
  selectClass: { type: String, default: "" },
  emptyMessage: { type: String, default: "No hay opciones disponibles" },
});

const emit = defineEmits(["update:modelValue"]);

const updateValue = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>
