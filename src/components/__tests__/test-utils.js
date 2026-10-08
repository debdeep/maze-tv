import { afterEach, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { defineComponent, h } from 'vue';
import { i18n } from '../../i18n/index.js';
import { visitedRoutes } from '../../router/index.js';

export const RouterLinkStub = defineComponent({
    props: {
        to: {
            type: [String, Object],
            required: true,
        },
    },
    setup(props, { slots }) {
        const href = typeof props.to === 'string' ? props.to : props.to.path;
        return () => h('a', { href }, slots.default?.());
    },
});

const wrappers = [];

export function mountComponent(component, options = {}) {
    const wrapper = mount(component, {
        ...options,
        global: {
            plugins: [i18n, createPinia()],
            stubs: { RouterLink: RouterLinkStub },
            ...options.global,
        },
    });
    wrappers.push(wrapper);
    return wrapper;
}

beforeEach(() => {
    setActivePinia(createPinia());
    i18n.global.locale.value = 'en';
    document.documentElement.lang = 'en';
    visitedRoutes.splice(0);
});

afterEach(() => {
    wrappers.splice(0).forEach(wrapper => wrapper.unmount());
    visitedRoutes.splice(0);
    i18n.global.locale.value = 'en';
    document.documentElement.lang = 'en';
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});
