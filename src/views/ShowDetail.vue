<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Api } from '../utils/ApiConstants.js';
import type { Show } from '../types/show';

const route = useRoute();
const show = ref<Show | null>(null);
const loading = ref<boolean>(true);
const error = ref<boolean>(false);

async function loadShow(id?: string | string[]): Promise<void> {
    const resolvedId = Array.isArray(id) ? id[0] : id;
    if (!resolvedId) {
        error.value = true;
        loading.value = false;
        return;
    }

    show.value = null;
    error.value = false;
    loading.value = true;

    try {
        const response = await fetch(Api.showById(resolvedId));
        if (!response.ok) {
            throw new Error('Show request failed');
        }
        show.value = (await response.json()) as Show;
    } catch {
        error.value = true;
    } finally {
        loading.value = false;
    }
}

watch(() => route.params.id, (id) => loadShow(id), { immediate: true });
</script>

<template>
    <section class="show-detail" aria-labelledby="show-title">
        <RouterLink class="show-detail__back" to="/shows">
            {{ $t('showDetail.backToShows') }}
        </RouterLink>

        <p v-if="loading" class="show-detail__message" role="status">
            {{ $t('showDetail.loading') }}
        </p>
        <div v-else-if="error" class="show-detail__message" role="alert">
            <p>{{ $t('showDetail.loadError') }}</p>
            <button type="button" @click="loadShow(route.params.id)">
                {{ $t('showDetail.retry') }}
            </button>
        </div>

        <article v-else-if="show" class="show-detail__content">
            <div class="show-detail__panel">
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
                        :src="show.image.original || show.image.medium"
                        :alt="$t('showDetail.posterAlt', { name: show.name })">
                    <div v-else class="show-detail__poster-fallback">
                        {{ $t('showDetail.noImage') }}
                    </div>

                    <div class="show-detail__information">
                        <p v-if="show.genres?.length" class="show-detail__genres">
                            {{ show.genres.join(' · ') }}
                        </p>

                        <dl class="show-detail__facts">
                            <div v-if="show.rating?.average">
                                <dt>{{ $t('showDetail.rating') }}</dt>
                                <dd><span aria-hidden="true">★</span> {{ show.rating.average }}</dd>
                            </div>
                            <div v-if="show.averageRuntime || show.runtime">
                                <dt>{{ $t('showDetail.runtime') }}</dt>
                                <dd>{{ $t('showDetail.runtimeValue', { minutes: show.averageRuntime || show.runtime })
                                    }}
                                </dd>
                            </div>
                            <div v-if="show.premiered">
                                <dt>{{ $t('showDetail.premiered') }}</dt>
                                <dd>{{ show.premiered }}</dd>
                            </div>
                            <div v-if="show.ended">
                                <dt>{{ $t('showDetail.ended') }}</dt>
                                <dd>{{ show.ended }}</dd>
                            </div>
                            <div v-if="show.schedule?.days?.length || show.schedule?.time">
                                <dt>{{ $t('showDetail.schedule') }}</dt>
                                <dd>
                                    <span v-if="show.schedule.days?.length && show.schedule.time">
                                        {{ $t('showDetail.scheduleDaysTime', {
                                            days: show.schedule.days.join(' · '), time: show.schedule.time
                                        }) }}
                                    </span>
                                    <span v-else-if="show.schedule.days?.length">
                                        {{ $t('showDetail.scheduleDays', { days: show.schedule.days.join(' · ') }) }}
                                    </span>
                                    <span v-else>
                                        {{ $t('showDetail.scheduleTime', { time: show.schedule.time }) }}
                                    </span>
                                </dd>
                            </div>
                            <div v-if="show.network?.name || show.webChannel?.name">
                                <dt>{{ $t('showDetail.network') }}</dt>
                                <dd>{{ show.network?.name || show.webChannel?.name }}</dd>
                            </div>
                        </dl>

                        <a v-if="show.officialSite" class="show-detail__official-site" :href="show.officialSite"
                            target="_blank" rel="noopener noreferrer">
                            {{ $t('showDetail.officialSite') }}
                        </a>
                    </div>
                </div>
            </div>

            <section v-if="show.summary" class="show-detail__summary">
                <h2>{{ $t('showDetail.about') }}</h2>
                <div v-html="show.summary"></div>
            </section>
        </article>
    </section>
</template>

<style scoped>
.show-detail {
    box-sizing: border-box;
    max-width: 76rem;
    margin: 0 auto;
    padding: 1rem 0.5rem 2rem;
}

