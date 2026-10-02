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
    padding: 0 1rem;
}

.search-bar input {
    box-sizing: border-box;
    width: min(100%, 28rem);
    padding: 0.65rem 0.9rem;
    border-radius: 8px;
}

@media (max-width: 600px) {
    .search-bar {
        margin: 0.75rem 0;
    }

    .search-bar input {
        width: 100%;
        min-width: 0;
        min-height: 44px;
    }
}
</style>