import { onScopeDispose } from 'vue';

export function useDebouncedCallback<TArgs extends unknown[]>(
    callback: (...args: TArgs) => void,
    delay: number,
) {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const cancel = (): void => {
        clearTimeout(timeout);
    };

    const debounced = (...args: TArgs): void => {
        cancel();
        timeout = setTimeout(() => callback(...args), delay);
    };

    onScopeDispose(cancel);

    return { debounced, cancel };
}
