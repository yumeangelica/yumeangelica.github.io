# Portfolio Audit — Follow-ups

Date: 2026-06-15

This file tracks audit findings as a checklist. Tick a box (`- [x]`) when an item
is done, and add new findings under the matching priority group using the same
`- [ ]` / `- [x]` style as future audits surface them.

---

## High value, needs owner decision or larger change

- [x] **Self-host tech icons instead of `jsdelivr@latest`**
  - **Finding:** ~30 technology icons and the two home contact logos load at
    runtime from `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/...`.
    Risks: third-party availability, unpinned `@latest` drift, visitor IP/UA
    exposure to the CDN, and many cross-origin requests on the home page.
  - **Reason deferred:** Larger content change, and self-hosting is explicitly
    out of scope for this branch.
  - **Suggested next step:** Download the used devicon SVGs into
    `public/assets/logos/` (the repo already self-hosts Pinia / REST API /
    GitHub Actions logos) and relink them in `data.json`. If kept remote in the
    meantime, at least pin a devicon version instead of `@latest`.
  - **Resolved:** All 32 devicon technology icons are now self-hosted under
    `public/assets/logos/`, downloaded from devicon pinned to tag `v2.17.0` (not
    `@latest`) and kept at their canonical basenames (e.g.
    `python-original-wordmark.svg`). Every icon `url` in `public/data.json` now
    points at `/assets/logos/…`, so no technology icon is fetched from
    `cdn.jsdelivr.net` at runtime and no visitor IP is sent to the CDN. The now
    unused `preconnect` / `dns-prefetch` hints to `https://cdn.jsdelivr.net` were
    removed from `index.html`. (Also removed the unused `ionic-logo.svg`
    leftover from that directory, which was no longer referenced anywhere.)

- [x] **Font loading optimization**
  - **Finding:** Comfortaa is pulled via a render-blocking CSS `@import` in
    `src/main.css`, and `index.html` preconnects only to `cdn.jsdelivr.net`, not
    to the font origin (`fonts.googleapis.com` / `fonts.gstatic.com`).
  - **Reason deferred:** Requires live validation (font waterfall / FOIT check)
    and a small decision between (a) moving to a `<link rel="stylesheet">` plus
    gstatic preconnect in `index.html`, or (b) self-hosting the woff2 files.
    Self-hosting adds binary assets and is the strongest but largest option.
  - **Suggested next step:** At minimum add the gstatic/googleapis preconnect and
    move the font load out of CSS `@import`; ideally self-host the woff2.
  - **Resolved:** Chose option (b). Comfortaa is now self-hosted as woff2 under
    `public/fonts/` via `@font-face` in `src/main.css` (no CSS `@import`, no
    Google Fonts origin), with `comfortaa-latin-400.woff2` preloaded in
    `index.html`. No font request or visitor IP is sent to a third-party CDN.

- [ ] **Designed Open Graph / Twitter share image (1200×630)**
  - **Finding:** `og:image` / `twitter:image` currently point at the portrait
    profile photo, not a 1200×630 social card.
  - **Reason deferred:** Larger content/design change (needs a new image asset).
  - **Suggested next step:** Add a `public/og-card.webp` at 1200×630 and update
    the static tags in `index.html`. (Route-aware `og:url`, canonical,
    `og:image:alt`, and the Twitter card type were handled in this branch.)

---

## Requires live validation

- [ ] **Live axe and Lighthouse verification**
  - **Finding:** Contrast ratios in the audit were computed mathematically and
    responsive/visual findings came from reading the CSS. No browser-based axe or
    Lighthouse pass was run.
  - **Reason deferred:** Requires running the app and tooling in a real browser.
  - **Suggested next step:** `bun run dev`, then run axe-core and Lighthouse on
    `/` and `/projects` (mobile + desktop). Confirm the contrast fixes
    (project-card heading, error banner, mobile nav links), the project-grid CLS
    improvement from the intrinsic `width`/`height` attributes, and keyboard focus
    order on the home tech icons after removing `tabindex`.

- [ ] **Normalize project screenshots to a single aspect ratio**
  - **Finding:** The 8 project screenshots do not all share the exact same aspect
    ratio. Current ratios (width ÷ height) range from ~1.938 to ~1.949:
    - `2002 × 1030` (~1.9437): portfolio, django-weather-app, book-boutique
    - `2000 × 1032` (~1.9380): jirai-sweeties-discord-bot
    - `1000 × 513` (~1.9493): needypet
    - `1000 × 515` (~1.9417): store-data-extractor, fullstack-phonebook, weather-view
  - **Reason deferred:** Larger content change — requires re-exporting/recropping
    the source images. CLS is already correct per image via exact `width`/`height`
    attributes, so this is purely a visual-consistency cleanup, not a bug.
  - **Suggested next step:** Re-export all project screenshots to one shared ratio
    and matching pixel dimensions, then update `imageWidth`/`imageHeight` in
    `public/data.json` to match. Do not crop content in a way that loses the
    screenshot. Owner confirmation on the target ratio/size before re-exporting.

