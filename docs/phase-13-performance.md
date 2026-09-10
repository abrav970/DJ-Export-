# Phase 13 — Performance and production hardening

Measured against the production build (`next build` + `next start`), Chrome, DPR 1.25,
viewport 1521 × 742. Every number below was read from the page, not estimated.

---

## Before → After

| Metric | Before | After | Change |
| --- | --- | --- | --- |
| Homepage image bytes (first load) | 1830.0 KB | **1310.7 KB** | **−519.3 KB (−28%)** |
| Bytes spent on duplicate fetches | 410.6 KB | **72.4 KB** | **−338.2 KB (−82%)** |
| Files fetched at more than one width | 11 of 16 | 5 of 16 | −6 |
| JS transferred | 276.5 KB / 15 files | 276.5 KB / 15 files | unchanged |
| CSS transferred | 12.4 KB / 1 file | 12.4 KB / 1 file | unchanged |
| Fonts transferred | 122.6 KB / 3 files | 122.6 KB / 3 files | unchanged |
| CLS | 0 (0 shift entries) | **0 (0 shift entries)** | held |
| ScrollTriggers, homepage, motion on | — | 16 | — |
| ScrollTriggers, homepage, `reduce` | — | 3 | — |
| ScrollTriggers after client-side nav away | — | 1 | — |
| `loading="lazy"` images | — | 30 of 33 | — |

### What produced the image saving

Several sections render a desktop branch and a small-screen branch into the same
document and hide one with `display: none`. **A hidden `<img>` is still fetched**,
so both branches were downloading a real photograph. 410.6 KB of the homepage's
1830 KB of imagery — 22% — was a second copy of a picture the page already had.
The worst offenders were the five sourcing stages, each pulled once at 1920w for
the sticky panel and again at 1280w for the stacked list.

The fix was already in the codebase: `<Hero>` and `<Origin>` give the
non-rendering branch a `sizes` of `1px` so the browser resolves the smallest
candidate. It had simply never been applied to `Journey`, `ProductStory` or
`ProductSequence`. Doing so cut the waste to 230 KB.

The remaining 230 KB was a second bug hiding behind the first: **the decoy was
still pulling a 420-wide photograph.** Next builds the `srcset` from `deviceSizes`
whenever `sizes` contains a `vw` unit — `imageSizes` is not consulted — and
`deviceSizes` started at 420, so `1px` resolved to the smallest *real* device
width. Adding a 16-wide rung to `deviceSizes` gave the decoy something
genuinely small to land on, taking the waste to 72.4 KB.

The 16 is unreachable by accident: the smallest real branch resolves to `100vw`,
which on a 360px phone at DPR 3 asks for 1080. Only a 1px decoy can select it.

**Verified no regression:** every visible image still resolves to the same
candidate it did before (a 692px box still requests 1280w, a 1521px box still
requests 1920w). The saving is entirely from images that are not on screen.

### GSAP lifecycle

Measured by exposing `ScrollTrigger` temporarily, reading `getAll()`, and
reverting.

- **16 instances** on the homepage with motion enabled, across 10 distinct
  triggers. No accidental duplicates; the two-trigger sections (`Journey`,
  `ProductSequence`, `GlobalMarkets`) each show exactly two.
- **3 instances** under `prefers-reduced-motion: reduce` — the document progress
  bar, the product sequence's step readout and the sourcing journey's step
  readout. These are the three position readouts that are deliberately ungated.
  **Every scrubbed transform is correctly absent**, which is the `matchMedia`
  gating working as designed rather than as documented.
- **1 instance after a client-side navigation away** (16 → 1). The survivor is
  the document-level progress bar, which lives in the layout and should persist.
  Every page-level trigger was torn down. No leak.

### CLS

**0.0000, with zero layout-shift entries recorded**, on a page of 33 images and
11 KB of document height. Every image is slot-addressed through `<Media>`, which
carries its own aspect box, so nothing reflows on decode.

---

## Remaining issues

Ordered by size of the win, not by effort.

