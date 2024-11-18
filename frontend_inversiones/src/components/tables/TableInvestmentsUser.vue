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
          <td colspan="9" class="text-center">
            No hay inversiones registradas
          </td>
        </tr>
        <tr v-for="item in paginatedItems" :key="item.id">
          <td>{{ formatDate(item.investmentDate) }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.currency }}</td>
          <td>{{ item.profitPercentage }}%</td>
          <td v-if="item.status === 'active'">Activa</td>
          <td v-else-if="item.status === 'pending'">Pendiente</td>
          <td v-else>Cerrada</td>
          <td>
            <span v-if="item.status === 'closed'"
              >{{ item.earnings }} {{ item.currency }}</span
            >
            <span v-else>Pendiente</span>
          </td>
          <td>
            <Button
              @click="actions.view(item)"
              variant="primary"
              size="sm"
              text="Ver contrato"
            />
          </td>
        </tr>

        <tr v-if="showTotal" class="table-info">
          <td colspan="1"><strong>Total Inversiones</strong></td>
          <td colspan="3">
            <strong>{{ calculateTotal }}</strong>
          </td>
          <td colspan="1"><strong>Total Ganancias</strong></td>
          <td>
            <strong>{{ calculateTotalEarnings }}</strong>
          </td>
          <td></td>
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
  showTotal: {
    type: Boolean,
    default: false,
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

const calculateTotal = computed(() => {
  const total = props.items.reduce(
    (sum, item) => sum + parseFloat(item.amount),
    0
  );
  return total.toFixed(2);
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const calculateTotalEarnings = computed(() => {
  const totalEarnings = props.items.reduce(
    (sum, item) =>
      sum + (item.status === "closed" ? parseFloat(item.earnings) : 0),
    0
  );
  return totalEarnings.toFixed(2);
});
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