<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Api } from '../utils/ApiConstants.js';

const route = useRoute();
const show = ref(null);
const loading = ref(true);
const error = ref('');

async function loadShow(id) {
    show.value = null;
    error.value = '';
    loading.value = true;

    try {
        const response = await fetch(Api.showById(id));
        if (!response.ok) {
            throw new Error('Show request failed');
        }
        show.value = await response.json();
    } catch {
        error.value = 'Unable to load this show. Check your connection and try again.';
    } finally {
        loading.value = false;
    }
}

watch(() => route.params.id, loadShow, { immediate: true });
</script>

<template>
    <section class="show-detail" aria-labelledby="show-title">
        <RouterLink class="show-detail__back" to="/shows">Back to shows</RouterLink>

        <p v-if="loading" class="show-detail__message" role="status">Loading show...</p>
        <div v-else-if="error" class="show-detail__message" role="alert">
            <p>{{ error }}</p>
            <button type="button" @click="loadShow(route.params.id)">Retry</button>
        </div>

        <article v-else-if="show" class="show-detail__content">
            <header class="show-detail__heading">
                <p class="show-detail__eyebrow">
                    <span v-if="show.type">{{ show.type }}</span>
                    <span v-if="show.language">{{ show.language }}</span>
                    <span v-if="show.status">{{ show.status }}</span>
                </p>
                <h1 id="show-title">{{ show.name }}</h1>
            </header>

            <div class="show-detail__layout">
                <img v-if="show.image?.original || show.image?.medium" class="show-detail__poster"
                    :src="show.image.original || show.image.medium" :alt="`${show.name} poster`">
                <div v-else class="show-detail__poster-fallback">No image available</div>

                <div class="show-detail__information">
                    <p v-if="show.genres?.length" class="show-detail__genres">
                        {{ show.genres.join(' · ') }}
                    </p>

                    <dl class="show-detail__facts">
                        <div v-if="show.rating?.average">
                            <dt>Rating</dt>
                            <dd><span aria-hidden="true">★</span> {{ show.rating.average }}</dd>
                        </div>
                        <div v-if="show.averageRuntime || show.runtime">
                            <dt>Runtime</dt>
                            <dd>{{ show.averageRuntime || show.runtime }} min</dd>
                        </div>
                        <div v-if="show.premiered">
                            <dt>Premiered</dt>
                            <dd>{{ show.premiered }}</dd>
                        </div>
                        <div v-if="show.ended">
                            <dt>Ended</dt>
                            <dd>{{ show.ended }}</dd>
                        </div>
                        <div v-if="show.schedule?.days?.length || show.schedule?.time">
                            <dt>Schedule</dt>
                            <dd>
                                {{ show.schedule.days?.join(' · ') }}
                                <span v-if="show.schedule.time"> at {{ show.schedule.time }}</span>
                            </dd>
                        </div>
                        <div v-if="show.network?.name || show.webChannel?.name">
                            <dt>Network</dt>
                            <dd>{{ show.network?.name || show.webChannel?.name }}</dd>
                        </div>
                    </dl>

                    <a v-if="show.officialSite" class="show-detail__official-site" :href="show.officialSite"
                        target="_blank" rel="noopener noreferrer">
                        Visit official site
                    </a>
                </div>
            </div>

            <section v-if="show.summary" class="show-detail__summary">
                <h2>About</h2>
                <div v-html="show.summary"></div>
            </section>
        </article>
    </section>
</template>

<style scoped>
.show-detail {
    box-sizing: border-box;
    max-width: 72rem;
    margin: 0 auto;
    padding: 1rem;
}

.show-detail__back {
    display: inline-block;
    margin-bottom: 1.25rem;
    color: #174a43;
    font-weight: 600;
    text-underline-offset: 0.2em;
}

.show-detail__heading {
    margin-bottom: 1.25rem;
}

.show-detail__eyebrow {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 0.75rem;
    margin: 0 0 0.5rem;
    color: #53675c;
    font-size: 0.9rem;
}

.show-detail__heading h1 {
    margin: 0;
    line-height: 1.2;
}

.show-detail__layout {
    display: grid;
    grid-template-columns: minmax(180px, 260px) minmax(0, 1fr);
    align-items: start;
    gap: 1.5rem;
}

.show-detail__poster,
.show-detail__poster-fallback {
    display: block;
    width: 100%;
    aspect-ratio: 2 / 3;
    border-radius: 6px;
    object-fit: cover;
}

.show-detail__poster-fallback {
    display: grid;
    place-items: center;
    color: #53675c;
    background-color: #e8f0eb;
}

.show-detail__genres {
    margin: 0 0 1rem;
    color: #354c3f;
    font-weight: 600;
}

.show-detail__facts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    margin: 0;
}

.show-detail__facts dt {
    margin-bottom: 0.2rem;
    color: #53675c;
    font-size: 0.85rem;
}

.show-detail__facts dd {
    margin: 0;
}

.show-detail__official-site {
    display: inline-block;
    margin-top: 1.25rem;
    color: #174a43;
    font-weight: 600;
    text-underline-offset: 0.2em;
}

.show-detail__summary {
    max-width: 75ch;
    margin-top: 1.5rem;
    line-height: 1.65;
}

.show-detail__summary h2 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
}

.show-detail__summary :deep(p) {
    margin: 0;
}

.show-detail__message {
    line-height: 1.5;
}

@media (max-width: 600px) {
    .show-detail {
        padding: 0.5rem 0;
    }

    .show-detail__layout {
        grid-template-columns: minmax(0, 1fr);
        gap: 1rem;
    }

    .show-detail__poster,
    .show-detail__poster-fallback {
        width: min(100%, 220px);
    }

    .show-detail__facts {
        grid-template-columns: minmax(0, 1fr);
        gap: 0.75rem;
    }
}
</style>