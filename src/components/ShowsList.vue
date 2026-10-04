<script setup>
import { ref, onMounted, computed } from 'vue';
import { Api } from '../utils/ApiConstants.js';
import { AppConfig } from '../utils/config.js';
import { groupShowsByGenre } from '../utils/groupShowsByGenre.js';
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
const loadingPage = ref(null);
const loadError = ref(false);
const searchBar = ref(null);

onMounted(async () => {
    await getShowList(0);
})

async function getShowList(targetPage = page.value) {
    if (loading.value) return;

    const shouldFocusSearch = targetPage !== page.value;
    loading.value = true;
    loadingPage.value = targetPage;
    loadError.value = false;

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
        loadError.value = true;
    } finally {
        loading.value = false;
        loadingPage.value = null;
    }
}
const filteredShows = computed(() => {
    // filter when switcher is enabled
    if (showTopRestaurants.value) {
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
const genreGroups = computed(() => groupShowsByGenre(filteredShows.value));
const handleSearch = (query) => {
    searchQuery.value = query;
};
const handleToggle = (isChecked) => {
    showTopRestaurants.value = isChecked;
    if (isChecked) {
        searchQuery.value = '';
        searchBar.value?.clear();
    }
};

</script>

<template>
    <SearchBar ref="searchBar" @search="handleSearch" />
    <TopRestaurantsToggle @toggle="handleToggle" />
    <p v-if="loading && shows.length === 0" class="list-message" role="status">
        {{ $t('showsList.loading') }}
    </p>
    <p v-if="loadError" class="list-message" role="alert">
        {{ $t('showsList.loadError') }}
        <button type="button" @click="getShowList(page)">{{ $t('showsList.retry') }}</button>
    </p>
    <p v-if="loading && shows.length > 0" class="list-message" role="status">
        {{ $t('showsList.loadingPage', { page: loadingPage + 1 }) }}
    </p>
    <div v-if="genreGroups.length > 0" class="genre-groups">
        <section v-for="group in genreGroups" :key="group.genre ?? 'other'" class="genre-group">
            <h2>{{ group.genre || $t('showsList.otherGenre') }}</h2>
            <div class="genre-row">
                <ShowCard v-for="show in group.shows" :key="show.id" :show="show" />
            </div>
        </section>
    </div>
    <p v-else-if="!loading && !loadError" class="no-results">
        {{ $t('showsList.noResults') }}
    </p>
    <Pagination v-if="shows.length > 0" :page="page" :has-next-page="hasNextPage" :loading="loading"
        @change="getShowList" />
</template>
<style scoped>
.genre-group+.genre-group {
    margin-top: 1.5rem;
}

.genre-group h2 {
    margin: 0 0 0.75rem;
    font-size: 1.25rem;
}

.genre-row {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 0.25rem 0.25rem 1rem;
    scroll-snap-type: x proximity;
}

.genre-row :deep(.show-card) {
    flex: 0 0 280px;
    scroll-snap-align: start;
}

@media (max-width: 600px) {
    .genre-row {
        gap: 0.75rem;
    }

    .genre-row :deep(.show-card) {
        flex-basis: min(84vw, 280px);
    }
}
</style>