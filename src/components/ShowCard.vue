<script setup lang="ts">
import { computed } from 'vue';
import type { Show } from '../types/show';

interface ShowCardProps {
    show: Show;
}

const props = defineProps<ShowCardProps>();
const show = computed(() => props.show);
const genres = computed(() => show.value.genres?.join(' · ') || '');
const premieredYear = computed(() => show.value.premiered?.slice(0, 4) || '');
</script>

<template>
    <RouterLink class="show-card" :to="{ name: 'show-detail', params: { id: show.id } }">
        <div class="show-card__main">
            <img v-if="show.image?.medium" v-once class="show-card__poster" :src="show.image.medium"
                :alt="`${show.name} poster`" loading="lazy">
            <div v-else class="show-card__poster-fallback" aria-hidden="true">
                {{ $t('showDetail.noImage') }}
            </div>

            <div class="show-card__details">
                <div class="show-card__status" v-memo="[show.status, show.language]">
                    <span v-if="show.status">{{ show.status }}</span>
                    <span v-if="show.language">{{ show.language }}</span>
                </div>
                <h2>{{ show.name }}</h2>
                <p v-if="show.genres?.length" class="show-card__genres">
                    {{ genres }}
                </p>
                <div class="show-card__facts">
                    <span v-if="show?.rating?.average" class="show-card__rating">
                        <span aria-hidden="true">★</span> {{ show.rating.average }}
                    </span>
                    <span v-if="show?.averageRuntime || show?.runtime">
                        {{ show.averageRuntime || show.runtime }} min
                    </span>
                    <span v-if="show.premiered">
                        {{ premieredYear }}
                    </span>
                </div>
            </div>
        </div>
        <div v-if="show.summary" class="show-card__summary" v-html="show.summary"></div>
    </RouterLink>
</template>
<style scoped>
.show-card {
    display: block;
    box-sizing: border-box;
    min-width: 0;
    flex: 1 1 280px;
    padding: 1rem;
    background: linear-gradient(180deg, #ffffff 0%, #f8fbf9 100%);
    border: 1px solid #dfece6;
    border-radius: 14px;
    box-shadow: 0 8px 20px rgb(19 59 49 / 7%);
    color: inherit;
    overflow-wrap: anywhere;
    text-decoration: none;
    transition: box-shadow 180ms ease, transform 180ms ease, border-color 180ms ease;
}

.show-card:hover {
    border-color: #bfe0d4;
    box-shadow: 0 12px 26px rgb(19 59 49 / 12%);
    transform: translateY(-2px);
}

.show-card:focus-visible {
    outline: 3px solid #287d68;
    outline-offset: 3px;
}

.show-card__main {
    display: grid;
    grid-template-columns: 92px minmax(0, 1fr);
    gap: 0.9rem;
    align-items: start;
}

.show-card__poster,
.show-card__poster-fallback {
    display: block;
    width: 92px;
    aspect-ratio: 2 / 3;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgb(18 61 54 / 10%);
}

.show-card__poster-fallback {
    display: grid;
    place-items: center;
    padding: 0.6rem;
    color: #53675c;
    background: linear-gradient(180deg, #edf6f1 0%, #e4efe9 100%);
    font-size: 0.74rem;
    text-align: center;
}

.show-card__details {
    min-width: 0;
}

.show-card__status,
.show-card__facts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 0.6rem;
    color: #53675c;
    font-size: 0.76rem;
    line-height: 1.4;
}

.show-card__status {
    margin-bottom: 0.5rem;
    text-transform: capitalize;
}

.show-card__status span {
    display: inline-flex;
    align-items: center;
    padding: 0.18rem 0.45rem;
    border-radius: 999px;
    background: #edf6f1;
    color: #285a4e;
    font-weight: 600;
}

.show-card h2 {
    margin: 0 0 0.45rem;
    font-size: 1.18rem;
    line-height: 1.3;
    color: #173c35;
}

.show-card__genres {
    margin: 0 0 0.7rem;
    color: #385a4d;
    font-size: 0.84rem;
    line-height: 1.4;
}

.show-card__facts {
    align-items: center;
}

.show-card__rating {
    color: #8a6512;
    font-weight: 800;
}

.show-card__summary {
    display: -webkit-box;
    margin-top: 0.9rem;
    overflow: hidden;
    color: #3a5047;
    font-size: 0.9rem;
    line-height: 1.55;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
}

.show-card__summary :deep(p) {
    margin: 0;
}
</style>