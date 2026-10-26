# PHASE 1 — DJ EXPORT CODEBASE AUDIT

**Date:** 2026-09-05 · **Branch:** `version-2` · **Head:** `7773da9 version1`
**Files modified by this phase:** none. Phase 1 is read-only by instruction.

**Baseline verified before any analysis:**

```
npm run typecheck   → clean
npm run build       → ✓ compiled 11.1s · TypeScript 3.0s · 12/12 static pages in 1603ms
```

The site builds green and every route prerenders. Nothing in this document is
recovering from a broken state; it is describing a working site that needs a
narrative spine and a scroll-driven motion layer.

**Decisions ratified before this document was written** (they determine
sections 9–14):

| Question | Decision |
| --- | --- |
| Origin claim | **Wayanad, Kerala is correct** — update `data/products.ts` |
| Motion runtime | **Layered** — Framer keeps one-shot reveals, GSAP/ScrollTrigger owns scrub + pin, Lenis global |
| WebGL / Three.js | **None.** CSS + GSAP only |
| Scope | **Homepage spine + shared foundation.** Inner pages inherit the foundation, keep their layouts |

---

## 1. Current architecture

### 1.1 Framework and application architecture

Next.js **16.3.2** App Router, built with Turbopack. React **19.2.8**.
TypeScript **6.0.3** in strict mode. Tailwind CSS **4.3.3** in CSS-first mode —
all tokens live in the `@theme` block of `app/globals.css`, there is no
`tailwind.config`. Path alias `@/*` → repo root.

Server components are the default and `"use client"` is genuinely confined:
20 of 49 component files are client, and they are the ones that must be
(form, header, mobile menu, FAQ disclosure, and the motion primitives).
`ProductStory`, `QuoteCta`, `ProductGrid`, `GlobalSupply`, `Compliance`,
`Footer`, `PageHero`, `ProductDetail` and the entire media layer render on the
server.

### 1.2 Routing

| Route | Kind | Source |
| --- | --- | --- |
| `/` | Static | `app/page.tsx` |
| `/about` | Static | `app/about/page.tsx` |
| `/products` | Static | `app/products/page.tsx` |
| `/products/[slug]` | SSG × 3 | `app/products/[slug]/page.tsx` via `generateStaticParams` |
| `/contact` | Static | `app/contact/page.tsx` |
| `/api/quote` | Dynamic | `app/api/quote/route.ts` |
| `/sitemap.xml` | Static | `app/sitemap.ts` |
| `/robots.txt` | Static | `app/robots.ts` |
| 404 | Static | `app/not-found.tsx` |

`params` is correctly awaited as a `Promise` (Next 16 convention).

### 1.3 Design system

Every token is declared in the `@theme` block of `app/globals.css`.

**Palette** — deliberately overlapping ramps rather than a dark set and a light
set with nothing between them, so a band can travel forest → moss → olive →
ivory instead of flipping at a hard seam:

- `ink` 950→600 — `#10231b` … `#3d5a47` (deep forest → forest)
- `moss` 700→400 and `olive` 400→200 — the connective mid-tones
- `cream` 50→400 — `#f3efe5` … `#afa184` (ivory → soft sand)
- `bronze` 100→800 — antique champagne, accent only

Contrast is not asserted, it is recorded: `--color-bronze-700` carries the
comment "4.8:1 on soft sand, 5.6:1 on ivory. `#7a5f2e` measured 4.49 on sand."
That discipline is a project asset and every new ramp stop must be held to it.

**Spacing** — two rhythms, not one: `--spacing-section` 5.5rem for editorial
bands, `--spacing-section-tight` 4rem for connective ones.

**Shape** — `--radius-control` 8px, `--radius-card` 14px, `--radius-tile` 18px.
One elevation level (`--shadow-soft`) plus `--shadow-lift` / `--shadow-panel`;
depth is otherwise carried by overlap and stagger.

**Easing** — `--ease-premium: cubic-bezier(0.22, 1, 0.36, 1)`, mirrored in
`lib/motion.ts` as `easePremium`.

**Shared component classes** — `.container-x`, `.eyebrow`, `.rule`, `.grain`,
`.dot-field`, `.text-muted-dark`, `.text-muted-light`.

### 1.4 Typography

Two families via `next/font/google`, self-hosted at build, wired through CSS
variables in `app/layout.tsx`:

- **Cormorant Garamond** (400, 500, normal + italic) → `--font-cormorant` → `--font-display`. Applied to `h1, h2, h3` in the base layer at weight 500, `letter-spacing: -0.01em`, `text-wrap: balance`.
- **Inter** → `--font-inter` → `--font-sans`. Body, with `font-feature-settings: "cv02","cv03","cv11"`.

Both `display: "swap"`. Sizing is fluid throughout —
`clamp(2rem, 4vw, 3.1rem)` for section headings, `clamp(1.5rem, 2.15vw, 2.9rem)`
for the hero. Paragraphs carry `text-wrap: pretty`.

### 1.5 Responsive implementation

No custom breakpoints are declared, so Tailwind's defaults apply
(sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536).

Three deliberate structural switches exist:

- `.container-x` — max-width 84rem, inline padding 1.25rem → 2.5rem at 768 → 3.5rem at 1280.
- **`xl` (1280) in `Hero.tsx`** — below it the photograph is a 16:9 band *under* the type; from `xl` it fills the section *behind* it. The comment at `components/sections/Hero.tsx:53` records why: `object-cover` on a section taller than the picture's 16:9 must trim width, and at 1024 that measured 44px off the pepper bowl and 98px off the coffee. This is a measured threshold, not a preference.
- **`lg` (1024) for pinning** — `Journey`, `Process` and `ProductStage` all render a pinned desktop layout and an authored stacked mobile layout, never a scaled-down desktop.

