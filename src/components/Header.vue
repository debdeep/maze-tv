<script setup>
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import NavBar from './NavBar.vue';

const { locale } = useI18n({ useScope: 'global' });

watch(locale, (currentLocale) => {
    document.documentElement.lang = currentLocale === 'dt' ? 'nl' : currentLocale;
}, { immediate: true });
</script>

<template>
    <header class="header-container">
        <h1>{{ $t("headerLabel") }}</h1>
        <NavBar />
        <label class="language-switcher">
            <span>{{ $t('languageSwitcher.label') }}</span>
            <select v-model="locale">
                <option value="en">English</option>
                <option value="dt">Dutch</option>
            </select>
        </label>
    </header>
</template>
<style scoped>
.header-container {
    background-color: #174a43;
    color: #ffffff;
    padding: 1rem;
    text-align: center;
}

.header-container h1 {
    margin: 0 0 0.75rem;
    font-size: 1.75rem;
    line-height: 1.2;
}

.language-switcher {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    width: 100%;
    margin-top: 0.75rem;
    font-size: 0.9rem;
}

.language-switcher select {
    min-height: 40px;
    padding: 0.35rem 0.6rem;
    border: 1px solid #ffffff;
    border-radius: 4px;
    background: #ffffff;
    color: #173c35;
    font: inherit;
}

.language-switcher select:focus-visible {
    outline: 3px solid #ffe08a;
    outline-offset: 2px;
}

@media (max-width: 600px) {
    .header-container {
        padding: 0.875rem 1rem;
    }

    .header-container h1 {
        margin-bottom: 0.625rem;
        font-size: 1.5rem;
    }
}
</style>