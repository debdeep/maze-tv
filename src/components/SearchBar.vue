<script setup>
import { ref, onMounted } from 'vue';
import { AppConfig } from '../utils/config.js';

const searchQuery = ref('');
const emit = defineEmits(['search']); // <-- define emit

onMounted(() => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.focus();
    }
});

function debouncedSearch(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

const onInput = () => {
    emit('search', searchQuery.value);
};

const debouncedOnInput = debouncedSearch(onInput, AppConfig.searchDebounceDelay);
</script>

<template>
    <div class="search-bar">
        <input id="search-input" type="text" :placeholder="$t('searchBar.placeholderText')" v-model.trim="searchQuery"
            @input="debouncedOnInput" />
    </div>
</template>
<style scoped>
.search-bar {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
}

.search-bar input {
    border-radius: 8px;
}
</style>