`100svh` / `74svh` / `86svh` are used rather than `vh`, which is correct for
mobile URL-bar behaviour.

### 1.6 Accessibility implementation

| Feature | Location |
| --- | --- |
| Skip link | `app/layout.tsx:82` |
| Landmarks (`main#main`, `footer`, `header`) | `app/layout.tsx` |
| One `h1` per page, no level skips | verified across all 5 templates |
| Focus-trapped mobile menu, `role="dialog"`, `aria-modal`, Escape, scroll lock | `components/layout/MobileMenu.tsx:20-67` |
| `aria-current="page"` on nav, `aria-current="step"` on journey stages | Header / MobileMenu / `Journey.tsx` |
| FAQ disclosure — `aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby` | `components/sections/Faq.tsx:48-85` |
| Breadcrumb `nav[aria-label="Breadcrumb"]` | `components/sections/PageHero.tsx` |
| `:focus-visible` — 2px bronze outline, 3px offset | `app/globals.css` base layer |
| Decorative character sweep hidden, intact string exposed via `sr-only` | `components/motion/HeadlineReveal.tsx` |
| Placeholder media exposed as `role="img"` + `aria-label` | `components/media/Media.tsx` |
| `prefers-reduced-motion` block | `app/globals.css:246-306` |
| `<noscript>` end-state styles | `app/layout.tsx:79` |

This is a genuinely above-average baseline. **It is also the main thing a GSAP
migration can silently destroy** — see §4.3.

### 1.7 SEO implementation

`lib/seo.tsx` generates `organizationJsonLd`, `productJsonLd` and `faqJsonLd`
from typed content, plus an `absoluteUrl` helper and a `<JsonLd>` renderer.
`app/layout.tsx` sets `metadataBase`, the `%s — DJ Export` title template,
keywords, OpenGraph, Twitter card, robots directives and icons. Every route
declares its own `metadata` / `generateMetadata` with a canonical `alternates`.
`app/sitemap.ts` and `app/robots.ts` derive from the same data.

All of it flows from `siteConfig.url`, which reads `NEXT_PUBLIC_WEBSITE_URL` — so
a wrong env value silently poisons every absolute URL.

### 1.8 Reusable utilities

`lib/utils.ts` — `cn()` (a 3-line class joiner, not `clsx`/`tailwind-merge`) and
`whatsappLink()`. `lib/motion.ts` — the shared motion language (see §4).
`lib/seo.tsx` — structured data. That is the whole of `lib/`.

### 1.9 Build and deployment configuration

`next.config.ts` sets `reactStrictMode`, `poweredByHeader: false`, and image
`formats: ["image/avif","image/webp"]` with an 8-step `deviceSizes` ladder
(420 → 2400). ESLint flat config extending `eslint-config-next`.

There is **no CI configuration, no `vercel.json`, no Dockerfile, no deployment
manifest of any kind.** `.env.example` declares
`QUOTE_NOTIFICATION_EMAIL`, `QUOTE_WEBHOOK_URL`, `NEXT_PUBLIC_WEBSITE_URL`.

### 1.10 `CLAUDE.md` is stale

Four statements in the project instructions are no longer true and will mislead
any future work:

1. It describes `components/media/scenes.tsx`, `artworkParts.tsx` and `materials.tsx` (~1200 lines of hand-drawn SVG scenes). **These are gone**, replaced by the 64-line CSS-only `components/media/PlaceholderPlate.tsx`.
2. It says "GSAP is used in exactly one place — `components/sections/SourceStory.tsx`". **That file does not exist and GSAP is not a dependency.**
3. It says `next.config.ts` sets `dangerouslyAllowSVG: true`. **It does not.**
4. It says `<MotionProvider>` uses `MotionConfig reducedMotion="user"`. **It is now `"never"`**, with reduced motion handled entirely in CSS — a deliberate and better decision, documented at `components/motion/MotionProvider.tsx:6-24`.

---

## 2. Current homepage structure

`app/page.tsx` composes five sections. Its own doc comment already frames the
page as "one passage, not five sections" and every boundary as "a change of
light rather than a cut" — the continuity instinct master.md asks for is
present; what is missing is a spine beat and scroll authorship.

| # | Section | File | Client | Current motion |
| --- | --- | --- | --- | --- |
| 1 | Hero | `components/sections/Hero.tsx` | ✅ | Element-scroll parallax (bg `y` 0→14%, `scale` 1→1.09), type `y` 0→−46% + fade to 0 by 72%, `MouseParallax` pointer spring, `LinesReveal` on mount |
| 2 | ProductStory | `components/sections/ProductStory.tsx` | server | Three alternating spreads; `RevealImage` clip-wipe from the outer page edge, `Parallax` 9% (wide) / 4% (macro), CSS hover scale + slide |
| 3 | Journey | `components/sections/Journey.tsx` | ✅ | Five stages; sticky frame + CSS crossfade, text steps past, band gradient sand → olive → moss → forest |
| 4 | Crossing | `components/sections/Crossing.tsx` | ✅ | Scroll-scrubbed `scale` 1.18→1 and veil opacity 0.9→0 over the port photograph |
| 5 | QuoteCta | `components/sections/QuoteCta.tsx` | server | `LabelReveal`, `HeadingReveal`, two `Reveal`s |

