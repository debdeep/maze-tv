import { describe, expect, it } from 'vitest';
import Footer from '../Footer.vue';
import { mountComponent } from './test-utils.js';

describe('Footer', () => {
    it('renders its localized footer message', () => {
        const wrapper = mountComponent(Footer);

        expect(wrapper.get('footer p').text()).toContain('all rights reserved');
    });
});
