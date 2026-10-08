import { describe, expect, it } from 'vitest';
import NotFound from '../NotFound.vue';
import router from '../../router/index.js';
import { mountComponent } from '../../components/__tests__/test-utils.js';

describe('NotFound', () => {
    it('renders a localized 404 message and a link back to shows', () => {
        const wrapper = mountComponent(NotFound);

        expect(wrapper.text()).toContain('404');
        expect(wrapper.text()).toContain('Page not found');
        expect(wrapper.find('a').attributes('href')).toBe('/shows');
        expect(wrapper.text()).toContain('Back to shows');
    });

    it('matches unknown paths with the catch-all route', () => {
        expect(router.resolve('/does-not-exist').name).toBe('not-found');
    });
});