### 2.1 Per-section verdict

**1 · Hero**

- *Preserve* — the `xl` crop threshold and its measurement; the single top-only scrim that dies out by 38% so nothing is laid over a product; the three-speed layering; `MouseParallax`'s pointer-fine guard.
- *Enhance* — retime the entrance to hand off into the new origin beat instead of ending at a gradient band; bind the type's exit to the origin section's entrance rather than to the hero's own end.
- *Restructure* — nothing.
- *Replace* — nothing.

**2 · ProductStory**

- *Preserve* — the editorial spread grammar (wide frame + overlapping macro on a cream keyline mount, type beside it); the real metadata line (category · HS code · grade count) instead of decorative 01/02/03; the 8rem fixed-height transition band and its seven measured luminance stops.
- *Enhance* — the alternating wipe direction is good and transfers directly to the sequence.
- *Restructure* — this is three static spreads the reader scrolls past. Phase 6 needs one continuous pinned sequence where the reader stands still and the range passes.
- *Replace* — the stacked desktop layout, by promoting the dead `ProductStage.tsx`. **The mobile stacked list stays** — it is the correct phone treatment and phase 12 forbids scaling the desktop down.

**3 · Journey**

- *Preserve* — the sticky-over-spacer pin; CSS-transition crossfades (which collapse correctly under reduced motion with no JS branch); the hairline progress rail; the entire band gradient with its measured stop positions (sand held flat to 36%, forest from 48%, the whole tonal move spent in the 370px gap between stages two and three so no text ever lands on an unusable mid-tone); the authored mobile `<ol>`.
- *Enhance* — replace `useMotionValueEvent` → `setState` with a scrubbed ScrollTrigger so the frame responds continuously rather than in five jumps.
- *Restructure* — split into two beats: **Sourcing & Quality** (stages 1–3) and **Export Journey** (stages 4–5), per phases 7 and 9.
- *Replace* — nothing.

**4 · Crossing**

- *Preserve* — the scroll-scrubbed reciprocity (scroll back and the vessel withdraws); the five-stop scrim whose 72% stop was measured against the composited pixels the type actually covers, lifting cream from 3.03:1 to 5.36:1.
- *Enhance* — give the beat content. One line of type over a photograph is the thinnest section on the page.
- *Restructure* — absorb the export-route visualisation from phase 9.
- *Replace* — nothing.

**5 · QuoteCta**

- *Preserve* — everything. Phase 10 explicitly asks for *less* here.
- *Enhance* — calm the motion further; ensure the copy lands after the reader has seen origin, products, quality and export.
- *Restructure / Replace* — nothing.

### 2.2 Mapping against the target experience

| Target beat | Status | Where it is today |
| --- | --- | --- |
| **Wayanad Origin** | ❌ **absent** | An eyebrow only — "India · Western Ghats", `Hero.tsx:97`. No section, and nothing in the data layer says Wayanad. |
| Product Introduction | ✅ | ProductStory heading block |
| **Pepper** | ⚠️ | Spread 2 of 3, static |
| **Coffee** | ⚠️ | Spread 1 of 3, static |
| **Cardamom** | ⚠️ | Spread 3 of 3, static |
| Sourcing / Selection | ✅ | Journey stages 1–2 |
| Quality | ✅ | Journey stage 3 |
| Export Journey | ✅ | Journey stages 4–5 |
| International Markets | ⚠️ thin | Crossing — one photograph, one headline, no substance |
| Final CTA | ✅ | QuoteCta |

**The gap is exactly three things:** no origin section, products are a stack
rather than a sequence, international markets is under-built.

Note a narrative-order conflict: phase 6 wants **pepper → coffee → cardamom**,
but `products` in `data/products.ts` is coffee-first and drives `/products`,
related-products and JSON-LD. The sequence must carry its own explicit order —
a narrative order is not a catalogue order.

---

## 3. Reusable components

### 3.1 Motion primitives — `components/motion/`

| Component | Lines | Uses | Purpose |
| --- | --- | --- | --- |
| `Reveal` | 45 | many | Default entrance: opacity + short `y`, once on enter |
| `StaggerGroup` / `StaggerItem` | 64 | 6 | Parent that releases children in sequence |
| `HeadingReveal` | 83 | 4 | Word-by-word mask rise for section headings |
| `LinesReveal` | 74 | 4 | Line-by-line mask rise; breaks are authored, not measured |
| `LabelReveal` | 73 | 6 | Rule draws out, label opens from tight tracking — deliberately *not* a translate, so labels stay subordinate to headings |
| `RevealImage` | 66 | 3 | `clip-path` wipe outside, over-scale settle inside; inner runs longer than outer so the pair is not one mechanical gesture |
| `Parallax` | 41 | 3 | Slower-than-page drift; inner layer over-sized so no edge is exposed |
| `HeadlineReveal` | 137 | 2 (page heroes only) | Scroll-scrubbed per-character opacity sweep |
| `MouseParallax` | 66 | 1 (hero) | Pointer-following spring, fine-pointer only, bound in an effect |
| `MotionProvider` | 29 | root | `MotionConfig reducedMotion="never"` |
| `ScrollSettle` | 51 | **0 — dead** | Scroll-scrubbed over-scale settle |

### 3.2 UI and layout

