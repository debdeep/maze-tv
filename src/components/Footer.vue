<script setup lang="ts">
</script>

<template>
    <footer class="footer-container">
        <p>{{ $t("footerLabel") }}</p>
    </footer>
</template>

<style scoped>
.footer-container {
    background: linear-gradient(180deg, #1f3d37 0%, #173a34 100%);
    color: #ecf9f3;
    padding: 1.05rem 1rem 1.2rem;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-container p {
    max-width: 60ch;
    margin: 0 auto;
    font-size: 0.95rem;
    line-height: 1.5;
    color: #ecf9f3;
}
</style>