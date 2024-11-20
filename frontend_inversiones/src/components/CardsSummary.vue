<script setup>


defineProps({
  items: {
    type: Array,
    required: true,
  }
});

</script>

<template>
    <div>
        <div class="row justify-content-center my-3">
            <div v-for="item in items" :key="item" class="col-md-3">
                <div class="card border-warning p-2 shadow">
                    <h5 class="text-secondary">{{ item.key }}</h5>
                    <p class="amount-info text-right">{{ item.value }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card { 
    border-radius: 15px;
}
</style>