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
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.investment.project.name }}</td>

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
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
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