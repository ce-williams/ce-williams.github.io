# Curtis Williams · Portfolio

A lean, static portfolio for applied AI and systems work, with **19 real UI screenshots across five projects**, responsive carousels, an expanded gallery, and concise technical case studies.

- **Website:** https://ce-williams.github.io/
- **Repository:** https://github.com/ce-williams/ce-williams.github.io
- No runtime dependencies, analytics, server, or accounts.

## Run and publish

```sh
node scripts/build-gallery.mjs
node scripts/preview.mjs
```

Open http://127.0.0.1:4314. Set `PORT` to use another port.

Push to `master` to deploy through `.github/workflows/pages.yml`. GitHub **Settings → Pages → Source** must be **GitHub Actions**. The workflow regenerates the HTML, packages only public files into `_site/`, and publishes that artifact. Capture sources, local databases, helper scripts, and provenance are excluded from the deployed artifact.

## Update content

| File | Purpose |
| --- | --- |
| `data/projects.json` | Project copy, maturity labels, stack, links, screenshot order, alt text, captions, and data notes |
| `scripts/page-shell.html` | Hero, positioning, contact links, metadata, and page structure |
| `assets/portfolio.css` | Portfolio layout and visual style |
| `assets/project-gallery.css` | Scoped project cards, carousels, and dialog styles |
| `assets/project-gallery.js` | Dependency-free gallery enhancement |
| `projects-section.html` | Generated drop-in section for reuse |
| `assets/projects/<slug>/` | Full-size WebP screenshots and 720-pixel responsive variants |

Edit the manifest or shell, run `node scripts/build-gallery.mjs`, and commit the generated files. Use `node scripts/build-site.mjs` to inspect the exact public deployment in `_site/`. All asset paths are relative, with the homepage at `https://ce-williams.github.io/`. The previous `/CW2027/` site redirects here.

Without JavaScript the screenshots remain horizontally scrollable, image links open the original WebPs, source links work, and native case-study disclosures remain available. Enhancement adds arrows, slide selectors, mouse dragging, native touch swipes, keyboard navigation, filtering, and an expanded native dialog. Nothing autoplays. Reduced motion is respected.

## Screenshot provenance

All images were captured with Playwright from actual locally running interfaces at **1440 × 960**, then encoded with Sharp to WebP at quality 86, plus 720-pixel variants. Application content and network responses were not mocked or rewritten. The capture script uses fresh browser contexts, avoiding existing personal browser storage. Your public GitHub avatar is stored locally as `assets/curtis-williams.webp`.

| Project | Source and captured workflow | Data / maturity |
| --- | --- | --- |
| Market Intelligence | Local `market-intelligence-dashboard` checkout of the linked repository: overview, scanner, hypothesis lab, portfolio risk | Repository's historical price export; no private holdings or saved research. Research-only, no order routing. |
| Referral | Existing local Next.js static export: overview, fit breakdown, profile, opportunities | Bundled synthetic Technology workspace; browser-local demo. |
| Powderline | Local static app: camera wall, Copper Mountain filter, camera-only mode | Actual provider camera images, including nighttime imagery at capture time; availability and conditions feeds remain explicitly limited. |
| EasyEcom | Existing local POC static export: storefront, collection, product, bag | Après Club concept catalog; demonstration bag, payments disabled. |
| SimpleSLP | Isolated source copy with a newly seeded synthetic database: case, goals, visits, outcomes | Fictional patients only, offline mock AI default; not validated for clinical use. |

`data/capture-provenance.json` records the capture URL, time, viewport, title, source checkout, and data notes per image. Local working trees/exports can differ from GitHub; the record describes the source actually captured. No project needed an illustrative fallback.

## Recapture

The portfolio does not require installing packages. Capture and browser verification use the pinned development dependencies in `package.json`: install with your usual Node package manager, then install Playwright Chromium (`pnpm exec playwright install chromium`, or the equivalent for your manager). Alternatively set `CHROME_PATH` to an existing Chrome executable. `CAPTURE_NODE_MODULES` can point to an existing absolute `node_modules` directory containing Playwright and Sharp.

1. Start each source project using its own README. Prefer an existing static export for Referral and EasyEcom. Use `scripts/serve-project-exports.mjs` to retain the exports' expected URL prefixes:

   ```sh
   REFERRAL_EXPORT=/absolute/path/referral/out \
   EASYECOM_EXPORT=/absolute/path/EasyEcom/out \
   POWDERLINE_SOURCE=/absolute/path/powderline \
   MARKET_SOURCE=/absolute/path/market-intelligence-dashboard \
   node scripts/serve-project-exports.mjs
   ```

   This serves `/referral/`, `/EasyEcom/`, `/powderline/`, and `/market-intelligence/` on port 4310. If exports are absent, build their explicit demo/Pages mode according to their READMEs; do not bypass normal production-auth guards.

2. For SimpleSLP, copy its source into an ignored capture directory, exclude `.git`, `.next`, dependencies, environment files, and all existing databases, and install/link compatible dependencies there. Run its `scripts/setup.ts` to generate a **fresh synthetic database**, then run Next.js on port 4312. The existing machine's native SQLite dependency requires Node 20. Never capture real patient information. Use `python3 scripts/prepare-captures.py --simpleslp /absolute/path/simpleSLP` to prepare the isolated source copy.

3. Check `data/capture-plan.json` for URLs and UI navigation. Default origins can be overridden with `MARKET_URL`, `REFERRAL_URL`, `POWDERLINE_URL`, `EASYECOM_URL`, and `SIMPLESLP_URL`.

4. Capture all projects, or pass selected slugs:

   ```sh
   node scripts/capture-projects.mjs
   node scripts/capture-projects.mjs referral easyecom
   node scripts/build-gallery.mjs
   ```

5. Inspect the resulting screenshots and captions. Confirm that camera feeds actually loaded, demo boundaries are visible, and historical snapshots are described accurately. The script stops on UI errors and records successful captures incrementally. It does not fetch new financial data or call external AI providers.

## Verify

With the preview running:

```sh
node scripts/test-gallery.mjs
```

The browser checks cover image loading, desktop/mobile overflow, arrows, dots, keyboard wrapping, mouse drag, touch swipe, dialog focus containment and return, filters, disclosure panels, reduced motion, resize alignment, a no-JavaScript fallback, and a 4 MB total image budget. Reports and screenshots are written to ignored `.capture/qa/`. Set `GALLERY_URL` to test another serving origin. This is targeted verification, not a formal WCAG certification.

## Source status

The workspace initially contained no portfolio source. The previous ChatGPT-generated portfolio download was unavailable, so this implementation preserves the requested direction in a complete static portfolio rather than claiming to modify that inaccessible file. No experience metrics, employers, production-readiness claims, or hiring outcomes have been invented.

## Previous site files

The older coursework and portfolio directories remain in this repository and retain their original URLs. `data/legacy-paths.json` lists the directories copied into the Pages artifact alongside the new homepage. The existing Git history is preserved.

## Professional experience and CV

`data/experience.json` is the shared source for the career section and downloadable CV. It summarizes the LinkedIn profile reviewed October 20, 2026. It includes roles, dates, selected achievements, education, and certifications, with no private phone number or email. Update this manifest and run `node scripts/build-gallery.mjs`. To regenerate the PDF, run `python3 scripts/build-cv.py` with ReportLab installed, render and inspect `output/pdf/curtis-williams-cv.pdf`, then commit the refreshed `assets/curtis-williams-cv.pdf`. Normal Pages builds use the committed PDF and require no Python dependencies.
