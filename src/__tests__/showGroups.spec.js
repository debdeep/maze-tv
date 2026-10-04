import { describe, expect, it } from 'vitest';
import { groupShowsByGenre } from '../utils/groupShowsByGenre.js';

describe('groupShowsByGenre', () => {
    it('groups shows into every genre and sorts each group by rating descending', () => {
        const shows = [
            { id: 1, name: 'Under the Dome', genres: ['Drama', 'Science-Fiction'], rating: { average: 6.6 } },
            { id: 2, name: 'Top Drama', genres: ['Drama'], rating: { average: 8.8 } },
            { id: 3, name: 'Unrated Drama', genres: ['Drama'] },
        ];

        const groups = groupShowsByGenre(shows);

        expect(groups.map(group => group.genre)).toEqual(['Drama', 'Science-Fiction']);
        expect(groups[0].shows.map(show => show.name)).toEqual([
            'Top Drama',
            'Under the Dome',
            'Unrated Drama',
        ]);
        expect(groups[1].shows.map(show => show.name)).toEqual(['Under the Dome']);
    });

    it('places shows with no genres in an unclassified group', () => {
        const groups = groupShowsByGenre([
            { id: 1, name: 'No Genre', genres: [] },
        ]);

        expect(groups).toEqual([
            { genre: null, shows: [{ id: 1, name: 'No Genre', genres: [] }] },
        ]);
    });
});