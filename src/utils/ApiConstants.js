export const Api = {
    showList: (page = 0) => `https://api.tvmaze.com/shows?page=${page}`,
    showById: (id) => `https://api.tvmaze.com/shows/${encodeURIComponent(id)}`
}