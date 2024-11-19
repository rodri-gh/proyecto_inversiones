<template>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="items.length === 0">
          <td :colspan="headers.length" class="text-center">
            No hay solicitudes de retiro
          </td>
        </tr>
        <tr v-for="item in paginatedItems" :key="item.id">
          <td>{{ item.investment.project.name }}</td>
          <td>{{ item.user.name }}</td>
          <td>
            {{
              parseFloat(item.investment.amount) +
              parseFloat(item.investment.earnings)
            }}
          </td>
          <td>{{ formatDate(item.requestDate) }}</td>
          <td>{{ item.approvalDate ? formatDate(item.approvalDate) : "-" }}</td>
          <td>
            <span :class="getStatusBadgeClass(item.status)">
              {{ getStatusText(item.status) }}
            </span>
          </td>
          <td>
            <button
              v-if="item.status === 'pending'"
              class="btn btn-success btn-sm m-1"
              @click="() => actions.approve(item.id)"
            >
              <i class="fa fa-check"></i>
            </button>
            <button
              v-if="item.status === 'pending'"
              class="btn btn-danger btn-sm m-1"
              @click="() => actions.reject(item.id)"
            >
              <i class="fa fa-times"></i>
            </button>
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

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: "badge bg-warning",
    approved: "badge bg-success",
    rejected: "badge bg-danger",
  };
  return classes[status] || "badge bg-secondary";
};

const getStatusText = (status) => {
  const texts = {
    pending: "Pendiente",
    approved: "Aprobado",
    rejected: "Rechazado",
  };
  return texts[status] || status;
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