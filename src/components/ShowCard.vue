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
    <div>
        <h2>{{ showDetails.show.name }}</h2>
        <p v-html="showDetails.show.summary"></p>
    </div>
</template>
<style scoped></style>