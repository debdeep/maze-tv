<template>
    <section class="not-found" aria-labelledby="not-found-title">
        <p class="not-found__code">404</p>
        <h1 id="not-found-title">{{ $t('notFound.title') }}</h1>
        <p>{{ $t('notFound.message') }}</p>
        <RouterLink class="not-found__link" to="/shows">
            {{ $t('notFound.backToShows') }}
        </RouterLink>
    </section>
</template>

<style scoped>
.not-found {
    max-width: 36rem;
    margin: 0 auto;
    padding: 3rem 1rem;
    text-align: center;
}

.not-found__code {
    margin: 0;
    color: #174a43;
    font-size: 1rem;
    font-weight: 700;
}

.not-found h1 {
    margin: 0.5rem 0;
    font-size: 2rem;
}

.not-found__link {
    display: inline-block;
    margin-top: 0.75rem;
    color: #174a43;
    font-weight: 600;
    text-underline-offset: 0.2em;
}
</style>