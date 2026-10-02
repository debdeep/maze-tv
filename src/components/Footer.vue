<script setup>
</script>

<template>
    <footer class="footer-container">
        <p>{{ $t("footerLabel") }}</p>
    </footer>
</template>

<style scoped>
.footer-container {
    background-color: #5ba395;
    color: #ffffff;
    padding: 1rem;
    text-align: center;
}

.footer-container p {
    max-width: 60ch;
    margin: 0 auto;
    font-size: 0.95rem;
    line-height: 1.5;
}
</style>