`ui/Button.tsx` (`ButtonLink` / `TextLink`, filled-plus-hairline with trailing
arrow), `ui/SectionHeading.tsx` (eyebrow + heading + description, tone-aware),
`ui/Eyebrow.tsx` (1 use), `ui/TrustIcon.tsx` (**0 uses — dead**),
`layout/Header.tsx`, `layout/MobileMenu.tsx`, `layout/Footer.tsx`,
`layout/Logo.tsx` (`Logo` / `LogoFull`).

### 3.3 Media layer

`Media.tsx` resolves a `MediaSlot` against `data/media.ts` — `next/image` when a
photograph is configured, `PlaceholderPlate` otherwise. Callers never branch.
`HeroMedia.tsx` adds an optional muted looping video (currently inert:
`heroVideo` is `null`).

### 3.4 Product components

`ProductCard`, `ProductDetail` (176 lines — three bands: story + specification,
grades on ink, packing + gallery), `ProductSpecification`, `RelatedProducts`.
All server components.

### 3.5 Sections

`Hero`, `ProductStory`, `Journey`, `Crossing`, `QuoteCta`, `PageHero`,
`Process`, `GlobalSupply`, `Compliance`, `Faq`, `ProductGrid`,
`ProductStage` (**197 lines, 0 uses — dead**).

> `ProductStage.tsx` already implements a pinned, cross-dissolving product
> sequence with an over-scale drift, a beat-delayed macro and per-product type
> remounting — i.e. most of what phase 6 asks for. It is the single most
> valuable thing found in this audit.

### 3.6 Navigation and footer

**Header** — client, fixed, transparent over the hero and dark-glass
(`bg-ink-950/85` + `backdrop-blur-xl` + hairline border) past 24px of scroll,
losing height as it goes. Four links plus a standing CTA. The product dropdown
was deliberately removed as the only header state that could trap keyboard
focus. Tagged `data-reveal` so a reduced-motion reader does not get a header
stuck at opacity 0. **Already satisfies phase 11's navigation-state brief.**

**Footer** — server, deliberately small: statement, three links, contact, one
CTA, legal line.

---

## 4. Current animation architecture

### 4.1 The motion language

`lib/motion.ts` (100 lines) is already a centralized motion configuration —
phase 3's requirement is half-built:

- **Two easings, not one.** `easePremium` `[0.22,1,0.36,1]` is the workhorse for translate and fade; `easeExpo` `[0.16,1,0.3,1]` is sharper with a longer tail and is used wherever something is *uncovered* (image wipes, headline masks) so a reveal arrives fast and settles slowly. Both monotonic — nothing on the page ever overshoots.
- **Durations** — `baseTransition` 0.8s, `revealTransition` 1.1s.
- **Variants** — `fadeUp`, `fadeIn`, `stagger()`, `wordMask` (0.72s), `lineMask` (0.95s), `labelReveal` (letter-spacing 0.5em → 0.32em).
- **Viewport** — `viewportOnce` (`-5%` margin, fires on entry) and `viewportEarly` (`+8%`, for elements deep inside a band).

What it lacks: scrub configuration, parallax strengths, scale ranges, pin
lengths, trigger start/end strings.

### 4.2 Scroll implementation

All scroll work is Framer `useScroll` + `useTransform` bound to element targets —
**9 call sites**: `Header`, `HeadlineReveal`, `Parallax`, `ScrollSettle`,
`Crossing`, `Hero`, `Journey`, `Process`, `ProductStage`.

**Pinning is `position: sticky` inside a tall spacer, never scroll hijacking.**
`Journey.tsx`, `Process.tsx` and `ProductStage.tsx` each hand-roll it. The
comment at `Process.tsx:37` records why: it costs nothing, cannot desynchronise
from the scrollbar, and degrades to ordinary scrolling if the JS never runs.
`Process` sizes its spacer at `80vh` per stage rather than `100vh` — a
deliberate correction after the section was measured eating 43% of the page's
total scroll distance.

**Stage switching uses `useMotionValueEvent` → `setState`.** Acceptable at four
or five discrete stages; the wrong primitive for a continuously scrubbed
sequence, because it re-renders the whole subtree per transition.

**Crossfades are CSS transitions, not JS animations** — chosen so that
`prefers-reduced-motion` collapses `transition-duration` and stages switch
instantly, with no JS branch. Driving them through Framer would have required
`data-reveal`, and that rule forces `opacity: 1`, stacking every photograph on
top of the others.

### 4.3 The reduced-motion contract — the constraint on everything downstream

Framer is configured to animate *everything* (`reducedMotion="never"`)
specifically so that `app/globals.css:246-306` can draw the line precisely:

| Selector | Neutralised to |
| --- | --- |
| `[data-reveal]` | `transform: none`, `clip-path: none` — **opacity deliberately untouched, so cross-fades still run** |
| `[data-parallax-layer]` | `transform: none` |
| `[data-scroll-fade]` | `opacity: 1`, `transform: none` |
| `[data-scroll-veil]` | `opacity: 0` (resting state is transparent, so it cannot use `data-scroll-fade`) |
| `[data-sweep-char]` | `opacity: 1` |
| `[data-label-reveal]` | `letter-spacing: 0.32em` |
| `[data-progress-line]` | `transform: none` |

Plus a `<noscript>` block in `app/layout.tsx:79` pinning the same end states,
because every reveal is server-rendered in its *hidden* state — with scripting
off and no such block the page is blank, not merely unanimated.

The reasoning is recorded in `MotionProvider.tsx`: `reducedMotion="user"` was
measured and rejected because Framer leaves a suppressed property at its
*initial* value, so an element fading in from `opacity: 0` simply never
arrives. Movement triggers vestibular discomfort; a fade does not.

