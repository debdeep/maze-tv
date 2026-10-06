export interface ShowImage {
    medium?: string;
    original?: string;
}

export interface ShowRating {
    average?: number | null;
}

export interface ShowSchedule {
    days?: string[];
    time?: string | null;
}

export interface ShowNetwork {
    name?: string;
}

export interface Show {
    id: number;
    name: string;
    type?: string;
    language?: string;
    status?: string;
    genres?: string[];
    summary?: string;
    image?: ShowImage;
    rating?: ShowRating;
    averageRuntime?: number | null;
    runtime?: number | null;
    premiered?: string;
    ended?: string;
    schedule?: ShowSchedule;
    network?: ShowNetwork;
    webChannel?: ShowNetwork;
    officialSite?: string;
}

export interface GenreGroup {
    genre: string;
    shows: Show[];
}
