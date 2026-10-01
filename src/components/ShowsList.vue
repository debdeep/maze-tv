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
    <ShowCard v-for="show in shows" :key="show.id" :show="show" />
</template>
<style scoped></style>