<template>
  <div
    class="modal fade"
    :id="modalId"
    tabindex="-1"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    role="dialog"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-scrollable modal-dialog-centered"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="$emit('onClose')"
          ></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <Button
            text="Cancelar"
            buttonClass="btn-secondary"
            @click="$emit('onClose')"
            data-bs-dismiss="modal"
          />

          <Button
            v-if="showSaveButton"
            text="Guardar"
            buttonClass="btn-primary"
            @click="$emit('onSave')"
          />

          <Button
            v-if="showUpdateButton"
            text="Actualizar"
            buttonClass="btn-primary"
            @click="$emit('onSave')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "@/components/base/Button.vue";

defineProps({
  modalId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  showSaveButton: {
    type: Boolean,
    default: false,
  },
  showUpdateButton: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["onClose", "onSave"]);
</script>