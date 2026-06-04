# Angelica's Software Development Portfolio

Personal software development portfolio built with Vue 3, Vue Router, Vite, Bun, Vitest, Biome, and GitHub Pages.

Live site: https://yumeangelica.github.io

Status: Active public portfolio

## Overview

This repository contains my public portfolio site, selected project cards, and career-facing copy. The site presents web, full-stack, Python automation, and supporting learning projects in a recruiter-friendly format.

The portfolio is intentionally public-safe. It should not contain employer-internal code, private project data, secrets, API keys, customer details, proprietary system names, or unpublished workplace information.

## Tech stack

### Frontend

- Vue 3
- Vue Router
- JavaScript
- Modern CSS
- Vite

### Content

- Project data in `public/data.json`
- UI text and SEO copy in `public/messages_en.json`
- Static assets under `public/assets`

### Testing and quality

- Vitest
- Vue Test Utils
- Biome linting and formatting
- Content validation tests
- SEO tests
- Production build checks

### Delivery

- Bun package manager
- GitHub Actions
- GitHub Pages deployment

## Getting started

Install dependencies:

```bash
bun install --frozen-lockfile
```

Start local development:

```bash
bun run dev
```

Run checks:

```bash
bun run lint
bun run test
bun run build
```

Preview the production build:

```bash
bun run preview
```

## Accessibility

Current accessibility considerations include:

- Skip link to main content
- Semantic page sections and headings
- Keyboard-focus styles for interactive elements
- Alt text for meaningful images and technology icons
- Responsive layout for smaller screens
- Component tests and content checks for selected UI behavior

Known improvement areas:

- Add a documented manual keyboard-navigation checklist
- Add contrast review notes after visual updates
- Add project-card content-length guidance for readability

## Security, privacy, and public-safety notes

- This repository is public and must not contain secrets, tokens, API keys, cookies, private data, or employer-internal details.
- Employer references should stay public-safe and use `OP Pohjola` where the current employer is mentioned.
- Project cards should not publish target-specific scraping details, bypass wording, fake-traffic wording, or private operational details.
- Automation projects should be described as allowed public-source monitoring, data extraction, parsing, persistence, and notifications with responsible-use boundaries.
- Dependency updates should be reviewed through lockfile changes, local checks, and pull request review.

## AI-assisted development note

AI-assisted tools may be used for planning, debugging, documentation, and review support. I review, test, and validate changes before keeping them.

## Content update workflow

Most public copy lives in:

- `public/messages_en.json` for home page, navigation, SEO, and labels
- `public/data.json` for project cards and technology metadata
- `README.md` for repository-level explanation
- `index.html` and `src/seo.js` for fallback SEO metadata

After editing copy, run:

```bash
bun run lint
bun run test
bun run build
```

## Release flow

Release push scripts run lint, tests, and a production build locally before pushing a branch. After a pull request is merged into `main`, GitHub Actions builds the site and deploys the `dist` output to the `gh-pages` branch.

## License

MIT
