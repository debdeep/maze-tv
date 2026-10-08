import { describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import ShowsList from '../ShowsList.vue';
import { mountComponent } from './test-utils.js';

function pageResponse(shows) {
    return { ok: true, status: 200, json: async () => shows };
}

describe('ShowsList', () => {
    it('loads the first page and renders genre-sorted show groups', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(pageResponse([
            { id: 1, name: 'Lower Drama', genres: ['Drama'], rating: { average: 6 } },
            { id: 2, name: 'Top Drama', genres: ['Drama', 'Comedy'], rating: { average: 9 } },
        ])));
        const wrapper = mountComponent(ShowsList);

        await flushPromises();

        expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows?page=0');
        expect(wrapper.findAll('.genre-group > h2').map(heading => heading.text()))
            .toEqual(['Comedy', 'Drama']);
        expect(wrapper.findAll('.genre-group')[1].findAll('.show-card h2').map(title => title.text()))
            .toEqual(['Top Drama', 'Lower Drama']);
    });

    it('shows an error and retries the current page', async () => {
        vi.stubGlobal('fetch', vi.fn()
            .mockRejectedValueOnce(new Error('offline'))
            .mockResolvedValueOnce(pageResponse([])));
        const wrapper = mountComponent(ShowsList);

        await flushPromises();
        expect(wrapper.get('[role="alert"]').text()).toContain('Unable to load shows');

        await wrapper.get('[role="alert"] button').trigger('click');
        await flushPromises();

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(wrapper.find('.no-results').exists()).toBe(true);
    });
});
