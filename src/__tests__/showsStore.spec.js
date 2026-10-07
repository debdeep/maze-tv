import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useShowsStore } from '../stores/shows';

describe('shows store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('tracks the current filter state and fetch state without leaking to the rest of the app', () => {
        const store = useShowsStore();

        store.setSearch('the office');
        store.toggleTopShows(true);

        expect(store.searchQuery).toBe('');
        expect(store.topShowsOnly).toBe(true);
        expect(store.items).toEqual([]);
    });

    it('filters loaded shows by a case-insensitive query and rating', () => {
        const store = useShowsStore();
        store.items = [
            { id: 1, name: 'Drama House', rating: { average: 9 }, genres: ['Drama'] },
            { id: 2, name: 'Drama Club', rating: { average: 6 }, genres: ['Drama'] },
            { id: 3, name: 'Comedy Hour', genres: ['Comedy'] },
        ];

        store.setSearch('DRA');
        expect(store.filteredShows.map(show => show.id)).toEqual([1, 2]);

        store.toggleTopShows(true);
        expect(store.searchQuery).toBe('');
        expect(store.filteredShows.map(show => show.id)).toEqual([1]);
        expect(store.genreGroups.map(group => group.genre)).toEqual(['Drama']);

        store.setSearch('x');
        expect(store.filteredShows.map(show => show.id)).toEqual([1]);
        store.toggleTopShows(false);
        expect(store.filteredShows.map(show => show.id)).toEqual([1, 2, 3]);
        store.setSearch('no matching show');
        expect(store.filteredShows.map(show => show.id)).toEqual([]);
    });

    it('loads a page and updates pagination state', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => [{ id: 1, name: 'Loaded show', genres: [] }],
        }));
        const store = useShowsStore();

        await store.fetchPage(2);

        expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows?page=2');
        expect(store.items).toEqual([{ id: 1, name: 'Loaded show', genres: [] }]);
        expect(store.page).toBe(2);
        expect(store.hasNextPage).toBe(true);
        expect(store.loading).toBe(false);
        expect(store.loadingPage).toBe(null);
        expect(store.error).toBe(false);
    });

    it('marks the end of pagination when a later page returns 404', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 404, ok: false }));
        const store = useShowsStore();

        await store.fetchPage(1);

        expect(store.hasNextPage).toBe(false);
        expect(store.page).toBe(0);
        expect(store.error).toBe(false);
        expect(store.loading).toBe(false);
    });

    it('sets an error and clears loading after a failed request', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 404, ok: false }));
        const store = useShowsStore();

        await store.fetchPage(0);

        expect(store.error).toBe(true);
        expect(store.loading).toBe(false);
        expect(store.loadingPage).toBe(null);
    });

    it('ignores a second page request while one is in progress', async () => {
        let resolveRequest;
        vi.stubGlobal('fetch', vi.fn(() => new Promise(resolve => {
            resolveRequest = resolve;
        })));
        const store = useShowsStore();

        const firstRequest = store.fetchPage(1);
        await store.fetchPage(2);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.loadingPage).toBe(1);

        resolveRequest({
            ok: true,
            status: 200,
            json: async () => [{ id: 1, name: 'First page', genres: [] }],
        });
        await firstRequest;

        expect(store.page).toBe(1);
        expect(store.loading).toBe(false);
    });
});
