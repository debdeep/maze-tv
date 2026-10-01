<script setup>
import { ref, onMounted } from 'vue';
import { Api } from '../utils/ApiConstants.js';

const shows = ref([]);

onMounted(async () => {
    await getShowList();
})

async function getShowList() {
    console.log("Fetching show list from API...", Api);
    const response = await fetch(Api.showList);
    const data = await response.json();
    shows.value = data;
}

</script>

<template>
    <h1>Dashboard Route</h1>
    <div v-for="show in shows" :key="show.id">
        <h2>{{ show.name }}</h2>
        <p v-html="show.summary"></p>
    </div>
</template>