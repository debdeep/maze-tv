<script setup>
import { ref, onMounted, computed } from 'vue';
import { Api } from '../utils/ApiConstants.js';
import { AppConfig } from '../utils/config.js';
import ShowCard from './ShowCard.vue';
import SearchBar from './SearchBar.vue';

const shows = ref([]);
const searchQuery = ref('');

onMounted(async () => {
    await getShowList();
})

async function getShowList() {
    const response = await fetch(Api.showList);
    const data = await response.json();
    shows.value = data;
}
const filteredShows = computed(() => {
    if (!searchQuery.value || searchQuery.value.length <= AppConfig.searchMinLength) {
        return shows.value;
    }
    return shows.value.filter(show => show.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});
const handleSearch = (query) => {
    searchQuery.value = query;
};
</script>

<template>
    <SearchBar @search="handleSearch" />
    <div class="list-container">
        <ShowCard v-for="show in filteredShows" :key="show.id" :show="show" />
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