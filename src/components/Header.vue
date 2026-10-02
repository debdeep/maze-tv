<script setup>
import NavBar from './NavBar.vue';
</script>

<template>
    <header class="header-container">
        <h1>{{ $t("headerLabel") }}</h1>
        <NavBar />
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