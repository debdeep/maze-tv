<script setup>
import { computed } from 'vue';

const props = defineProps({
    show: {
        type: Object,
        required: true,
        default: () => ({})
    }
});
const show = props.show;
const genres = computed(() => show.genres?.join(' · ') || "");
const premieredYear = computed(() => show.premiered?.slice(0, 4) || "");
</script>

<template>
    <article class="show-card">
        <div class="show-card__main">
            <img v-if="show.image?.medium" v-once class="show-card__poster" :src="show.image.medium"
                :alt="`${show.name} poster`" loading="lazy">
            <div v-else class="show-card__poster-fallback" aria-hidden="true">No image</div>

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
    </article>
</template>
<style scoped>
.show-card {
    box-sizing: border-box;
    min-width: 0;
    flex: 1 1 280px;
    padding: 1rem;
    background-color: #fff;
    border: 1px solid #d9e6df;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgb(35 70 52 / 6%);
    overflow-wrap: anywhere;
}

.show-card__main {
    display: grid;
    grid-template-columns: 88px minmax(0, 1fr);
    gap: 1rem;
    align-items: start;
}

.show-card__poster,
.show-card__poster-fallback {
    display: block;
    width: 88px;
    aspect-ratio: 2 / 3;
    object-fit: cover;
    border-radius: 4px;
}

.show-card__poster-fallback {
    display: grid;
    place-items: center;
    padding: 0.5rem;
    color: #53675c;
    background-color: #e8f0eb;
    font-size: 0.8rem;
    text-align: center;
}

.show-card__status,
.show-card__facts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 0.65rem;
    color: #53675c;
    font-size: 0.8rem;
}

.show-card__status {
    margin-bottom: 0.45rem;
    text-transform: capitalize;
}

.show-card h2 {
    margin: 0 0 0.4rem;
    font-size: 1.2rem;
    line-height: 1.25;
}

.show-card__genres {
    margin: 0 0 0.65rem;
    color: #354c3f;
    font-size: 0.875rem;
    line-height: 1.4;
}

.show-card__facts {
    align-items: center;
}

.show-card__rating {
    color: #805c16;
    font-weight: 700;
}

.show-card__summary {
    display: -webkit-box;
    margin-top: 0.85rem;
    overflow: hidden;
    color: #35443b;
    font-size: 0.9rem;
    line-height: 1.5;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
}

.show-card__summary :deep(p) {
    margin: 0;
}
</style>