.show-detail__content {
    background: rgba(255, 255, 255, 0.68);
    border: 1px solid rgba(39, 91, 75, 0.08);
    border-radius: 24px;
    padding: clamp(1rem, 2vw, 2rem);
    box-shadow: 0 18px 34px rgba(17, 61, 50, 0.09);
    backdrop-filter: blur(2px);
}

.show-detail__panel {
    padding: clamp(0.5rem, 1vw, 1rem);
    border-radius: 18px;
    background: linear-gradient(180deg, rgba(242, 248, 245, 0.9), rgba(255, 255, 255, 0.78));
    border: 1px solid rgba(39, 91, 75, 0.06);
}

.show-detail__back {
    display: inline-flex;
    align-items: center;
    margin-bottom: 1.25rem;
    padding: 0.48rem 0.96rem;
    border-radius: 999px;
    background: rgba(23, 74, 67, 0.08);
    color: #174a43;
    font-weight: 700;
    text-decoration: none;
    transition: background-color 140ms ease, transform 140ms ease;
}

.show-detail__back:hover {
    background: rgba(23, 74, 67, 0.13);
    transform: translateX(-1px);
}

.show-detail__heading {
    margin-bottom: 1.5rem;
    padding: 0.4rem 0.2rem 0;
}

.show-detail__eyebrow {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 0.8rem;
    margin: 0 0 0.65rem;
    color: #53675c;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.show-detail__heading h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.1;
    color: #173c35;
}

.show-detail__layout {
    display: grid;
    grid-template-columns: minmax(180px, 260px) minmax(0, 1fr);
    align-items: start;
    gap: 1.6rem;
}

.show-detail__poster,
.show-detail__poster-fallback {
    display: block;
    width: 100%;
    aspect-ratio: 2 / 3;
    border-radius: 16px;
    object-fit: cover;
    box-shadow: 0 10px 25px rgba(18, 61, 54, 0.14);
}

.show-detail__poster-fallback {
    display: grid;
    place-items: center;
    color: #53675c;
    background: linear-gradient(180deg, #edf5f0 0%, #e2eee7 100%);
    border: 1px solid rgba(39, 91, 75, 0.08);
}

.show-detail__information {
    min-width: 0;
}

.show-detail__genres {
    margin: 0 0 1rem;
    color: #355549;
    font-weight: 700;
}

.show-detail__facts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem 1.25rem;
    margin: 0;
}

.show-detail__facts div {
    padding: 0.9rem 0.95rem;
    border-radius: 12px;
    background: rgba(23, 74, 67, 0.04);
    border: 1px solid rgba(23, 74, 67, 0.06);
}

.show-detail__facts dt {
    margin-bottom: 0.25rem;
    color: #53675c;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
}

.show-detail__facts dd {
    margin: 0;
    color: #1f3d37;
    font-weight: 600;
}

.show-detail__official-site {
    display: inline-block;
    margin-top: 1.3rem;
    color: #174a43;
    font-weight: 700;
    text-underline-offset: 0.24em;
}

.show-detail__summary {
    max-width: 72ch;
    margin-top: 1.75rem;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(39, 91, 75, 0.12);
    line-height: 1.75;
    color: #314b43;
}

.show-detail__summary h2 {
    margin: 0 0 0.75rem;
    font-size: 1.35rem;
    color: #173c35;
}

.show-detail__summary :deep(p) {
    margin: 0 0 0.8rem;
}

.show-detail__summary :deep(a) {
    color: #174a43;
}

.show-detail__summary :deep(ul),
.show-detail__summary :deep(ol) {
    margin: 0.7rem 0 0.9rem 1.2rem;
    padding: 0;
}

.show-detail__message {
    line-height: 1.6;
    color: #294c44;
}

.show-detail__message button {
    margin-top: 0.5rem;
    padding: 0.6rem 0.9rem;
    border: none;
    border-radius: 10px;
    background: #174a43;
    color: white;
    font-weight: 600;
    cursor: pointer;
}

@media (max-width: 600px) {
    .show-detail {
        padding: 0.5rem 0 1.5rem;
    }

    .show-detail__content {
        border-radius: 16px;
        padding: 1rem;
    }

    .show-detail__layout {
        grid-template-columns: minmax(0, 1fr);
        gap: 1rem;
    }

    .show-detail__poster,
    .show-detail__poster-fallback {
        width: min(100%, 220px);
        margin: 0 auto;
    }

    .show-detail__facts {
        grid-template-columns: minmax(0, 1fr);
        gap: 0.75rem;
    }

    .show-detail__heading h1 {
        font-size: 1.9rem;
    }
}
</style>