- [ ] **Image right-sizing for the heaviest referenced screenshots**
  - **Finding:** The referenced `store-data-extractor` (~196 KB) and
    `jirai-sweeties` (~147 KB) screenshots are larger than their ≤500px display
    size needs.
  - **Reason deferred:** Requires re-exporting binary assets and visual QA to
    confirm no quality regression. CLS is already handled in this branch via exact
    intrinsic `width`/`height` attributes per image; this item is purely
    transfer-size optimization.
  - **Suggested next step:** Re-export the heaviest referenced webp files at the
    display resolution and verify visually.

---

## Intentionally deferred to avoid broad visual/content changes

- [ ] **sitemap.xml lastmod maintenance**
  - **Finding:** `public/sitemap.xml` has hard-coded `<lastmod>2026-03-02</lastmod>`
    values that will go stale.
  - **Reason deferred:** Intentionally not changed here. Hand-editing the date now
    would just move the staleness; the real fix is generating the sitemap at build
    time, which is a build-pipeline addition beyond this cleanup branch's scope.
  - **Suggested next step:** Generate `sitemap.xml` during `bun run build` (or a
    small script) so `lastmod` reflects the latest content change.

- [x] **Home hero / contact image dimensions for CLS**
  - **Finding:** The home profile and contact images lacked explicit
    `width`/`height`, so the browser could not reserve their exact aspect ratios
    before loading them.
  - **Resolved:** Read the intrinsic WebP dimensions locally and added matching
    attributes in `src/pages/PageHome.vue`: profile `400 × 500`, contact
    `8072 × 767`. A component test now guards both values.
  - **Follow-up:** The contact image is only about 76 KB but has far more source
    pixels than its 320px display width needs. Re-export it near 640px wide after
    a visual comparison to reduce decode work without introducing blur or
    compression artifacts.

- [ ] **`getTechIconUrl` lookup efficiency**
  - **Finding:** `TheProjectCard.getTechIconUrl` does an O(n) `find` per tech icon
    per card.
  - **Reason deferred:** Trivial cost at current scale (~35 techs, a handful of
    cards); refactoring to a `Map` is not worth the churn now and would touch
    shared component/prop shape.
  - **Suggested next step:** If the data set grows, pass a `Map<title, url>` from
    the parent or memoize.

- [ ] **`drop_console: true` removes production error breadcrumbs**
  - **Finding:** Terser strips all `console.*` in production, including deliberate
    `console.error` calls for data/i18n fetch failures. User-facing error states
    still render.
  - **Reason deferred:** Intentional trade-off; current behavior is acceptable and
    changing it is optional.
  - **Suggested next step:** If production diagnostics are ever wanted, exclude
    `console.error`/`console.warn` via terser `pure_funcs` configuration.

- [ ] **`deploy.sh` (gitignored) mirrors `scripts/deploy-gh-pages.ts`**
  - **Finding:** A local bash deploy script duplicates the CI TypeScript deploy logic and
    can drift.
  - **Reason deferred:** Gitignored local convenience file; low risk, out of scope.
  - **Suggested next step:** Document that `deploy.sh` is a local-only mirror, or
    remove it in favor of the TypeScript script.

---

## Handled in this branch

- [x] Orphaned project images cleaned up: 8 unused screenshots moved out of the
  repo and the deployed `dist` (owner archived them elsewhere).
- [x] Added PR CI workflow (`.github/workflows/ci.yml`): frozen install, lint, typecheck,
  test, build.
- [x] `deploy.yml`: `bun ci` → `bun install --frozen-lockfile`.
- [x] Router catch-all redirect to home (+ test); fixed stale lazy-load comment.
- [x] Built-in minimal English i18n fallback when the primary message file fails (+ test).
- [x] Route-aware `og:url` + `<link rel="canonical">`, plus `og:image:alt` and a
  static `twitter:card` (summary_large_image) with twitter title/description (+ test).
- [x] Contrast fixes that meet AA: `--color-card-heading` for the project-card
  heading, `--color-primary-dark` for mobile nav links, and a darker error-text
  red; de-duplicated the `.error-message` style into `main.css`.
- [x] Project-card images: exact intrinsic `width`/`height` per image (from
  `data.json`) so the browser reserves correct space and avoids CLS.
- [x] Removed `tabindex="0"` from the non-interactive home tech icons (and the now-dead
  focus CSS).
- [x] Floating project nav: removed misused `role="menu"`/`role="menuitem"`; added
  `Esc`-to-close.
- [x] Decorative header banner now `aria-hidden` (was an exposed `role="img"`).
- [x] Consistent "(opens in new tab)" cues on project, certification, and contact
  external links.
- [x] Removed the focus `transform: scale(1.05)` layout nudge on focused links.
