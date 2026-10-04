<script setup>
const props = defineProps({
    page: {
        type: Number,
        required: true
    },
    hasNextPage: {
        type: Boolean,
        default: true
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['change']);

function changePage(targetPage) {
    if (targetPage < 0 || props.loading) return;
    emit('change', targetPage);
}

</script>

<template>
    <nav class="pagination" :aria-label="$t('pagination.navigationLabel')">
        <button type="button" :disabled="page === 0 || loading" @click="changePage(page - 1)">
            {{ $t('pagination.previous') }}
        </button>
        <span class="pagination__page" aria-live="polite">
            {{ $t('pagination.page', { page: page + 1 }) }}
        </span>
        <button type="button" :disabled="!hasNextPage || loading" @click="changePage(page + 1)">
            {{ $t('pagination.next') }}
        </button>
    </nav>
</template>

<style scoped>
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem;
    color: #263a36;
}

.pagination button {
    min-width: 44px;
    min-height: 44px;
    padding: 0.5rem 0.9rem;
    border: 1px solid #174a43;
    border-radius: 6px;
    background-color: #174a43;
    color: #ffffff;
    cursor: pointer;
    font: inherit;
}

.pagination button:hover:not(:disabled) {
    background-color: #103b35;
}

.pagination button:focus-visible {
    outline: 3px solid #287d68;
    outline-offset: 2px;
}

.pagination button:disabled {
    border-color: #9aada4;
    background-color: #e0e9e4;
    color: #43564c;
    cursor: not-allowed;
}

.pagination__page {
    min-width: 4.5rem;
    text-align: center;
}

@media (max-width: 400px) {
    .pagination {
        gap: 0.5rem;
        padding: 0.75rem 0;
    }
}
</style>