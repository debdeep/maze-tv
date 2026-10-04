# Maze TV

Maze TV is a client-side Vue application for browsing TV shows from the [TVmaze API](https://api.tvmaze.com/). It provides paginated show listings, search, a rating filter, show details, and an in-session route history.

## Architecture Decisions

- **Vue 3 and the Composition API:** Single-file components keep the interface split by responsibility. Vue reactivity manages show data, search, filters, pagination, and route history.
- **Vite:** Vite provides the Vue-aware development server with hot-module replacement and bundles the production app. The `@` alias resolves to `src/`.
- **Vue Router:** Client-side routes separate list, detail, and history views. Route components are lazy-loaded so each view can be loaded when needed.
- **Vue I18n:** UI messages are kept in JSON catalogs. English (`en`) is the default locale; `dt` is the project's Dutch locale key.
- **TVmaze API:** The browser calls TVmaze directly, so this application does not require a backend. An internet connection is needed for show listings and details.
- **Vitest and Vue Test Utils:** Unit tests run in jsdom. The existing test is a starter app-mount test; feature behavior should receive focused tests as it is developed.

## Routes and History

- `/` redirects to `/shows`.
- `/shows` displays the dashboard and show list.
- `/shows/:id` loads details for the TVmaze show with that ID.
- `/history` lists unique routes visited during the current app session. The history page itself is not added to the list; entries are held in memory and reset when the app reloads.

Show cards use router links to open the corresponding dynamic detail route. The detail page fetches the record by ID and presents available metadata, including the poster, genres, rating, runtime, schedule, and synopsis.

## Show Data and Pagination

The first show request uses TVmaze's zero-based endpoint, `https://api.tvmaze.com/shows?page=0`. The separate `Pagination.vue` component presents Previous and Next controls; `ShowsList.vue` owns the current page and requests the selected page. The displayed page number is one-based for readers, while requests remain zero-based. Previous is disabled on page zero. Next remains available for non-empty pages and is disabled when the API indicates there are no further results.

Search and the rating filter run against the shows currently loaded from the API. Changing pages requests a new set of shows and returns focus to the search field after a successful load.

## Responsive and Accessible UI

The show list uses a wrapping Flexbox layout, with one full-width card per row on narrow screens. Search and pagination controls provide touch-sized targets, and interactive elements include visible keyboard focus styles. Header, footer, and card text use high-contrast colors.

## Requirements

- **Node.js:** `^22.18.0 || >=24.12.0`, as declared in `package.json`. This allows Node.js 22.18.x or newer in the 22.x line, or Node.js 24.12.0 and later.
- **npm:** The repository does not pin an npm version. Use npm 9 or newer, which supports the version 3 lockfile in `package-lock.json`. npm is normally installed with Node.js.

Check your local versions with:

```sh
node --version
npm --version
```

## Setup and Run

From the project root, install dependencies recorded in the lockfile:

```sh
npm ci
```

Start the development server with hot reload:

```sh
npm run dev
```

Vite prints the local URL in the terminal (normally `http://localhost:5173`).

## Tests and Production Build

Run unit tests once:

```sh
npm run test:unit -- --run
```

Create a production build:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

## Requirements

- **Node.js:** `^22.18.0 || >=24.12.0`, as declared in `package.json`. This means Node.js 22.18.x or later in the 22.x line, or 24.12.0 and later. Node.js 23.x and Node.js 24 versions earlier than 24.12.0 are outside the declared range.
- **npm:** The repository does not pin an npm version. Use npm 9 or newer, which supports the version 3 lockfile in `package-lock.json`. npm is normally installed with Node.js.

Check your local versions with:

```sh
node --version
npm --version
```

## Setup and Run

From the project root, install the exact dependency versions recorded in the lockfile:

```sh
npm ci
```

### Start the development server with hot reload:

```sh
npm run dev
```

Vite prints the local URL in the terminal (normally `http://localhost:5173`).

## Tests and Production Build

Run the unit tests once:

```sh
npm run test:unit -- --run
```

Run the production build:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

## Project Layout

- `src/components/` contains reusable interface components, including show cards, search, filters, pagination, and route history.
- `src/views/` contains the dashboard, history, and dynamic show-detail pages.
- `src/router/` defines client-side routes and in-session route tracking.
- `src/locales/` contains translation catalogs and Vue I18n setup.
- `src/utils/` contains API and application configuration constants.
- `src/__tests__/` contains Vitest unit tests.