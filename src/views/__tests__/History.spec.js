import { describe, expect, it } from 'vitest';
import History from '../History.vue';
import { mountComponent } from '../../components/__tests__/test-utils.js';

describe('History', () => {
    it('renders a localized page heading and the empty route state', () => {
        const wrapper = mountComponent(History);

        expect(wrapper.get('h1').text()).toBe('Visited Pages');
        expect(wrapper.text()).toContain('No visited site links');
    });
});