**Any GSAP work must honour this same contract or the page goes blank for
reduced-motion and no-JS readers.**

---

## 5. Asset inventory

22 files, 23 MB raw, 15 slots wired in `data/media.ts`. No video, no image
sequences, no transparent product cut-outs, no 3D models.

### 5.1 In use

| Slot | File | MB | Provenance |
| --- | --- | --- | --- |
| `hero-export` | `process/THE THREE-PRODUCT HERO COMPOSITION.png` | 1.97 | client-supplied |
| `plantation` | `hero/hero background.png` | 2.13 | client-supplied |
| `logistics` | `process/LOADING INTO CONTAINER.png` | 2.10 | client-supplied |
| `port` | `process/CONTAINER  SHIP IMAGE.png` | 1.96 | client-supplied |
| `cardamom-plantation` | `sourcing/cardamom-plantation.jpg` | 1.71 | Pexels — Idukki, Kerala |
| `landscape` | `sourcing/landscape.jpg` | 0.78 | Pexels — Munnar, Kerala |
| `cardamom-pods` | `products/cardamom-product.jpg` | 0.74 | Pexels |
| `pepper-vine` | `sourcing/pepper-plantation.jpg` | 0.45 | Pexels |
| `peppercorns` | `products/black-pepper-product.jpg` | 0.40 | Pexels |
| `packing` | `process/packaging.jpg` | 0.40 | Pexels |
| `harvest` | `process/harvest.jpg` | 0.39 | **Pexels — Wayanad, India** |
| `coffee-cherries` | `products/coffee-product.jpg` | 0.32 | Pexels |
| `inspection` | `process/quality-inspection.jpg` | 0.27 | Pexels — Nagpur, India |
| `coffee-drying` | `process/coffee-drying.jpg` | 0.25 | Pexels |
| `coffee-beans` | `products/coffee-beans.jpg` | 0.21 | Pexels |

### 5.2 Unused

`process/packed sack.png` (2.42 MB), `process/SHIP DEPARTURE IMAGE.png` (2.00),
`products/BLACK PEPPER HERO PRODUCT.png` (1.92), `sourcing/plantation.jpg`
(0.89), `hero/hero-plantation.jpg` (0.58), `export/export-logistics.jpg` (0.48).

### 5.3 Findings

1. **Exactly one asset is verifiably Wayanad** — `process/harvest.jpg` (Pexels 16166178, "Cardamom harvest, Wayanad, India"). Everything else is Munnar, Idukki, Nagpur, or client PNGs of unrecorded provenance. A Wayanad origin section can be built truthfully around that one frame plus region-neutral alt text, but a genuine Wayanad landscape is a **client deliverable**, not something this project can source.
2. **`CREDITS.md` records that no image depicts a DJ Export facility.** Alt text describes what the photograph shows, never "our plantation". Two candidates were rejected during selection for reading as false claims (sacks stencilled "OF RWANDA"/"PROD ETHIOPIA"; an aerial of the Port of Baltimore). This discipline must survive the redesign.
3. **Provenance of the four in-use PNGs is unrecorded** and `CREDITS.md` flags that if any was generated rather than photographed, that should be settled deliberately. Two of them are on the LCP path.
4. Seven files are 1.9–2.4 MB PNGs. `next/image` re-encodes to AVIF/WebP on serve so this is not a runtime cost, but PNG is the wrong source container for photographs, and filenames with spaces and capitals — including `CONTAINER  SHIP IMAGE.png` with a **double space** — are fragile.
5. `data/company.ts` names **no destination countries anywhere**, deliberately. The phase 9 export map therefore cannot label markets without inventing trade relationships.

---

## 6. Problems found

| # | Problem | Severity |
| --- | --- | --- |
| 1 | **The origin beat — master.md's entire spine — does not exist.** | Blocking |
| 2 | Products are three stacked static spreads, not a sequence. | High |
| 3 | International Markets is one photograph and one line of type. | High |
| 4 | Origin copy says Karnataka/Kerala/Tamil Nadu, Malabar, Idukki — not Wayanad. Factual claim about a real business; ratified as an update. | High |
| 5 | `CLAUDE.md` contains four statements that are no longer true (§1.10). | High — misleads all future work |
| 6 | `Journey.tsx` and `Process.tsx` are two hand-rolled implementations of the same pinned-stage pattern; `ProductStage.tsx` is a third. | Medium |
| 7 | `useMotionValueEvent` → `setState` re-renders the whole stage subtree per transition. | Medium |
| 8 | Dead code: `ScrollSettle.tsx`, `ui/TrustIcon.tsx`, `ProductStage.tsx`. | Medium |
| 9 | No smooth scroll; `scroll-behavior: smooth` is anchor-only. | Medium |
| 10 | Two ~2 MB client-supplied PNGs of unrecorded provenance sit on the LCP path. | Medium |
| 11 | `heroVideo` is `null`; `HeroMedia.tsx` is wired but inert. | Low — deliberate |
| 12 | `trustPoints` (`data/company.ts`) and its `TrustIcon` renderer are orphaned data. | Low |
| 13 | No CI, no deployment manifest. | Low — out of scope |

---

## 7. What should remain

Non-negotiable, in rough order of how expensive it would be to lose:

