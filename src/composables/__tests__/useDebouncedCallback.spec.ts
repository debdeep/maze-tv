import { afterEach, describe, expect, it, vi } from 'vitest';
import { effectScope } from 'vue';
import { useDebouncedCallback } from '../useDebouncedCallback';

afterEach(() => vi.useRealTimers());

describe('useDebouncedCallback', () => {
    it('debounces calls and cancels pending callbacks', () => {
        vi.useFakeTimers();
        const callback = vi.fn();
        const scope = effectScope();
        const { debounced, cancel } = scope.run(() => useDebouncedCallback(callback, 300))!;

        debounced('first');
        vi.advanceTimersByTime(200);
        debounced('latest');
        vi.advanceTimersByTime(299);
        expect(callback).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith('latest');

        debounced('cancelled');
        cancel();
        vi.advanceTimersByTime(300);
        expect(callback).toHaveBeenCalledOnce();

        debounced('disposed');
        scope.stop();
        vi.advanceTimersByTime(300);
        expect(callback).toHaveBeenCalledOnce();
    });
});
