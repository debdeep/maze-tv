import { describe, expect, it } from 'vitest';
import TopShowsToggle from '../TopShowsToggle.vue';
import { mountComponent } from './test-utils.js';

describe('TopShowsToggle', () => {
    it('emits the checkbox state when changed', async () => {
        const wrapper = mountComponent(TopShowsToggle);

        await wrapper.get('input[type="checkbox"]').setValue(true);

        expect(wrapper.emitted('toggle')).toEqual([[true]]);
    });
});
