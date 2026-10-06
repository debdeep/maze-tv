<script setup lang="ts">
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="container">
    <Header />
    <main class="container-body">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  background:
    radial-gradient(circle at top, rgba(176, 222, 205, 0.42), transparent 28%),
    linear-gradient(180deg, #f5faf7 0%, #edf6f1 100%);
}

.container-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 1rem;
  background: transparent;
}

:global(body) {
  margin: 0;
  background: #edf6f1;
  color: #173c35;
  font-family: Inter, 'Segoe UI', sans-serif;
}
</style>
