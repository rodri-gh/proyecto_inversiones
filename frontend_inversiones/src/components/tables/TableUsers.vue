<template>
  <div class="table-responsive">
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="paginatedItems.length === 0">
          <td colspan="9" class="text-center">No hay usuarios registrados</td>
        </tr>
        <tr v-for="item in paginatedItems" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.lastName }}</td>
          <td>{{ item.documentNumber }}</td>
          <td>{{ item.account.username }}</td>
          <td v-if="item.role === 'super_user'">Super usuario</td>
          <td v-if="item.role === 'admin'">Administrador</td>
          <td v-if="item.role === 'client'">Cliente</td>
          <td>{{ item.email }}</td>
          <td>{{ item.phone }}</td>
          <td>
            <span v-if="item.deleted == 0" class="badge bg-success"
              >Activo</span
            >
            <span v-else class="badge bg-danger">Inactivo</span>
          </td>
          <td>
            <Button
              @click="() => actions.edit(item)"
              icon="fa fa-edit"
              buttonClass="btn-edit btn-sm m-1"
            />
            <Button
              @click="() => actions.delete(item.id)"
              :icon="item.deleted ? 'fa fa-check' : 'fa fa-trash'"
              :buttonClass="`btn-${
                item.deleted ? 'restore' : 'delete'
              } btn-sm m-1`"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación -->
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


