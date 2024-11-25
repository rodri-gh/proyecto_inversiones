<template>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="items.length == 0">
          <td colspan="5" class="text-center">No hay Proyectos registrados</td>
        </tr>
        <tr v-for="item in paginatedItems" :key="item.id">
          <td>{{ formatDate(item.startDate) }}</td>
          <td>{{ formatDate(item.endDate) }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.investmentGoal }}</td>
          <td>{{ item.profitPercentage }}</td>
          <td v-if="item.deleted == 0">No</td>
          <td v-else>Si</td>
          <td>
            <span v-if="item.status === 'open'" class="badge bg-success"
              >Abierto</span
            >
            <span v-else class="badge bg-danger">Cerrado</span>
          </td>
          <td>
            <Button
              @click="() => actions.edit(item)"
              icon="fa fa-edit"
              buttonClass="btn-warning btn-sm m-1"
            />
            <Button
              v-if="item.deleted == 1"
              @click="() => actions.delete(item.id)"
              :icon="item.deleted ? 'fa fa-check' : 'fa fa-trash'"
              :buttonClass="`btn-${
                item.deleted ? 'restore' : 'delete'
              } btn-sm m-1`"
            />
            <Button
              v-if="item.deleted == 0"
              @click="() => actions.delete(item.id)"
              :icon="item.deleted ? 'fa fa-check' : 'fa fa-trash'"
              :buttonClass="`btn-${
                item.deleted ? 'restore' : 'delete'
              } btn-sm m-1`"
            />
            <Button
              @click="() => actions.view(item)"
              buttonClass="btn btn-secondary btn-sm m-1"
              icon="fa fa-eye"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <nav
      aria-label="Page navigation"
      class="d-flex justify-content-center mt-3"
    >
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a
            class="page-link"
            href="#"
            @click.prevent="changePage(currentPage - 1)"
            >Anterior</a
          >
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: page === currentPage }"
        >
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{
            page
          }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a
            class="page-link"
            href="#"
            @click.prevent="changePage(currentPage + 1)"
            >Siguiente</a
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import Button from "@/components/base/Button.vue";
import { formatDate } from "@/router/viewFormat";

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  actions: {
    type: Object,
    required: true,
  },
});

const itemsPerPage = 10;
const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(props.items.length / itemsPerPage));

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return props.items.slice(start, end);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
</script>

<style scoped>
.pagination .page-link {
  color: var(--primary-color);
}

.pagination .page-item.active .page-link {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
}
</style>