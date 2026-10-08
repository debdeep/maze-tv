import { describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { i18n } from '../../i18n/index.js';
import ShowDetail from '../ShowDetail.vue';
import { mountComponent } from '../../components/__tests__/test-utils.js';

function detailResponse(show) {
    return { ok: true, json: async () => show };
}

async function mountOnRoute(path, routePath = '/shows/:id?') {
    const testRouter = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: routePath, component: ShowDetail }],
    });
    await testRouter.push(path);
    await testRouter.isReady();
    return mountComponent(ShowDetail, {
        global: { plugins: [testRouter, i18n] },
    });
}

describe('ShowDetail', () => {
    it('fetches the route ID and renders the show details', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(detailResponse({
            id: 1,
            name: 'Under the Dome',
            genres: ['Drama', 'Science-Fiction'],
            rating: { average: 6.6 },
            schedule: { time: '22:00', days: ['Thursday'] },
            summary: '<p>A town is sealed under a dome.</p>',
        })));
        const wrapper = await mountOnRoute('/shows/1');

        await flushPromises();

        expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows/1');
        expect(wrapper.get('h1').text()).toBe('Under the Dome');
        expect(wrapper.text()).toContain('Science-Fiction');
        expect(wrapper.text()).toContain('22:00');
        expect(wrapper.text()).toContain('A town is sealed under a dome.');
    });

    it('uses the first route ID when the route parameter is an array', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(detailResponse({
            id: 1,
            name: 'Under the Dome',
            genres: [],
        })));
        const wrapper = await mountOnRoute('/shows/1/2', '/shows/:id+');

        await flushPromises();

        expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows/1');
        expect(wrapper.get('h1').text()).toBe('Under the Dome');
    });

    it('shows an error without requesting when the route has no ID', async () => {
        vi.stubGlobal('fetch', vi.fn());
        const wrapper = await mountOnRoute('/shows');

        await flushPromises();

        expect(wrapper.get('[role="alert"]').text()).toContain('Unable to load this show');
        expect(fetch).not.toHaveBeenCalled();
    });

    it('shows an error when the API responds unsuccessfully', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
        const wrapper = await mountOnRoute('/shows/1');

        await flushPromises();

        expect(wrapper.get('[role="alert"]').text()).toContain('Unable to load this show');
    });

    it('shows an error and retries after a failed request', async () => {
        vi.stubGlobal('fetch', vi.fn()
            .mockRejectedValueOnce(new Error('offline'))
            .mockResolvedValueOnce(detailResponse({ id: 1, name: 'Under the Dome', genres: [] })));
        const wrapper = await mountOnRoute('/shows/1');

        await flushPromises();
        expect(wrapper.get('[role="alert"]').text()).toContain('Unable to load this show');

        await wrapper.get('button').trigger('click');
        await flushPromises();

        expect(wrapper.get('h1').text()).toBe('Under the Dome');
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