1. **The reduced-motion contract** — the `data-*` CSS block and the `<noscript>` end-state styles (§4.3).
2. **The measured decisions** — every contrast ratio, gradient stop position and crop threshold recorded in comments. `Hero`'s `xl` switch, `Journey`'s 36%/48% flats, `Crossing`'s 72% scrim stop, `ProductStory`'s 8rem fixed ramp.
3. **The data layer** — `data/company.ts`, `data/products.ts`, `data/media.ts`, and the `<Media slot>` indirection that keeps photograph swaps a one-line data edit.
4. **Content-integrity rules** — nothing invented; `PLACEHOLDER` values left unset; spec-table caveats attached; no certification badges; alt text that never claims a facility.
5. **The SEO layer** — routes, metadata, canonicals, JSON-LD, sitemap, `generateStaticParams`.
6. **`QuoteForm` + `/api/quote`** — the only interactive path on the site.
7. **The `@theme` token block** and the banded overlapping palette.
8. **Sticky-over-spacer pinning** — better than ScrollTrigger's `pin: true` for this site, and it degrades gracefully.
9. **`lib/motion.ts` as the single motion config** — extend, never replace.
10. **The accessibility baseline** (§1.6) and the server/client boundary (§1.1).
11. **Authored mobile layouts** — never a scaled-down desktop.
12. **The Framer entrance primitives** — `Reveal`, `LinesReveal`, `HeadingReveal`, `LabelReveal`, `StaggerGroup`. GSAP buys nothing here and rewriting them is pure regression surface.

---

## 8. What should change

1. **Add the origin section.** The missing spine.
2. **Convert the product spreads into one pinned, scrubbed sequence** by promoting `ProductStage.tsx` and giving it an overlapping hand-off instead of a fade.
3. **Split `Journey` into Sourcing & Quality and Export Journey**, per phases 7 and 9.
4. **Deepen `Crossing`** into a real International Markets beat with the phase 9 route visualisation.
5. **Unify three pinned-stage implementations into one `ScrollScene` primitive.**
6. **Introduce Lenis, GSAP and ScrollTrigger** under a single scroll owner.
7. **Extend `lib/motion.ts` with scroll tokens** so no ScrollTrigger carries magic numbers.
8. **Add a global scroll-progress indicator** and make all seven section boundaries continuous colour ramps.
9. **Update origin data to Wayanad**; add a `wayanad-origin` media slot; extend `SHOTLIST.md` and `CREDITS.md`.
10. **Delete dead code**; correct `CLAUDE.md`.

---

## 9. Proposed component architecture

```
NEW
  lib/gsap.ts                              single registerPlugin(ScrollTrigger) entry
  components/motion/SmoothScroll.tsx       Lenis, driven off gsap.ticker
  components/motion/ScrollScene.tsx        sticky panel over spacer → normalised 0→1 progress
  components/motion/ScrubLayer.tsx         parallax / scale / opacity bound to scene progress
  components/motion/MaskedReveal.tsx       GSAP clip-path reveal at scene scale
  components/motion/ScrollProgress.tsx     global position hairline (phase 11)
  components/sections/Origin.tsx           Wayanad — the missing beat (phase 4)
  components/sections/ExportRoute.tsx      inline SVG route, scrubbed (phase 9)

PROMOTED
  components/sections/ProductStage.tsx  →  the homepage product sequence (phase 6)

RESTRUCTURED
  components/sections/Journey.tsx       →  Sourcing & Quality (stages 1–3)
  components/sections/Crossing.tsx      →  International Markets + ExportRoute
  components/sections/ProductStory.tsx  →  mobile stacked variant only
  components/sections/Process.tsx       →  rebuilt on ScrollScene (about page)

UNCHANGED
  all Framer entrance primitives · Header · MobileMenu · Footer · Logo
  media layer · product components · ui/* · forms · lib/seo · lib/utils

DELETED
  components/motion/ScrollSettle.tsx       (0 uses)
  components/ui/TrustIcon.tsx              (0 uses)
```

`app/page.tsx` becomes:

```
Hero → Origin → ProductSequence → SourcingQuality → ExportJourney
     → InternationalMarkets → QuoteCta
```

---

## 10. Proposed animation architecture

**Scroll ownership.** Lenis in its default mode moves the *real* document scroll
position, so Framer's `useScroll` stays in sync with **no `scrollerProxy`
needed**. One wiring point:

```
SmoothScroll  →  gsap.ticker drives lenis.raf()
              →  lenis 'scroll' event calls ScrollTrigger.update()
              →  gsap.ticker.lagSmoothing(0)
```

Lenis is **not mounted** on coarse pointers or under `prefers-reduced-motion`.
On iOS Safari it fights native momentum and URL-bar resize, and it is the single
largest mobile jank risk in this project.

**Division of labour.**

| Concern | Owner |
| --- | --- |
| Entrance reveals (word, line, label, stagger, fade-up) | **Framer** — unchanged |
| Pointer-follow drift | **Framer** — `MouseParallax` unchanged |
| Header state | **Framer** — `useScroll` unchanged |
| Scrubbed scenes, pinned sequences, layered parallax, route drawing | **GSAP + ScrollTrigger** |
| Band gradients, grain, dot-field, crossfades, hover, reduced-motion | **CSS** — unchanged |

**Motion tokens.** `lib/motion.ts` gains a `scroll` block beside the existing
easings and variants: scrub values, parallax strengths, scale ranges, scene
lengths in `svh`, trigger `start` / `end` strings. Every ScrollTrigger reads
from it.

**React lifecycle.** All GSAP work goes through `useGSAP` from `@gsap/react`,
which handles React 19 cleanup and StrictMode double-invocation correctly, so
ScrollTriggers cannot leak across navigations.

