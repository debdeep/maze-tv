<script setup>
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
  height: 100vh;
}

.container-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f1f7f4;
}
</style>
