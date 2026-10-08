import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchShowsPage } from '../services/tvmaze.js';
import { AppConfig } from '../utils/config.js';
import { groupShowsByGenre } from '../utils/groupShowsByGenre.js';

export const useShowsStore = defineStore('shows', () => {
    const items = ref([]);
    const page = ref(0);
    const hasNextPage = ref(true);
    const loading = ref(false);
    const loadingPage = ref(null);
    const error = ref(false);
    const searchQuery = ref('');
    const topShowsOnly = ref(false);

    const filteredShows = computed(() => {
        let nextShows = [...items.value];

        if (topShowsOnly.value) {
            nextShows = nextShows.filter(show =>
                Number(show?.rating?.average ?? 0) >= AppConfig.showRatingsBenchMark
            );
        }

        if (searchQuery.value && searchQuery.value.length > AppConfig.searchMinLength) {
            const query = searchQuery.value.toLowerCase();
            nextShows = nextShows.filter(show =>
                show.name?.toLowerCase().includes(query)
            );
        }

        return nextShows;
    });

    const genreGroups = computed(() => groupShowsByGenre(filteredShows.value));

    async function fetchPage(targetPage = page.value) {
        if (loading.value) return;

        loading.value = true;
        loadingPage.value = targetPage;
        error.value = false;

        try {
            const data = await fetchShowsPage(targetPage);
            if (data === null) {
                hasNextPage.value = false;
                return;
            }

            items.value = data;
            page.value = targetPage;
            hasNextPage.value = data.length > 0;
        } catch {
            error.value = true;
        } finally {
            loading.value = false;
            loadingPage.value = null;
        }
    }

    function setSearch(query) {
        searchQuery.value = query;
    }

    function toggleTopShows(isChecked) {
        topShowsOnly.value = isChecked;
        if (isChecked) {
            searchQuery.value = '';
        }
    }

    return {
        items,
        page,
        hasNextPage,
        loading,
        loadingPage,
        error,
        searchQuery,
        topShowsOnly,
        filteredShows,
        genreGroups,
        fetchPage,
        setSearch,
        toggleTopShows,
    };
});
