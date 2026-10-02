<script setup>
import { ref, onMounted } from 'vue';

const showDetails = defineProps({
    show: {
        type: Object,
        required: true,
        default: () => ({})
    }
});
</script>

<template>
    <article class="show-card">
        <h2>{{ showDetails?.show.name }}</h2>
        <p v-html="showDetails?.show.summary"></p>
    </article>
</template>
<style scoped>
.show-card {
    box-sizing: border-box;
    min-width: 0;
    flex: 1 1 280px;
    padding: 1.25rem;
    background-color: #fff;
    border: 1px solid #d9e6df;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgb(35 70 52 / 6%);
    overflow-wrap: anywhere;
}

.show-card h2 {
    margin: 0 0 0.75rem;
}

.show-card p {
    margin: 0;
    line-height: 1.55;
}
</style>