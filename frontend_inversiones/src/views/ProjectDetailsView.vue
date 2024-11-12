<template>
  <div >
    <div class="d-flex flex-column ">

      <div class="m-5">
        <h3>Linea de tiempo Del proyecto</h3>
        <TimeLine :idProject="idProject" />
      </div>

      <div class="m-5">
        <h3>Contratos del Poyecto</h3>
        <Contract :idProject="idProject"/>
      </div>

      <div class="m-5">
        <h3>Minerales del proyecto</h3>
        <ProjectMineral :idProjectMineral="idProject" />
      </div>

      <div class="m-5">
        <h3>Inversiones del Proyecto</h3>
        <Investments :idProjectInvestment="idProject" />
      </div>

      <div class="m-5">
        <h3>Gastos Operativos del Proyecto</h3>
        <OperatingExpenses :idProject="idProject" />
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import TimeLine from "@/components/TimeLine.vue";
import ProjectMineral from "@/components/ProjectMineral.vue";
import OperatingExpenses from "@/components/OperatingExpenses.vue";
import Investments from "@/components/Investments.vue";
import Contract from "@/components/Contract.vue";

const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  },
});
const idProject = ref(props.projectId || route.params.id);
</script>

<style  scoped>
</style>