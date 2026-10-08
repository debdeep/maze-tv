import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppConfig } from '../../utils/config.js';
import SearchBar from '../SearchBar.vue';
import { mountComponent } from './test-utils.js';

afterEach(() => vi.useRealTimers());

describe('SearchBar', () => {
    it('focuses the input and emits the trimmed query after the configured delay', async () => {
        vi.useFakeTimers();
        const wrapper = mountComponent(SearchBar, { attachTo: document.body });
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
        const wrapper = mountComponent(SearchBar);

        await wrapper.get('input').setValue('pending');
        wrapper.vm.clear();
        await vi.advanceTimersByTimeAsync(AppConfig.searchDelay);

        expect(wrapper.get('input').element.value).toBe('');
        expect(wrapper.emitted('search')).toEqual([['']]);
    });
});
