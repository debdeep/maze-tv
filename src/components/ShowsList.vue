<script setup>
import { ref, onMounted, computed } from 'vue';
import { Api } from '../utils/ApiConstants.js';
import { AppConfig } from '../utils/config.js';
import ShowCard from './ShowCard.vue';
import SearchBar from './SearchBar.vue';
import Pagination from './Pagination.vue';
import TopRestaurantsToggle from './TopRestaurantsToggle.vue';

const shows = ref([]);
const searchQuery = ref('');
const showTopRestaurants = ref(false);
const page = ref(0);
const hasNextPage = ref(true);
const loading = ref(false);
const loadError = ref('');
const searchBar = ref(null);

onMounted(async () => {
    await getShowList(0);
})

async function getShowList(targetPage = page.value) {
    if (loading.value) return;

    const shouldFocusSearch = targetPage !== page.value;
    loading.value = true;
    loadError.value = '';

    try {
        const response = await fetch(Api.showList(targetPage));
        if (response.status === 404 && targetPage > 0) {
            hasNextPage.value = false;
            return;
        }
        if (!response.ok) {
            throw new Error('Show list request failed');
        }

        const data = await response.json();
        shows.value = data;
        page.value = targetPage;
        hasNextPage.value = data.length > 0;
        if (shouldFocusSearch) {
            searchBar.value?.focus();
        }
    } catch {
        loadError.value = 'Unable to load shows. Check your connection and try again.';
    } finally {
        loading.value = false;
    }
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
    <SearchBar ref="searchBar" @search="handleSearch" />
    <TopRestaurantsToggle @toggle="handleToggle" />
    <p v-if="loading && shows.length === 0" class="list-message" role="status">
        Loading shows...
    </p>
    <p v-if="loadError" class="list-message" role="alert">
        {{ loadError }}
        <button type="button" @click="getShowList(page)">Retry</button>
    </p>
    <p v-if="loading && shows.length > 0" class="list-message" role="status">
        Loading page {{ page + 2 }}...
    </p>
    <div v-if="filteredShows.length > 0" class="list-container">
        <ShowCard v-for="show in filteredShows" :key="show.id" :show="show" />
    </div>
    <p v-else-if="!loading && !loadError" class="no-results">
        No shows found.
    </p>
    <Pagination v-if="shows.length > 0" :page="page" :has-next-page="hasNextPage" :loading="loading"
        @change="getShowList" />
</template>
<style scoped>
.list-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1.25rem;
    background-color: #f1f7f4;
}

@media (max-width: 600px) {
    .list-container {
        gap: 0.75rem;
        padding: 1rem;
    }

    .list-container :deep(.show-card) {
        flex-basis: 100%;
    }
}
</style>