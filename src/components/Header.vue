<script setup lang="ts">
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
        <div class="header-top">
            <div class="header-spacer" aria-hidden="true"></div>
            <h1>{{ $t("headerLabel") }}</h1>
            <label class="language-switcher">
                <span>{{ $t('languageSwitcher.label') }}</span>
                <select v-model="locale">
                    <option value="en">English</option>
                    <option value="dt">Dutch</option>
                </select>
            </label>
        </div>
        <NavBar />
    </header>
</template>
<style scoped>
.header-container {
    background: linear-gradient(135deg, #123d36 0%, #1d5d52 100%);
    color: #f3faf6;
    padding: 0.65rem 1rem 0.45rem;
    box-shadow: 0 8px 20px rgb(18 61 54 / 10%);
}

.header-top {
    display: grid;
    grid-template-columns: minmax(110px, 1fr) auto minmax(110px, 1fr);
    align-items: center;
    gap: 0.55rem;
    min-height: 2.8rem;
}

.header-spacer {
    min-height: 1px;
}

.header-container h1 {
    margin: 0;
    text-align: center;
    font-size: clamp(1.2rem, 2vw, 1.7rem);
    line-height: 1.1;
    letter-spacing: -0.04em;
}

.language-switcher {
    display: inline-flex;
    align-items: center;
    justify-self: end;
    gap: 0.45rem;
    font-size: 0.78rem;
    color: #e7f5ee;
}

.language-switcher select {
    min-height: 34px;
    padding: 0.28rem 0.55rem;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 7px;
    background: rgba(255, 255, 255, 0.96);
    color: #173c35;
    font: inherit;
    box-shadow: inset 0 0 0 1px rgba(18, 61, 54, 0.08);
}

.language-switcher select:focus-visible {
    outline: 3px solid #ffe08a;
    outline-offset: 2px;
}

@media (max-width: 600px) {
    .header-container {
        padding: 0.7rem 0.75rem 0.35rem;
    }

    .header-top {
        grid-template-columns: 1fr;
        gap: 0.4rem;
        min-height: auto;
    }

    .header-container h1 {
        font-size: 1.3rem;
    }

    .language-switcher {
        justify-self: center;
        flex-wrap: wrap;
        justify-content: center;
    }
}
</style>