### 1. `cardamom-plantation.jpg` is 407 KB — 31% of all image bytes on the page

One photograph costs more than the entire JS bundle. The source is 1750 KB of
dense, high-frequency foliage, which is close to the worst case for AVIF: there
is no flat area to spend fewer bits on. Every other image on the page lands
between 8 KB and 143 KB.

**Fix:** re-encode at a lower quality (this image would tolerate q=60 where the
site default is 75), or replace the frame with one that has more tonal
separation. A shot with sky or shade behind the plant would encode at a third of
the size. This is a photography decision as much as an encoding one, and it is
already on `SHOTLIST.md`.

### 2. ~6.8 MB of unreferenced images ship in `public/`

Four files are in the repository and in every deployment but are referenced by
nothing:

| File | Size |
| --- | --- |
| `process/packed sack.png` | 2475 KB |
| `process/SHIP DEPARTURE IMAGE.png` | 2046 KB |
| `products/BLACK PEPPER HERO PRODUCT.png` | 1971 KB |
| `export/export-logistics.jpg` | 491 KB |

They cost nothing at runtime — nobody requests them — but they inflate the repo,
the build context and every deploy artefact.

**Not deleted.** They may be intended for slots not yet filled, and removing a
client's assets is the client's call. Flagged for a decision.

### 3. Seven source images are PNGs of photographs

`hero background.png`, `LOADING INTO CONTAINER.png`, `CONTAINER  SHIP IMAGE.png`
and the three unreferenced PNGs above are 2 MB each. PNG is lossless and wrong
for photography; the same frames as quality-90 JPEGs would be roughly a tenth
the size.

This does **not** affect delivered bytes — `next/image` re-encodes to AVIF/WebP
regardless — but it does affect build time, memory during optimisation, and
cold-start latency on the first request for each size on a serverless host.

**Fix:** convert the sources to JPEG. No code change; `data/media.ts` takes the
new extension.

### 4. The served HTML is 217 KB

Most of it is `srcset` boilerplate: 16 candidate widths × 33 images. Adding the
16-wide rung contributed roughly 2 KB of that — a rounding error against the
519 KB it saved — but the underlying list is longer than this site needs.

**Fix:** trim `deviceSizes` to the widths that are actually selected. Measured,
the page only ever lands on 16, 96, 384, 1280 and 1920. Dropping 640, 828, 1080,
1600 and 2400 would cut roughly a third of the HTML. Deferred because it trades a
real responsive-fidelity margin on devices this environment cannot test for a
saving on a document that is already gzipped.

### 5. The logo is preloaded as a priority image

One of the three `<link rel="preload" as="image">` tags is a 64px logo. It
competes with the hero for the browser's early fetch budget to save a few
kilobytes.

**Fix:** drop `priority` from the logo in `components/layout/Logo.tsx`. Low
impact, one line, but it is free.

### 6. The header animates `padding` between its two states

`transition-[…,padding]` on a `fixed` element causes a layout pass inside the
header when the scroll threshold is crossed. It is one-shot rather than
per-frame, and CLS measured 0 because the header is out of flow, so this is not
currently costing anything. It is noted because it is the only layout-animating
property left on the site.

---

## What was measured and could not be

**LCP is not reportable from this environment.** The automated Chrome tab runs
backgrounded — 0 requestAnimationFrame callbacks in a one-second sample — so
paint is deferred and LCP finalises early, on the headline text rather than on
the hero photograph. The 6.7 s figure the API returns describes the harness, not
the site. What *is* verifiable from the served HTML: the hero emits a correct
`<link rel="preload" as="image">` with `imageSizes="100vw"`, and 30 of 33 images
carry `loading="lazy"`. LCP needs a real browser session or a Lighthouse run to
report honestly.

**INP and mobile FPS were not measured** for the same reason: both need a real
input and a running frame loop.

**No Three.js findings.** The brief's Three.js checklist does not apply — this
project has no WebGL, by an explicit early decision, and `three` is not a
dependency. There is no renderer to dispose, no geometry to free and no pixel
ratio to cap.
