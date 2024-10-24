<template>
    <!-- Un botón o cualquier evento que dispare el SweetAlert -->
    <button @click="showAlert">Mostrar Alerta</button>
</template>

<script>
import Swal from "sweetalert2";

export default {
    name: "SweetAlert",
    props: {
        title: {
            type: String,
            default: "¡Alerta!",
        },
        text: {
            type: String,
            default: "Esta es una alerta.",
        },
        icon: {
            type: String,
            default: "warning", // warning, success, error, info
        },
        confirmButtonText: {
            type: String,
            default: "Ok",
        },
        showCancelButton: {
            type: Boolean,
            default: false,
        },
        cancelButtonText: {
            type: String,
            default: "Cancelar",
        },
    },
    methods: {
        showAlert() {
            Swal.fire({
                title: this.title,
                text: this.text,
                icon: this.icon,
                showCancelButton: this.showCancelButton,
                confirmButtonText: this.confirmButtonText,
                cancelButtonText: this.cancelButtonText,
            }).then((result) => {
                // Aquí puedes manejar el resultado de la alerta, como confirmaciones
                if (result.isConfirmed) {
                    this.$emit("confirmed");
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    this.$emit("cancelled");
                }
            });
        },
    },
};
</script>