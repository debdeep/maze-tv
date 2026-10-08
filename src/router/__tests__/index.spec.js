import { beforeEach, describe, expect, it } from 'vitest';
import router, { visitedRoutes } from '../index.js';

beforeEach(async () => {
    await router.replace('/shows');
    visitedRoutes.splice(0);
});

describe('router route tracking', () => {
    it('redirects the root route and records each path only once', async () => {
        await router.push('/');

        expect(router.currentRoute.value.path).toBe('/shows');
        expect(visitedRoutes).toEqual([{ path: '/shows' }]);

        const duplicateNavigation = await router.push('/shows');

        expect(duplicateNavigation).toBeTruthy();
        expect(visitedRoutes).toEqual([{ path: '/shows' }]);
    });

    it('does not add the history page to visited routes', async () => {
        await router.push('/history');

        expect(router.currentRoute.value.name).toBe('history');
        expect(visitedRoutes).toEqual([]);
    });

    it('tracks show detail and not-found routes', async () => {
        await router.push('/shows/42');
        await router.push('/missing-page');

        expect(router.currentRoute.value.name).toBe('not-found');
        expect(visitedRoutes).toEqual([
            { path: '/shows/42' },
            { path: '/missing-page' },
        ]);
    });
});
