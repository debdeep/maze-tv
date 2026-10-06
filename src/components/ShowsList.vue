<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useShowsStore } from '../stores/shows';
import ShowCard from './ShowCard.vue';
import SearchBar from './SearchBar.vue';
import Pagination from './Pagination.vue';
import TopShowsToggle from './TopShowsToggle.vue';

const showsStore = useShowsStore();
const searchBar = ref<{ focus: () => void; clear: () => void } | null>(null);

const shows = computed(() => showsStore.items);
const page = computed(() => showsStore.page);
const hasNextPage = computed(() => showsStore.hasNextPage);
const loading = computed(() => showsStore.loading);
const loadingPage = computed(() => showsStore.loadingPage);
const loadError = computed(() => showsStore.error);
const filteredShows = computed(() => showsStore.filteredShows);
const genreGroups = computed(() => showsStore.genreGroups);

onMounted(async () => {
    await showsStore.fetchPage(0);
});

async function getShowList(targetPage: number = page.value): Promise<void> {
    const shouldFocusSearch = targetPage !== page.value;

    await showsStore.fetchPage(targetPage);

    if (shouldFocusSearch) {
        searchBar.value?.focus();
    }
}

const handleSearch = (query: string): void => {
    showsStore.setSearch(query);
};

const handleToggle = (isChecked: boolean): void => {
    showsStore.toggleTopShows(isChecked);
    if (isChecked) {
        searchBar.value?.clear();
    }
};
</script>

<template>
    <SearchBar ref="searchBar" @search="handleSearch" />
    <TopShowsToggle @toggle="handleToggle" />
    <p v-if="loading && shows.length === 0" class="list-message" role="status">
        {{ $t('showsList.loading') }}
    </p>
    <p v-if="loadError" class="list-message" role="alert">
        {{ $t('showsList.loadError') }}
        <button type="button" @click="getShowList(page)">{{ $t('showsList.retry') }}</button>
    </p>
    <p v-if="loading && shows.length > 0" class="list-message" role="status">
        {{ $t('showsList.loadingPage', { page: (loadingPage ?? 0) + 1 }) }}
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