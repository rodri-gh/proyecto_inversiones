

<template>
<div>
    <h1>Contacto</h1>
    <div>
        <label for="nombre">Nombre *</label>
        <input type="text" id="nombre" required />
    </div>
    <div>
        <label for="apellido">Apellido *</label>
        <input type="text" id="apellido" required />
    </div>
    <div>
        <label for="email">Email *</label>
        <input type="email" id="email" required />
    </div>
    <div>
        <label for="telefono">Teléfono</label>
        <input type="tel" id="telefono" />
    </div>
</div>
</template>

<script>
export default {
name: "Contacto",
};
</script>

<style>
</style>


