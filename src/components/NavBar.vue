<script setup>
</script>

<template>
    <nav class="nav-container">
        <RouterLink to="/shows">{{ $t("navigationHeaders.dashboard") }} | </RouterLink>
        <RouterLink to="/history">{{ $t("navigationHeaders.history") }}</RouterLink>
    </nav>
</template>
<style scoped>
.nav-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    background-color: transparent;
    color: inherit;
    position: sticky;
    top: 0;
    gap: .5rem;
}

.nav-container a {
    color: inherit;
    text-underline-offset: 0.2em;
}

.nav-container a:hover {
    color: #c8f1da;
}

.nav-container a.router-link-active {
    text-decoration-thickness: 0.15em;
    text-underline-offset: 0.25em;
}

.nav-container a:focus-visible {
    outline: 2px solid #ffe08a;
    outline-offset: 3px;
}
</style>