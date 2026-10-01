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
    background-color: lightgray;
    color: black;
    padding: .5rem;
    text-align: center;
}
</style>