import { describe, expect, it } from 'vitest';
import NavBar from '../NavBar.vue';
import { mountComponent } from './test-utils.js';

describe('NavBar', () => {
    it('renders localized links for the dashboard and history routes', () => {
        const wrapper = mountComponent(NavBar);

        expect(wrapper.findAll('a').map(link => [link.text(), link.attributes('href')]))
            .toEqual([['Dashboard', '/shows'], ['History', '/history']]);
        expect(wrapper.get('nav').attributes('aria-label')).toBe('Main navigation');
    });
});
