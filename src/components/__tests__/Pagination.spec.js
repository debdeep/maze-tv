import { describe, expect, it } from 'vitest';
import Pagination from '../Pagination.vue';
import { mountComponent } from './test-utils.js';

describe('Pagination', () => {
    it('emits the previous and next page numbers', async () => {
        const wrapper = mountComponent(Pagination, {
            props: { page: 1, hasNextPage: true },
        });

        await wrapper.findAll('button')[0].trigger('click');
        await wrapper.findAll('button')[1].trigger('click');

        expect(wrapper.emitted('change')).toEqual([[0], [2]]);
    });

    it('disables unavailable navigation and prevents changes while loading', async () => {
        const wrapper = mountComponent(Pagination, {
            props: { page: 0, hasNextPage: false, loading: true },
        });

        expect(wrapper.findAll('button').every(button => button.element.disabled)).toBe(true);
        await wrapper.findAll('button')[1].trigger('click');
        expect(wrapper.emitted('change')).toBeUndefined();
    });
});
