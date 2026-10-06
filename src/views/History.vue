<script setup lang="ts">
import HistoryRouteList from '../components/HistoryRouteList.vue';
</script>

<template>
    <section class="history-page">
        <header class="history-page__header">
            <p class="history-page__eyebrow">{{ $t('navigationHeaders.history') }}</p>
            <h1>{{ $t('historyPage.header') }}</h1>
        </header>
        <HistoryRouteList />
    </section>
</template>

<style scoped>
.history-page {
    max-width: 64rem;
    margin: 0 auto;
    padding: 0.5rem 0 1rem;
}

.history-page__header {
    margin-bottom: 1.25rem;
}

.history-page__eyebrow {
    margin: 0 0 0.35rem;
    color: #456a63;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.history-page__header h1 {
    margin: 0;
    font-size: clamp(1.8rem, 3vw, 2.5rem);
    line-height: 1.12;
    color: #173c35;
}
</style>