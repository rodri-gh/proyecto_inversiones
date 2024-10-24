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
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="$emit('onClose')"
          >
            {{ cancelText }}
          </button>
          <button
            v-if="showSaveButton"
            type="button"
            class="btn btn-primary"
            @click="$emit('onSave')"
          >
            {{ saveText }}
          </button>
          <button
            v-if="showUpdateButton"
            type="button"
            class="btn btn-primary"
            @click="$emit('onUpdate')"
          >
            {{ updateText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
  saveText: {
    type: String,
    default: "Guardar",
  },
  updateText: {
    type: String,
    default: "Actualizar",
  },
  cancelText: {
    type: String,
    default: "Cancelar",
  },
});

defineEmits(["onClose", "onSave", "onUpdate"]);
</script>