import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import ShowCard from '../ShowCard.vue';
import { mountComponent } from './test-utils.js';

const ShowDetailLinkStub = defineComponent({
    props: { to: { type: Object, required: true } },
    setup(props, { slots }) {
        return () => h('a', {
            'data-route-name': props.to.name,
            'data-show-id': props.to.params.id,
        }, slots.default?.());
    },
});

describe('ShowCard', () => {
    it('renders show details, summary, and a translated poster fallback', () => {
        const wrapper = mountComponent(ShowCard, {
            props: {
                show: {
                    id: 1,
                    name: 'Under the Dome',
                    genres: ['Drama', 'Science-Fiction'],
                    rating: { average: 6.6 },
                    summary: '<p>A small town is sealed off.</p>',
                },
            },
            global: { stubs: { RouterLink: ShowDetailLinkStub } },
        });

        expect(wrapper.text()).toContain('Under the Dome');
        expect(wrapper.text()).toContain('Drama · Science-Fiction');
        expect(wrapper.text()).toContain('6.6');
        expect(wrapper.text()).toContain('A small town is sealed off.');
        expect(wrapper.text()).toContain('No image available');
        expect(wrapper.attributes('data-route-name')).toBe('show-detail');
        expect(wrapper.attributes('data-show-id')).toBe('1');
    });

    it('renders optional poster and metadata while omitting empty facts', () => {
        const wrapper = mountComponent(ShowCard, {
            props: {
                show: {
                    id: 2,
                    name: 'Quiet Season',
                    status: 'Running',
                    language: 'English',
                    genres: [],
                    rating: { average: 0 },
                    averageRuntime: 42,
                    premiered: '2024-03-12',
                    image: { medium: 'https://example.com/poster.jpg' },
                },
            },
        });

        expect(wrapper.get('img').attributes('src')).toBe('https://example.com/poster.jpg');
        expect(wrapper.get('img').attributes('alt')).toBe('Quiet Season poster');
        expect(wrapper.text()).toContain('Running');
        expect(wrapper.text()).toContain('English');
        expect(wrapper.text()).toContain('42 min');
        expect(wrapper.text()).toContain('2024');
        expect(wrapper.find('.show-card__genres').exists()).toBe(false);
        expect(wrapper.find('.show-card__rating').exists()).toBe(false);
        expect(wrapper.find('.show-card__summary').exists()).toBe(false);
    });
});
