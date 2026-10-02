export const Api = {
    showList: "https://api.tvmaze.com/shows?",
    showById: (id) => `https://api.tvmaze.com/shows/${encodeURIComponent(id)}`
}