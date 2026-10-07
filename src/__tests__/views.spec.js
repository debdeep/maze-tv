import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { i18n } from '../locales/index.js';
import { visitedRoutes } from '../router/index.js';
import Dashboard from '../views/Dashboard.vue';
import History from '../views/History.vue';
import NotFound from '../views/NotFound.vue';
import ShowDetail from '../views/ShowDetail.vue';
import router from '../router/index.js';

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

async function mountShowDetail(path = '/shows/1') {
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: '/shows/:id?', component: ShowDetail }],
    });
    await router.push(path);
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

describe('NotFound view', () => {
    it('renders a localized 404 message and a link back to shows', () => {
        const wrapper = track(mount(NotFound, {
            global: {
                plugins: [i18n],
                stubs: { RouterLink: RouterLinkStub },
            },
        }));

        expect(wrapper.text()).toContain('404');
        expect(wrapper.text()).toContain('Page not found');
        expect(wrapper.text()).toContain('Back to shows');
    });

    it('matches unknown paths with the catch-all route', () => {
        expect(router.resolve('/does-not-exist').name).toBe('not-found');
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

    it('shows an error without requesting when the route has no ID', async () => {
        vi.stubGlobal('fetch', vi.fn());
        const { wrapper } = await mountShowDetail('/shows');

        await flushPromises();

        expect(wrapper.get('[role="alert"]').text()).toContain('Unable to load this show');
        expect(fetch).not.toHaveBeenCalled();
    });

    it('shows an error when the API responds unsuccessfully', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
        const { wrapper } = await mountShowDetail();

        await flushPromises();

        expect(wrapper.get('[role="alert"]').text()).toContain('Unable to load this show');
    });

    it('renders time-only and day-only schedules with fallback network details', async () => {
        const show = {
            id: 1,
            name: 'Streaming Show',
            averageRuntime: 42,
            schedule: { time: '21:30' },
            webChannel: { name: 'Stream TV' },
            image: { medium: 'https://example.com/poster.jpg' },
        };
        vi.stubGlobal('fetch', vi.fn()
            .mockResolvedValueOnce(detailResponse(show))
            .mockResolvedValueOnce(detailResponse({
                ...show,
                id: 2,
                schedule: { days: ['Friday'] },
            })));
        const { router, wrapper } = await mountShowDetail();

        await flushPromises();
        expect(wrapper.text()).toContain('21:30');
        expect(wrapper.text()).toContain('Stream TV');
        expect(wrapper.text()).toContain('42');
        expect(wrapper.find('.show-detail__poster').attributes('src')).toBe('https://example.com/poster.jpg');

        await router.push('/shows/2');
        await flushPromises();
        expect(wrapper.text()).toContain('Friday');
    });

    it('renders the poster fallback when show artwork is missing', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(detailResponse({
            id: 1,
            name: 'No Artwork',
            genres: [],
        })));
        const { wrapper } = await mountShowDetail();

        await flushPromises();

        expect(wrapper.find('.show-detail__poster-fallback').exists()).toBe(true);
        expect(wrapper.text()).toContain('No image available');
    });
});