import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { i18n } from '../../i18n/index.js';
import Header from '../Header.vue';
import { mountComponent } from './test-utils.js';

describe('Header', () => {
    it('updates the global locale and document language from the selector', async () => {
        const wrapper = mountComponent(Header);

        await wrapper.get('select').setValue('dt');
        await nextTick();

        expect(i18n.global.locale.value).toBe('dt');
        expect(document.documentElement.lang).toBe('nl');
        expect(wrapper.text()).toContain('Taal');
    });

    it('sets the document language when mounted with a non-default locale', async () => {
        i18n.global.locale.value = 'dt';
        mountComponent(Header);
        await nextTick();

        expect(document.documentElement.lang).toBe('nl');
    });
});
