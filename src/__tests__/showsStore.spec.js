import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useShowsStore } from '../stores/shows';

describe('shows store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('tracks the current filter state and fetch state without leaking to the rest of the app', () => {
        const store = useShowsStore();

        store.setSearch('the office');
        store.toggleTopShows(true);

        expect(store.searchQuery).toBe('');
        expect(store.topShowsOnly).toBe(true);
        expect(store.items).toEqual([]);
    });
});
