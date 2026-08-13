# Portfolio audit follow-ups

Created: 2026-06-15

Last reviewed: 2026-07-21

Keep only open work detailed here. Treat linked source files as authoritative instead of copying inventories that drift; keep completed work as short history. Update the review date when this checklist changes materially.

## Open — owner or design decision

- [ ] **Designed social-share image**
  - Current Open Graph and Twitter tags use the portrait profile photo rather than a purpose-built 1200×630 card.
  - Add `public/og-card.webp`, then update the static fallback and route-aware SEO metadata after visual approval.

- [ ] **Project screenshot consistency**
  - Referenced screenshots use several close aspect ratios. Exact files and intrinsic dimensions live in `public/data.json`; do not maintain a duplicate file-by-file list here.
  - If a uniform ratio becomes a requirement, re-export without cropping meaningful content and add an automated ratio-tolerance check.

- [ ] **Project-card content-length guidance**
  - Long cards remain readable but create substantial mobile scrolling.
  - Agree on concise editorial guidance for summaries/highlights before enforcing limits; do not truncate accessible content in CSS.

## Open — live verification and performance

- [ ] **Accessibility and native-device pass**
  - Chromium layout probes passed on 2026-07-21 for `/` and `/projects` at 320, 360, 390, 568, 569, and 768px: no horizontal overflow, cards stayed in bounds, and tested controls were at least 44px.
  - Still required: axe and Lighthouse on mobile/desktop, a documented keyboard pass, screen-reader smoke testing, and physical iOS/Android checks for safe areas and orientation changes.

- [ ] **Responsive image sizing**
  - Project sources are 1000–2002px wide and the contact image is much wider, while rendered cards/content are roughly 320–540px wide.
  - Prefer visually reviewed 1×/2× exports or responsive sources; preserve intrinsic dimensions and verify that compression does not blur text.

## Open — maintenance

- [ ] **Generated sitemap dates**
  - `public/sitemap.xml` has manually maintained `lastmod` values that will drift.
  - Generate them from a stable content/release source instead of periodically hand-editing dates.

- [ ] **Production error breadcrumbs decision**
  - Terser removes `console.*` in production, including deliberate fetch-error diagnostics; user-facing error states still render.
  - Keep this privacy/noise trade-off unless production diagnostics become a requirement, then preserve only intentional warnings/errors.

- [ ] **Local deploy helper drift**
  - If the gitignored `deploy.sh` remains, keep it a thin wrapper around `scripts/deploy-gh-pages.ts` or remove it; do not maintain parallel deployment logic.

## Watch only — no current action

- `TheProjectCard.getTechIconUrl` performs a small linear lookup per icon. Current data volume is trivial; consider a map only if the catalogue grows enough to measure a problem.

## Completed

- [x] Self-hosted all technology icons from a pinned devicon release; removed runtime CDN hints and requests.
- [x] Self-hosted Comfortaa 400/600/700 with preload, `font-display: swap`, and no Google Fonts requests.
- [x] Added intrinsic dimensions to project, profile, and contact images to reserve layout space.
- [x] Added PR CI and aligned Bun frozen installs and GitHub Pages deployment tooling.
- [x] Added route fallback, resilient English i18n fallback, route-aware canonical/Open Graph metadata, and related tests.
- [x] Improved contrast, external-link cues, decorative-image semantics, reduced motion, mobile navigation, safe-area handling, and filter state semantics.
- [x] Removed orphaned project images and unnecessary focus/tab behavior from non-interactive technology icons.
