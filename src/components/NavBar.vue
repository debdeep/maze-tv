<script setup>
</script>

<template>
    <nav class="nav-container">
        <RouterLink to="/dashboard">{{ $t("navigationsHeaders.dashboard") }} | </RouterLink>
        <RouterLink to="/history">{{ $t("navigationsHeaders.history") }}</RouterLink>
    </nav>
</template>
<style scoped>
.nav-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    background-color: lightgray;
    color: black;
    position: sticky;
    top: 0;
    gap: .5rem;
}
</style>