<script setup>
import { ref, onMounted } from 'vue';
import { AppConfig } from '../utils/config.js';

const searchQuery = ref('');
const searchInput = ref(null);
const emit = defineEmits(['search']);

function focus() {
    searchInput.value?.focus();
}

function clear() {
    debouncedOnInput.cancel();
    searchQuery.value = '';
    emit('search', '');
}

defineExpose({ focus, clear });

onMounted(focus);

function debouncedSearch(func, delay) {
    let timeout;
    const debounced = function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
    debounced.cancel = () => clearTimeout(timeout);
    return debounced;
}

const onInput = () => {
    emit('search', searchQuery.value);
};

const debouncedOnInput = debouncedSearch(onInput, AppConfig.searchDelay);
</script>

<template>
    <div class="search-bar">
        <input ref="searchInput" id="search-input" type="text" :placeholder="$t('searchBar.placeholderText')"
            v-model.trim="searchQuery" @input="debouncedOnInput" />
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