**Reduced motion.** Every new ScrollTrigger is created inside
`gsap.matchMedia("(prefers-reduced-motion: no-preference)")`. Under `reduce`,
the triggers are **never created**, so there is nothing to neutralise — and the
existing `data-*` CSS contract and `<noscript>` block stay exactly as they are.

---

## 11. Proposed dependency architecture

| Package | Version | Size (gz) | Why |
| --- | --- | --- | --- |
| `gsap` | ^3.15 | ~60 KB with ScrollTrigger | Timelines and scrub. ScrollTrigger is the only plugin. |
| `lenis` | ^1.3 | ~6 KB | Inertial scroll |
| `@gsap/react` | ^2.1 | ~2 KB | `useGSAP` — correct cleanup under React 19 / StrictMode |

**Not added:** `three`, `@react-three/fiber`, `@react-three/drei`, any GSAP
bonus plugin (`SplitText`, `ScrollSmoother`), `clsx`, `tailwind-merge`. Text
splitting is already solved by `LinesReveal` / `HeadingReveal`; `ScrollSmoother`
would duplicate Lenis.

**Retained:** `framer-motion@13` — it owns entrance motion and rewriting 10
working primitives, `Header`, `MobileMenu`, `QuoteForm` and `Faq` buys a bundle
saving at the cost of the whole accessibility contract.

Budget: **~90 KB gz added** across libraries and new sections.

---

## 12. Performance risks

| Risk | Mitigation |
| --- | --- |
| Three scroll systems (Lenis / ScrollTrigger / Framer `useScroll`) desynchronising | Lenis moves real document scroll; single `ScrollTrigger.update` wiring; `lagSmoothing(0)` |
| Cross-dissolving full-bleed sequences keep 3–5 decoded screen-size images resident — the main jank source on mid-range Android | Cap concurrent layers; `sizes` per breakpoint; only the active ± 1 frame mounted |
| Two ~2 MB PNGs on the LCP path | Re-encode to AVIF/WebP source; `priority` on the hero only |
| ScrollTrigger instances leaking across client navigations | `useGSAP` scoped cleanup; assert instance count in phase 13 |
| Per-character `HeadlineReveal` creates one MotionValue per character | Already confined to page heroes — keep it that way |
| Layout thrash from non-composited properties | Transform and opacity only; `letter-spacing` stays confined to `labelReveal` (one run, eight characters) |
| Pin spacers inflating total scroll distance | `Process` already corrected 100vh → 80vh per stage; hold that budget for every new scene |

No WebGL means no renderer disposal, no texture/geometry leaks, no pixel-ratio
capping and no second render loop competing with scroll — a substantial part of
phase 13's checklist is eliminated by the scope decision.

---

## 13. Mobile risks

| Risk | Mitigation |
| --- | --- |
| Lenis vs. iOS Safari momentum and URL-bar resize | Do not mount on coarse pointers |
| Pinned viewport-height panels trapping phone readers | No pinning below `lg` — the codebase already refuses this; hold the line |
| Scaled-down desktop layouts | Authored mobile variants, as `Journey` and `ProductStory` already do |
| Depth layers multiplying cost on low-end devices | Three planes desktop → one on mobile |
| Hover-only information | `ProductStory`'s hover is decorative, not informational — verify this holds for every new section |
| CLS from fluid `clamp()` type and `svh` sections | `svh` already used correctly; measure in phase 13 |
| Reduced-motion and no-JS paths breaking during migration | `matchMedia` guard + untouched CSS contract; re-verify at every phase gate |

---

## 14. Recommended implementation sequence

Each phase ends on a hard gate: `npm run typecheck && npm run build` green, and
contrast re-measured on every new text-on-gradient pairing.

| Order | Phase | Deliverable | Gate |
| --- | --- | --- | --- |
| 1 | **3 — Foundation** | `lib/gsap.ts`, `SmoothScroll`, `ScrollScene`, `ScrubLayer`, `MaskedReveal`, scroll tokens in `lib/motion.ts`, dead code deleted, `CLAUDE.md` corrected | Build green **and the site visually identical to today** |
| 2 | **4 — Wayanad Origin** | `Origin.tsx`, `wayanad-origin` slot, `data/products.ts` origin fields, `SHOTLIST.md` / `CREDITS.md` updates | Build green; ramp into products has no seam |
| 3 | **6 — Product Sequence** | `ProductStage` promoted, overlapping hand-off, explicit pepper → coffee → cardamom order, mobile stack preserved | Build green; scrollbar length honest |
| 4 | **7 — Sourcing & Quality** | `Journey` re-scoped to stages 1–3, motion slower than the sequence | Build green; band contrast re-measured |
| 5 | **9 — Export Journey** | `ExportRoute.tsx` — SVG, scrubbed, **unlabelled arcs** | Build green; no invented market claims |
| 6 | **10 — Final CTA** | `QuoteCta` motion calmed | Build green |
| 7 | **11 — Continuity** | `ScrollProgress`, all seven boundaries as continuous ramps | Build green; no abrupt jumps |
| 8 | **12 — Mobile** | Per-section mobile audit, touch equivalents, layer reduction | Verified on small/large phones, tablet, landscape |
| 9 | **13 — Performance** | LCP / CLS / INP, bundle, image formats, ScrollTrigger instance count, listener cleanup | Before/after report |
| 10 | **14 — Creative QA** | Critical audit against the intended experience; ten weakest points ranked | Findings presented, **no fixes applied without approval** |

