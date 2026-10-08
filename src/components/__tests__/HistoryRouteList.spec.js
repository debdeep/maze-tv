import { describe, expect, it } from 'vitest';
import { visitedRoutes } from '../../router/index.js';
import HistoryRouteList from '../HistoryRouteList.vue';
import { mountComponent } from './test-utils.js';

describe('HistoryRouteList', () => {
    it('renders the localized empty state when no routes were visited', () => {
        const wrapper = mountComponent(HistoryRouteList);

        expect(wrapper.find('.history-route-list__empty').text()).toContain('No visited site links');
        expect(wrapper.find('ul').exists()).toBe(false);
    });

    it('renders a link for each visited route', () => {
        visitedRoutes.push({ path: '/shows' }, { path: '/shows/1' });
        const wrapper = mountComponent(HistoryRouteList);

        expect(wrapper.findAll('a').map(link => link.text())).toEqual(['/shows', '/shows/1']);
        expect(wrapper.findAll('a').map(link => link.attributes('href'))).toEqual(['/shows', '/shows/1']);
    });
});
