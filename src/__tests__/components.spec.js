import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { defineComponent, h, nextTick } from 'vue';
import { i18n } from '../locales/index.js';
import { AppConfig } from '../utils/config.js';
import { visitedRoutes } from '../router/index.js';
import Footer from '../components/Footer.vue';
import Header from '../components/Header.vue';
import HistoryRouteList from '../components/HistoryRouteList.vue';
import NavBar from '../components/NavBar.vue';
import Pagination from '../components/Pagination.vue';
import SearchBar from '../components/SearchBar.vue';
import ShowCard from '../components/ShowCard.vue';
import ShowsList from '../components/ShowsList.vue';
import TopShowsToggle from '../components/TopShowsToggle.vue';

const RouterLinkStub = defineComponent({
    props: {
        to: {
            type: [String, Object],
            required: true,
        },
    },
    setup(props, { slots }) {
        return () => h('a', { href: typeof props.to === 'string' ? props.to : props.to.path }, slots.default?.());
    },
});

const wrappers = [];

function mountLocalized(component, options = {}) {
    const wrapper = mount(component, {
        ...options,
        global: {
            plugins: [i18n, createPinia()],
            stubs: { RouterLink: RouterLinkStub },
            ...options.global,
        },
    });
    wrappers.push(wrapper);
    return wrapper;
}

beforeEach(() => {
    setActivePinia(createPinia());
    i18n.global.locale.value = 'en';
    document.documentElement.lang = 'en';
    visitedRoutes.splice(0);
});

