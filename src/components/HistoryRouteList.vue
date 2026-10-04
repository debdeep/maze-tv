<script setup>
import { visitedRoutes } from '../router/index.js';

</script>
<template>
    <div class="history-route-list">
        <p v-if="visitedRoutes.length === 0">{{ $t('historyPage.noVisitedRoutes') }}</p>
        <ul v-else>
            <li v-for="route in visitedRoutes" :key="route.path">
                <RouterLink :to="route.path">{{ route.path }}</RouterLink>
            </li>
        </ul>
    </div>
</template>
