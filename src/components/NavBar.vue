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
    background-color: lightgray;
    color: black;
    text-align: right;
    position: sticky;
    top: 0;
    gap: .5rem;
}
</style>