afterEach(() => {
    wrappers.splice(0).forEach(wrapper => wrapper.unmount());
    visitedRoutes.splice(0);
    i18n.global.locale.value = 'en';
    document.documentElement.lang = 'en';
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('Header, navigation, and footer', () => {
    it('updates the global locale and document language from the selector', async () => {
        const wrapper = mountLocalized(Header);

        await wrapper.get('select').setValue('dt');
        await nextTick();

        expect(i18n.global.locale.value).toBe('dt');
        expect(document.documentElement.lang).toBe('nl');
        expect(wrapper.text()).toContain('Taal');
    });

    it('renders navigation links and the localized footer message', () => {
        const nav = mountLocalized(NavBar);
        const footer = mountLocalized(Footer);

        expect(nav.findAll('a').map(link => link.text())).toEqual(['Dashboard', 'History']);
        expect(nav.text()).toContain('|');
        expect(footer.text()).toContain('all rights reserved');
    });
});

describe('HistoryRouteList', () => {
    it('shows the localized empty state', () => {
        const wrapper = mountLocalized(HistoryRouteList);

        expect(wrapper.text()).toContain('No visited site links');
        expect(wrapper.find('ul').exists()).toBe(false);
    });

    it('renders visited routes as links', () => {
        visitedRoutes.push({ path: '/shows' }, { path: '/shows/1' });
        const wrapper = mountLocalized(HistoryRouteList);

        expect(wrapper.findAll('a').map(link => link.text())).toEqual(['/shows', '/shows/1']);
    });
});

describe('SearchBar', () => {
    it('focuses the input and emits a trimmed query after the configured delay', async () => {
        vi.useFakeTimers();
        const wrapper = mountLocalized(SearchBar, { attachTo: document.body });
        const input = wrapper.get('input');

        expect(document.activeElement).toBe(input.element);
        await input.setValue('  Drama  ');
        await vi.advanceTimersByTimeAsync(AppConfig.searchDelay - 1);
        expect(wrapper.emitted('search')).toBeUndefined();

        await vi.advanceTimersByTimeAsync(1);
        expect(wrapper.emitted('search')).toEqual([['Drama']]);
    });

    it('clears the input and cancels a pending search', async () => {
        vi.useFakeTimers();
        const wrapper = mountLocalized(SearchBar);

        await wrapper.get('input').setValue('pending');
        wrapper.vm.clear();
        await vi.advanceTimersByTimeAsync(AppConfig.searchDelay);

        expect(wrapper.get('input').element.value).toBe('');
        expect(wrapper.emitted('search')).toEqual([['']]);
    });
});

describe('TopShowsToggle', () => {
    it('emits the checkbox state when changed', async () => {
        const wrapper = mountLocalized(TopShowsToggle);

        await wrapper.get('input[type="checkbox"]').setValue(true);

        expect(wrapper.emitted('toggle')).toEqual([[true]]);
    });
});

describe('Pagination', () => {
    it('emits previous and next page numbers', async () => {
        const wrapper = mountLocalized(Pagination, {
            props: { page: 1, hasNextPage: true },
        });
        const [previous, next] = wrapper.findAll('button');

        await previous.trigger('click');
        await next.trigger('click');

        expect(wrapper.emitted('change')).toEqual([[0], [2]]);
    });

    it('disables navigation at the first page and while the next page is unavailable', () => {
        const wrapper = mountLocalized(Pagination, {
            props: { page: 0, hasNextPage: false },
        });
        const [previous, next] = wrapper.findAll('button');

        expect(previous.attributes('disabled')).toBeDefined();
        expect(next.attributes('disabled')).toBeDefined();
    });
});

describe('ShowCard', () => {
    it('renders show details, summary, and the translated poster fallback', () => {
        const wrapper = mountLocalized(ShowCard, {
            props: {
                show: {
                    id: 1,
                    name: 'Under the Dome',
                    genres: ['Drama'],
                    rating: { average: 6.6 },
                    summary: '<p>A small town is sealed off.</p>',
                },
            },
        });

        expect(wrapper.text()).toContain('Under the Dome');
        expect(wrapper.text()).toContain('Drama');
        expect(wrapper.text()).toContain('6.6');
        expect(wrapper.text()).toContain('A small town is sealed off.');
        expect(wrapper.text()).toContain('No image available');
    });
});

describe('ShowsList', () => {
    it('loads pages, renders genre-sorted rails, and requests the next page', async () => {
        vi.stubGlobal('fetch', vi.fn()
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => [
                    { id: 1, name: 'Lower Drama', genres: ['Drama'], rating: { average: 6 } },
                    { id: 2, name: 'Top Drama', genres: ['Drama', 'Comedy'], rating: { average: 9 } },
                ],
            })
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => [
                    { id: 3, name: 'Page Two', genres: ['Science-Fiction'], rating: { average: 8 } },
                ],
            }));
        const wrapper = mountLocalized(ShowsList);

        await flushPromises();

        expect(wrapper.findAll('.genre-group > h2').map(heading => heading.text())).toEqual(['Comedy', 'Drama']);
        expect(wrapper.findAll('.genre-group')[1].findAll('.show-card h2').map(title => title.text()))
            .toEqual(['Top Drama', 'Lower Drama']);
        expect(fetch).toHaveBeenNthCalledWith(1, 'https://api.tvmaze.com/shows?page=0');

        await wrapper.findAll('.pagination button')[1].trigger('click');
        await flushPromises();

        expect(fetch).toHaveBeenNthCalledWith(2, 'https://api.tvmaze.com/shows?page=1');
        expect(wrapper.text()).toContain('Page 2');
        expect(wrapper.text()).toContain('Page Two');
    });

    it('filters by search and clears the query when the rating toggle is enabled', async () => {
        vi.useFakeTimers();
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => [
                { id: 1, name: 'Low Rated', genres: ['Drama'], rating: { average: 6 } },
                { id: 2, name: 'Top Rated', genres: ['Drama'], rating: { average: 9 } },
            ],
        }));
        const wrapper = mountLocalized(ShowsList);
        await flushPromises();

        const search = wrapper.get('#search-input');
        await search.setValue('Low');
        await vi.advanceTimersByTimeAsync(AppConfig.searchDelay);
        expect(wrapper.findAll('.show-card h2').map(title => title.text())).toEqual(['Low Rated']);

        await wrapper.get('input[type="checkbox"]').setValue(true);

        expect(wrapper.get('#search-input').element.value).toBe('');
        expect(wrapper.findAll('.show-card h2').map(title => title.text())).toEqual(['Top Rated']);
    });

});