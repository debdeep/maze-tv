# Maze TV

Maze TV is a client-side Vue based Web Application for browsing TV shows from the [TVmaze API](https://api.tvmaze.com/). It lists a dashboard of shows and includes a show search, a rating-based filter, and history of vistited routes.

## Architecture

- **Vue 3 and Composition API:** Vue SFC's keep the interface divided into focused pieces using SOLID principles wherever needed, while the Composition API manages reactive search, filtering, and show-list state and other Vue Eco system functionalities.
- **Vite:** Vite as a build tool provides the a robust HMR based Vue development server and production bundler. Its Vue plugin handles `.vue` files, and the `@` alias points to `src/`.
- **Vue Router:** Client-side routes separate the dashboard and history views. Views are loaded lazily to avoid loading every page up front keeping the bundle sizes smaller.
- **Vue I18n:** UI strings live in locale JSON files rather than being embedded in components. English (`en`) is the default locale; `dt` contains the Dutch translations.
- **TVmaze as the data source:** The browser fetches the show list directly from TVmaze. This keeps the project backend-free; using the app requires an internet connection and access to the TVmaze API.
- **Vitest and Vue Test Utils:** Unit tests run in jsdom, so Vue components can be tested without a browser. The current test is a starter mount test; add feature-specific tests as the app grows.

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

- `src/components/` contains reusable interface components such as the header, search bar, show cards, and filters.
- `src/views/` contains route-level pages.
- `src/router/` defines client-side routes.
- `src/locales/` contains language translations and Vue I18n setup.
- `src/utils/` contains API and application configuration constants.
- `src/__tests__/` contains Vitest unit tests.