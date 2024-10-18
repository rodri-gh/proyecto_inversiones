<template>
  <div>
    <h3>Detalles del proyecto</h3>
    <h5><strong>Nombre:</strong> {{ project.name }}</h5>
    <p><strong>Descripcion:</strong> {{ project.description }}</p>
    <p v-if="project.status == 'open'"><strong>Estado:</strong> Abierto</p>
    <p v-else-if="project.status == 'closed'">
      <strong>Estado:</strong> Cerrado
    </p>
    <p v-else><strong>Estado:</strong> En curso</p>
    <p><strong>Meta de recaudacion:</strong> {{ project.investment_goal }}</p>
    <p>
      <strong>Porcentaje de ganancia:</strong> {{ project.profit_percentage }}
    </p>
    <p><strong>Fecha de creacion:</strong> {{ project.created_at }}</p>
    <h1>
      Esto no es un diseño, pero ya aqui pueden usar el id de proyecto para
      crear gastos operativos, asignar minerales al proyecto, etc, clientes,
      contratos, inversiones, todo lo que tiene que ver con proyectos desde la
      vista del admin
    </h1>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const idProject = route.params.id;

const project = ref({});
const urlProject = "http://localhost:3000/projects/";

onMounted(() => {
  getProject();
  console.log(idProject);
});

const getProject = async () => {
  try {
    const { data } = await axios.get(urlProject + idProject);
    project.value = data.data;
    console.log(project.value);
  } catch (error) {
    console.error(error);
  }
};
</script>

<style  scoped>
</style>