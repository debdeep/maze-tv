<script setup lang="ts">
</script>

<template>
    <nav class="nav-container" aria-label="Main navigation">
        <RouterLink to="/shows" class="nav-link">{{ $t("navigationHeaders.dashboard") }}</RouterLink>
        <span class="nav-separator" aria-hidden="true">|</span>
        <RouterLink to="/history" class="nav-link">{{ $t("navigationHeaders.history") }}</RouterLink>
    </nav>
</template>
<style scoped>
.nav-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25rem 0.5rem;
    background-color: transparent;
    color: inherit;
    position: sticky;
    top: 0;
    margin-top: 0.2rem;
}

.nav-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2rem;
    padding: 0.35rem 0.7rem;
    border-radius: 999px;
    color: #effaf5;
    font-weight: 600;
    text-decoration: none;
    transition: background-color 150ms ease, color 150ms ease, transform 150ms ease;
}

.nav-link:hover {
    background: rgba(255, 255, 255, 0.09);
    color: #ffffff;
}

.nav-link.router-link-active {
    background: rgba(255, 255, 255, 0.14);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
    text-decoration: none;
}

.nav-link:focus-visible {
    outline: 2px solid #ffe08a;
    outline-offset: 3px;
}

.nav-separator {
    color: rgba(239, 250, 245, 0.82);
    font-weight: 700;
    user-select: none;
}
</style>