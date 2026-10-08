import { describe, expect, it } from 'vitest';
import { i18n } from '../index.js';

describe('i18n configuration', () => {
    it('starts in English and provides both configured locales', () => {
        expect(i18n.global.locale.value).toBe('en');
        expect(i18n.global.t('headerLabel', {}, { locale: 'en' })).toBe('Maze TV');
        expect(i18n.global.t('headerLabel', {}, { locale: 'dt' })).toBe('Maze TV');
    });

    it('translates messages after switching the active locale', () => {
        i18n.global.locale.value = 'dt';

        expect(i18n.global.t('languageSwitcher.label')).toBe('Taal');

        i18n.global.locale.value = 'en';
        expect(i18n.global.t('languageSwitcher.label')).toBe('Language');
    });
});
