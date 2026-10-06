<script setup lang="ts">
import { computed } from 'vue';
import { visitedRoutes } from '../router/index.js';

const routeList = computed<Array<{ path: string }>>(() => visitedRoutes as Array<{ path: string }>);
</script>

<template>
    <div class="history-route-list">
        <p v-if="routeList.length === 0" class="history-route-list__empty">
            {{ $t('historyPage.noVisitedRoutes') }}
        </p>

        <ul v-else class="history-route-list__list">
            <li v-for="route in routeList" :key="route.path" class="history-route-list__item">
                <RouterLink :to="route.path" class="history-route-list__link">
                    {{ route.path }}
                </RouterLink>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.history-route-list {
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(39, 91, 75, 0.08);
    border-radius: 18px;
    padding: 1rem;
    box-shadow: 0 12px 28px rgba(17, 61, 50, 0.08);
}

.history-route-list__empty {
    margin: 0;
    color: #4f665e;
    line-height: 1.6;
}

.history-route-list__list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin: 0;
    padding: 0;
}

.history-route-list__item {
    display: flex;
}

.history-route-list__link {
    display: inline-flex;
    align-items: center;
    min-height: 2.5rem;
    padding: 0.6rem 0.9rem;
    border-radius: 999px;
    background: linear-gradient(180deg, #edf6f1 0%, #e3efe8 100%);
    border: 1px solid rgba(23, 74, 67, 0.09);
    color: #174a43;
    font-weight: 700;
    text-decoration: none;
    transition: transform 150ms ease, box-shadow 150ms ease, background-color 150ms ease;
}

.history-route-list__link:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(18, 61, 54, 0.1);
    background: linear-gradient(180deg, #ebf7f1 0%, #dfeee7 100%);
}

.history-route-list__link:focus-visible {
    outline: 3px solid #ffe08a;
    outline-offset: 2px;
}

@media (max-width: 600px) {
    .history-route-list {
        padding: 0.85rem;
    }

    .history-route-list__list {
        gap: 0.55rem;
    }

    .history-route-list__link {
        width: 100%;
        justify-content: center;
    }
}
</style>
