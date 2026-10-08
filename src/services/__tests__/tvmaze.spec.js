import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchShowById, fetchShowsPage } from '../tvmaze.js';

afterEach(() => vi.unstubAllGlobals());

describe('TVmaze service', () => {
    it('fetches a show-list page and returns its data', async () => {
        const shows = [{ id: 1, name: 'Under the Dome' }];
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => shows,
        }));

        await expect(fetchShowsPage(2)).resolves.toEqual(shows);
        expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows?page=2');
    });

    it('returns null when a later show-list page does not exist', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));

        await expect(fetchShowsPage(1)).resolves.toBeNull();
    });

    it('throws when the first show-list page request fails', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));

        await expect(fetchShowsPage(0)).rejects.toThrow('Show list request failed');
    });

    it('fetches a show by ID and returns its data', async () => {
        const show = { id: 42, name: 'Under the Dome' };
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: async () => show,
        }));

        await expect(fetchShowById('42')).resolves.toEqual(show);
        expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows/42');
    });

    it('throws when a show detail request fails', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

        await expect(fetchShowById('42')).rejects.toThrow('Show request failed');
    });
});