**Correction (2026-09-05, after this document was first written):** the phase
files were still being authored while the audit was in progress, so an earlier
revision of this section claimed phases 2, 5 and 8 were all duplicates. Verified
by `md5sum` against the final set:

| Pair | Result |
| --- | --- |
| `phase-2.md` vs `phase-3.md` | **identical** — both are "Establish DJ Export Experience System" |
| `phase-4.md` vs `phase-5.md` | identical |
| `phase-7.md` vs `phase-8.md` | identical |
| `phase-1.md` vs `phase-2.md` | **different** — phase 2 is the foundation phase, not a second audit |

So the foundation phase is numbered **2** in the brief (and 3 in this
document's sequence table); phases 5 and 8 are the duplicates. Several files
also carry a title that disagrees with their filename — `phase-6.md` is titled
"PHASE 5", `phase-9.md` is titled "PHASE 8". Filenames are treated as
authoritative.

---

## Appendix A — Motion audit

Which existing elements can support each technique.

| Technique | Ready today | Candidates | Notes |
| --- | --- | --- | --- |
| **Parallax** | `Hero` bg, `ProductStory` wide/macro (9%/4%), `Journey` frame drift, `about` estate frame | New `Origin` three-plane stack | `Parallax` already over-sizes the inner layer so no edge is exposed — reuse the technique in `ScrubLayer` |
| **ScrollTrigger** | none (no GSAP) | Every scene: `Origin`, product sequence, sourcing, export route | Replaces the `useScroll` + `setState` pattern |
| **Pinning** | `Journey`, `Process`, `ProductStage` — all via sticky-over-spacer | Product sequence, `Origin` | Keep sticky; do **not** switch to ScrollTrigger `pin: true` |
| **Scrub** | `Crossing` (scale + veil), `HeadlineReveal` (character sweep) | Product hand-off, export route draw, origin layers | `Crossing` already demonstrates reciprocity — scroll back and the vessel withdraws |
| **Masked reveals** | `RevealImage` — 4-direction `clip-path` wipe with an inner over-scale settle | `Origin` landscape plate, sequence frames | Direction already alternates by row; carry that forward |
| **Text reveals** | `LinesReveal`, `HeadingReveal`, `LabelReveal`, `HeadlineReveal` | All new sections | Four distinct gestures already exist — do not add a fifth |
| **Depth** | `Hero` (3 speeds), `ProductStory` (overlap + keyline mount), `Journey` (held frame vs. stepping text) | `Origin` (landscape / detail / type) | Depth is currently carried by overlap and differential speed, not shadow — keep it that way |
| **Scene transitions** | Band gradient ramps at every boundary | All seven boundaries | The technique exists and is measured; it just needs applying page-wide |
| **3D** | none | — | **Out of scope by decision** |
| **WebGL** | none | — | **Out of scope by decision** |

---

## Appendix B — Technical recommendation

**A · HTML/CSS** — band gradients and their measured stops, `.grain`,
`.dot-field`, `.rule`, stage crossfades, hover states, focus rings, and the
entire reduced-motion layer. This is where most of the site's atmosphere already
lives and none of it should move to JavaScript.

**B · GSAP core** — only where a beat is genuinely *sequenced*: the product
hand-off (outgoing macro exits on one vector while the incoming wide frame
enters on another) and the origin layer choreography. Not for one-shot
entrances — Framer already does those well and is already in the bundle.

**C · ScrollTrigger** — the scrubbed passages: origin parallax planes, product
sequence progress, sourcing/quality stage advance, export route draw. It
replaces `useMotionValueEvent` → `setState` and gives continuous response
instead of discrete jumps.

**D · Lenis** — global, fine-pointer only, disabled under
`prefers-reduced-motion`, driven off `gsap.ticker` with `lagSmoothing(0)`. This
is what converts "scroll position" into "cinematic timeline" more than any
single animation does.

**E · Three.js / WebGL** — **recommended against, and ruled out by decision.**

There are no 3D assets and no transparent product cut-outs in the repository, so
anything 3D would be procedural geometry standing next to documentary
photography — precisely the "unnecessary 3D" and "synthetic" outcome master.md
rules out. Phase 9 offers Three.js as an option for the export map and answers
its own question: "choose the simplest implementation that achieves the intended
visual quality." For a route from Wayanad to a port to open water, that is inline
SVG with a scrubbed `stroke-dashoffset` — lighter, sharper at every resolution,
accessible, and it cannot cost a frame.

The one use that would have been defensible — a shader displacement crossfade
between the *real* product photographs, i.e. WebGL rendering actual imagery
rather than inventing objects — was considered and declined. It remains the only
WebGL idea worth revisiting if the question reopens.

---

## Open items requiring the client

1. **A genuine Wayanad landscape photograph.** Only `process/harvest.jpg` is verifiably Wayanad. Until one is supplied, the `wayanad-origin` slot falls back to `PlaceholderPlate` and alt text stays region-neutral.
2. **Provenance of the four in-use client PNGs**, two of which are on the LCP path. `CREDITS.md` flags that if any was generated rather than photographed, that should be settled deliberately.
3. **The `PLACEHOLDER` values** in `data/company.ts` — email, phone, WhatsApp, address, founded year, FSSAI and IEC references, socials. Unset on purpose; still unset.
4. **`NEXT_PUBLIC_WEBSITE_URL`** for the production domain, since every canonical, OG and JSON-LD URL derives from it.
