<template>
  <div class="text-end">
    <button
      :class="['btn', buttonClass]"
      v-bind="$attrs"
      @click="$emit('click')"
    >
      <i v-if="icon" :class="icon + ' me-1'"></i>
      <span :class="textClass">{{ text }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, required: false },
  buttonClass: { type: String, default: "btn-primary" },
  icon: { type: String, default: "" },
  textClass: { type: String, default: "" },
});

defineEmits(["click"]);
</script>