export function groupShowsByGenre(shows) {
    // object to hold groups
    const groups = {};

    for (const show of shows) {
        // Use genres if available, otherwise put in "Other"
        const genres = show.genres?.length ? [...new Set(show.genres)] : ["Other"];

        for (const genre of genres) {
            if (!groups[genre]) {
                groups[genre] = [];
            }
            groups[genre].push(show);
        }
    }

    // Converting groups into an array of { genre, shows }
    return Object.entries(groups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([genre, genreShows]) => ({
            genre,
            shows: genreShows.sort((a, b) => {
                // Sorting by rating first, then by name
                const ratingA = a.rating?.average ?? -Infinity;
                const ratingB = b.rating?.average ?? -Infinity;
                if (ratingA !== ratingB) return ratingB - ratingA;
                return a.name.localeCompare(b.name);
            }),
        }));
}
