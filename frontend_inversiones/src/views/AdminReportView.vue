<template>
  <div class="container col-md-11 mt-5">
    <div>
      <h4 class="card-title text-center mb-2">Reportes Administrador</h4>

      <ul class="nav nav-tabs" id="userTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="all-tab"
            data-bs-toggle="tab"
            data-bs-target="#all"
            type="button"
            role="tab"
            aria-controls="all"
            aria-selected="true"
          >
            Proyectos
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="active-tab"
            data-bs-toggle="tab"
            data-bs-target="#active"
            type="button"
            role="tab"
            aria-controls="active"
            aria-selected="false"
          >
            Inversiones
          </button>
        </li>
        <!--   <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="inactive-tab"
            data-bs-toggle="tab"
            data-bs-target="#inactive"
            type="button"
            role="tab"
            aria-controls="inactive"
            aria-selected="false"
          >
            Otro Reporte
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="clients-tab"
            data-bs-toggle="tab"
            data-bs-target="#clients"
            type="button"
            role="tab"
            aria-controls="clients"
            aria-selected="false"
          >
            Otro Reporte
          </button>
        </li> -->
      </ul>
      <div class="tab-content" id="userTabsContent">
        <div
          class="tab-pane fade show active"
          id="all"
          role="tabpanel"
          aria-labelledby="all-tab"
        >
          <ProjectReportAdmin />
        </div>
        <div
          class="tab-pane fade"
          id="active"
          role="tabpanel"
          aria-labelledby="active-tab"
        >
          <InvestmentReportAdminView />
        </div>
        <div
          class="tab-pane fade"
          id="inactive"
          role="tabpanel"
          aria-labelledby="inactive-tab"
        >
          <TableProjects
            :headers="headers"
            :items="inactiveUsers"
            :actions="{
              edit: selectProject,
              delete: deleteProject,
              view: showProjectDetails,
            }"
          />
        </div>

        <div
          class="tab-pane fade"
          id="clients"
          role="tabpanel"
          aria-labelledby="clients-tab"
        >
          <TableProjects
            :headers="headers"
            :items="clientUsers"
            :actions="{
              edit: selectProject,
              delete: deleteProject,
              view: showProjectDetails,
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProjectReportAdmin from "./ProjectReportAdmin.vue";
import InvestmentReportAdminView from "./InvestmentReportAdminView.vue";
</script>

<style scoped>
.nav-tabs .nav-link {
  color: #495057;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-bottom-color: transparent;
}
.nav-link {
  border-radius: 0;
}
.nav-tabs .nav-link.active {
  color: white;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.tab-content > .tab-pane {
  display: none;
}

.tab-content > .active {
  display: block;
}
</style>