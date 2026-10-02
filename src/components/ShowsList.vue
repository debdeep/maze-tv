<script setup>
import { ref, onMounted } from 'vue';
import { Api } from '../utils/ApiConstants.js';
import ShowCard from './ShowCard.vue';
const shows = ref([]);

onMounted(async () => {
    await getShowList();
})

async function getShowList() {
    const response = await fetch(Api.showList);
    const data = await response.json();
    shows.value = data;
}

</script>

<template>
    <div class="list-container">
        <ShowCard v-for="show in shows" :key="show.id" :show="show" />
    </div>
</template>
<style scoped>
.list-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1.25rem;
    background-color: #f1f7f4;
}
</style>