import { Api } from '../utils/ApiConstants.js';

export async function fetchShowsPage(page) {
    const response = await fetch(Api.showList(page));

    if (response.status === 404 && page > 0) return null;
    if (!response.ok) throw new Error('Show list request failed');

    return response.json();
}

export async function fetchShowById(id) {
    const response = await fetch(Api.showById(id));

    if (!response.ok) throw new Error('Show request failed');

    return response.json();
}
