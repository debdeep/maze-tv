import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { i18n } from '../locales/index.js';
import { visitedRoutes } from '../router/index.js';
import Dashboard from '../views/Dashboard.vue';
import History from '../views/History.vue';
import ShowDetail from '../views/ShowDetail.vue';

const RouterLinkStub = { template: '<a><slot /></a>' };
const wrappers = [];

function track(wrapper) {
    wrappers.push(wrapper);
    return wrapper;
}

function detailResponse(show) {
    return {
        ok: true,
        json: async () => show,
    };
}

async function mountShowDetail() {
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: '/shows/:id', component: ShowDetail }],
    });
    await router.push('/shows/1');
    await router.isReady();

    const wrapper = mount(ShowDetail, {
        global: { plugins: [router, i18n] },
    });
    return { router, wrapper: track(wrapper) };
}

beforeEach(() => {
    i18n.global.locale.value = 'en';
    visitedRoutes.splice(0);
});

afterEach(() => {
    wrappers.splice(0).forEach(wrapper => wrapper.unmount());
    visitedRoutes.splice(0);
    i18n.global.locale.value = 'en';
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('Dashboard view', () => {
    it('renders the show-list component', () => {
        const wrapper = track(mount(Dashboard, {
            global: {
                stubs: { ShowsList: { template: '<div data-test="shows-list" />' } },
            },
        }));

        expect(wrapper.find('[data-test="shows-list"]').exists()).toBe(true);
    });
});

describe('History view', () => {
    it('renders the localized heading and empty route state', () => {
        const wrapper = track(mount(History, {
            global: {
                plugins: [i18n],
                stubs: { RouterLink: RouterLinkStub },
            },
        }));

        expect(wrapper.find('h1').text()).toBe('Visited Pages');
        expect(wrapper.text()).toContain('No visited site links');
    });
});

describe('ShowDetail view', () => {
    it('fetches the route ID and renders show details', async () => {
        const show = {
            id: 1,
            name: 'Under the Dome',
            type: 'Scripted',
            language: 'English',
            status: 'Ended',
            genres: ['Drama', 'Science-Fiction'],
            rating: { average: 6.6 },
            runtime: 60,
            premiered: '2013-06-24',
            schedule: { time: '22:00', days: ['Thursday'] },
            network: { name: 'CBS' },
            officialSite: 'https://example.com',
            image: { medium: 'https://example.com/poster.jpg' },
            summary: '<p>A town is sealed under a dome.</p>',
        };
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(detailResponse(show)));
        const { wrapper } = await mountShowDetail();

        await flushPromises();

        expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows/1');
        expect(wrapper.find('h1').text()).toBe('Under the Dome');
        expect(wrapper.text()).toContain('Science-Fiction');
        expect(wrapper.text()).toContain('22:00');
        expect(wrapper.text()).toContain('A town is sealed under a dome.');
    });

    it('shows an error and allows retrying the request', async () => {
        const show = { id: 1, name: 'Under the Dome', genres: [] };
        vi.stubGlobal('fetch', vi.fn()
            .mockRejectedValueOnce(new Error('offline'))
            .mockResolvedValueOnce(detailResponse(show)));
        const { wrapper } = await mountShowDetail();

        await flushPromises();
        expect(wrapper.text()).toContain('Unable to load this show');

        await wrapper.get('button').trigger('click');
        await flushPromises();

        expect(wrapper.find('h1').text()).toBe('Under the Dome');
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});