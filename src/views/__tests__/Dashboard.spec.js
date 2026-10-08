import { describe, expect, it } from 'vitest';
import Dashboard from '../Dashboard.vue';
import { mountComponent } from '../../components/__tests__/test-utils.js';

describe('Dashboard', () => {
    it('renders the show list', () => {
        const wrapper = mountComponent(Dashboard, {
            global: {
                stubs: { ShowsList: { template: '<div data-test="shows-list" />' } },
            },
        });

        expect(wrapper.find('[data-test="shows-list"]').exists()).toBe(true);
    });
});
