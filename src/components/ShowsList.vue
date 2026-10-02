<script setup>
import { ref, onMounted, computed } from 'vue';
import { Api } from '../utils/ApiConstants.js';
import { AppConfig } from '../utils/config.js';
import ShowCard from './ShowCard.vue';
import SearchBar from './SearchBar.vue';
import TopRestaurantsToggle from './TopRestaurantsToggle.vue';

const shows = ref([]);
const searchQuery = ref('');
const showTopRestaurants = ref(false);

onMounted(async () => {
    await getShowList();
})

async function getShowList() {
    const response = await fetch(Api.showList);
    const data = await response.json();
    shows.value = data;
}
const filteredShows = computed(() => {
    // filter when switcher is enabled
    if (showTopRestaurants.value) {
        searchQuery.value = "";
        return shows.value.filter(
            show => show?.rating?.average >= AppConfig.restaurantRatingsBenchMark
        );
    }

    // filter by search query
    if (searchQuery.value && searchQuery.value.length > AppConfig.searchMinLength) {
        return shows.value.filter(show =>
            show.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    }

    // Default show all
    return shows.value;
});
const handleSearch = (query) => {
    searchQuery.value = query;
};
const handleToggle = (isChecked) => {
    //console.log('Top Restaurants Toggle:', isChecked);
    showTopRestaurants.value = isChecked;
};

</script>

<template>
    <SearchBar @search="handleSearch" />
    <TopRestaurantsToggle @toggle="handleToggle" />
    <div v-if="filteredShows.length === 0" class="no-results">
        <p>No shows found.</p>
    </div>
    <div v-else class="list-container">
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