# My Web Development Portfolio

Personal web development portfolio built with Vue 3 and Vite. Live site: https://yumeangelica.github.io

## Overview

- Intro section and project showcase
- Reusable Vue components with a simple layout
- UI copy stored in JSON for easy updates

## Tech Stack

- Vue 3 + Vue Router
- Vite
- Bun (package manager)
- JavaScript
- Bootstrap 5 + CSS
- GitHub Pages (hosting)

## Scripts

- `bun install` - install dependencies
- `bun run dev` - start local dev server
- `bun run lint` - run Biome lint
- `bun run build` - production build
- `bun run preview` - preview production build
- `bun run test` - run tests
- `bun run deploy` - build and deploy to GitHub Pages

## Internationalization

UI strings live in [public/messages_en.json](public/messages_en.json). Add a new language by adding another JSON file and wiring it in [src/i18n.js](src/i18n.js).

## Testing

Component tests use Vitest and Vue Test Utils. See [src/__tests__](src/__tests__).

## Contact

Contact details are listed on the portfolio site.
