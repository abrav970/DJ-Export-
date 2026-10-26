# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server on http://localhost:3000
npm run build      # production build (also the best full-project check — all pages are static)
npm run start      # serve the production build
npm run lint       # eslint (flat config, eslint-config-next)
npm run typecheck  # tsc --noEmit
```

There is no test suite. `npm run typecheck && npm run build` is the verification gate.

Env: copy `.env.example` to `.env.local`. `NEXT_PUBLIC_WEBSITE_URL` feeds `siteConfig.url`, which drives canonical URLs, `metadataBase`, sitemap and JSON-LD, so a wrong value silently poisons every absolute URL.

## Stack

Next.js 16 App Router · React 19 · TypeScript (strict) · Tailwind CSS v4 (CSS-first, no `tailwind.config`) · Framer Motion · GSAP + ScrollTrigger (via `@gsap/react`) · Lenis. Path alias `@/*` → repo root.

No WebGL. There are no 3D assets or transparent product cut-outs, so anything 3D would be procedural geometry beside documentary photography. Do not add `three` or R3F.

## Architecture

A marketing/enquiry site for an India-based agricultural exporter. Three ideas carry most of the design; breaking any of them is what usually goes wrong.

### 1. Content is data, components are dumb

`data/` is the content layer and the only place copy, specs or contact details should live. Components never hard-code product facts.

- `data/company.ts` — contact details, compliance references, trust points, process steps, buyer types, FAQs, `navigation`, `siteConfig`
- `data/products.ts` — the `Product[]` catalogue plus the `MediaSlot` union and helpers (`getProductBySlug`, `getRelatedProducts`, `narrativeOrder`, `productOptions`)
- `data/media.ts` — the imagery registry

Adding a product means appending to `products` in `data/products.ts` — the `/products/[slug]` route (via `generateStaticParams`), cards, related products, the enquiry-form dropdown and the Product JSON-LD all derive from that array. Only `navigation` in `data/company.ts` needs a manual entry for the header dropdown.

### 2. Imagery is slot-addressed

`MediaSlot` (defined in `data/products.ts`) is the union of every image position on the site. `<Media slot="…">` looks the slot up in `data/media.ts`: if `src` is set it renders `next/image`; otherwise it renders `<PlaceholderPlate>`, a quiet tonal CSS surface carrying the logo's concentric ring language. Callers never branch on which.

- Switching a slot to a real photograph is a `data/media.ts` edit only — never a component change.
- Adding a slot means extending the `MediaSlot` union **and** adding an entry to `media` in `data/media.ts`; it is a `Record<MediaSlot, …>`, so TypeScript will point at the gap.
- The placeholder is deliberately *not* a "missing image" state, and it is pure CSS. The SVG scene library it replaced used Gaussian blur and turbulence filters, which is what made the page composite-bound.

### 3. One motion language, two runtimes

`lib/motion.ts` is the single source of motion values for **both** runtimes and nothing should hard-code a number that lives there: easings (`easePremium`, `easeExpo`, and their GSAP-string equivalents in `gsapEase`), durations, the Framer variants (`fadeUp`, `stagger`, `wordMask`, `lineMask`, `labelReveal`, `viewportOnce`), and the scroll tokens (`scrub`, `parallax`, `scale`, `opacity`, `rotation`, `scene`, `triggers`, `smoothScroll`). `lib/gsap.ts` holds the runtime — it is the only place GSAP is registered, and importing from it is what guarantees registration happened.

The split is deliberate:

- **Framer Motion** owns one-shot entrance reveals and pointer gestures: `Reveal`, `StaggerGroup`, `HeadingReveal`, `LinesReveal`, `LabelReveal`, `RevealImage`, `Parallax`, `HeadlineReveal`, `MouseParallax`.
- **GSAP + ScrollTrigger** owns scrubbed and pinned work: `ScrollScene`, `ScrubLayer`, `MaskedReveal`, `ScrollProgress`.
- **CSS** owns band gradients, grain, dot-field, stage crossfades and hover. `<BandTransition>` is the section-boundary ramp — a gradient, not an animation.
- **Lenis** (`SmoothScroll`, mounted in `app/layout.tsx`) owns inertial scrolling.

Compose these rather than writing one-off `motion.*` calls or bare `ScrollTrigger.create`.

Animate only `transform`/`opacity`. Pin with `position: sticky` over a tall spacer — never ScrollTrigger's `pin: true`, which takes over layout and collapses without JS. Nothing pins below `lg`.

**Why the three scroll systems agree:** Lenis animates the *real* document scroll position rather than transforming a wrapper, so `window.scrollY` is always true. Framer's `useScroll` needs no adaptation, ScrollTrigger needs no `scrollerProxy`, and `position: sticky` keeps working. A transform-based smooth-scroll library would break all three.

#### Reduced motion

**Never call `useReducedMotion()` during render.** It returns `false` on the server and `true` on a reduced-motion client, so branching on it in `initial`/`style` emits different markup on each side and trips a hydration mismatch. It is handled in three places instead:

- **Framer tweens** — `<MotionProvider>` sets `MotionConfig reducedMotion="never"`, so Framer animates everything and the CSS block below draws the line precisely. (`"user"` was measured and rejected: Framer leaves a suppressed property at its *initial* value, so an element fading in from `opacity: 0` never arrives.)
- **CSS** — the `prefers-reduced-motion` block in `app/globals.css` pins `transform` and `clip-path` via `data-reveal`, `data-parallax-layer`, `data-scroll-fade`, `data-scroll-veil`, `data-sweep-char`, `data-label-reveal`. Opacity is deliberately untouched so cross-fades still run — movement causes vestibular discomfort, a fade does not.
- **GSAP** — every scrubbed transform is created inside `gsap.matchMedia(MOTION_OK)`, so under `reduce` the ScrollTrigger is never built. The GSAP primitives also render *finished* and add motion afterwards, the opposite of the Framer ones, so they need no rescue rule and none was added.

Two things are deliberately **not** suppressed under reduced motion, because they are position readouts rather than animation: `ScrollScene`'s step index (suppressing it would strand a reader on step one of a five-step story) and `ScrollProgress`.

The `<noscript>` block in `app/layout.tsx` pins the same end states for the Framer primitives, which server-render *hidden*. Without it, no script means a blank page rather than an unanimated one. Any new Framer reveal must be tagged `data-reveal`; any new GSAP one must not need to be.

`"use client"` is confined to the form, header/mobile menu, FAQ, hero, `Journey`, `Crossing`, `Process` and the motion primitives. Everything else is a server component — including `BandTransition`.

### Styling

Tailwind v4 with all tokens in the `@theme` block of `app/globals.css` — the palette (`ink-*`, `moss-*`, `olive-*`, `cream-*`, `bronze-*`), fonts, the type scale, tracking, `--container-page`, `spacing-section`, shadows, and the shape scale (`--radius-control` 8px, `--radius-card` 14px, `--radius-tile` 18px, `--shadow-soft`). Use token classes (`bg-ink-900`, `text-bronze-400`, `text-display-md`), not raw hex or raw `clamp()`. Shared component classes `.container-x`, `.eyebrow`, `.rule`, `.grain`, `.dot-field`, `.text-muted-light`, `.text-muted-dark` are defined there too. Fonts come from `next/font/google` in `app/layout.tsx` and are wired through CSS variables.

Breakpoints are Tailwind's defaults and are not overridden, but two carry meaning: **lg (1024)** is the pinning threshold (nothing pins below it) and **xl (1280)** is the hero's crop threshold (measured — below it `object-cover` trimmed 44px off the pepper bowl).

**Type-scale drift, known and unresolved.** The scale tokens (`--text-display-*`, `--text-feature`, `--text-hero`, `--text-body*`, `--text-label`) were named from values already in use, and only call sites that matched a step *exactly* were migrated — changing the rest would have been a silent restyle during a foundation phase. Section labels in particular still carry five different trackings (`0.32em`, `0.28em`, `0.24em`, `0.22em`, `0.2em`) against a `--tracking-label` of `0.28em`. Converge them when touching a section for another reason, not as a sweep.

Every contrast ratio and gradient stop in this file and in `globals.css` was **measured**, not chosen. Re-measure any new text-on-gradient pairing rather than assuming it inherits.

### Design DNA

`design/design-dna.json` is a three-dimension design profile (system / style / effects) extracted from a reference agri-export site, kept as the written rationale for the visual language: banded dark↔light rhythm, `.dot-field` on light bands, staggered rounded portrait tiles, the filled-plus-hairline-border button with its trailing arrow and asymmetric padding, and the scrubbed character sweep on headlines.

Only the *grammar* was adopted. The palette, Cormorant/Inter pairing, vector artwork and copy are DJ Export's own and deliberately diverge from the reference — the profile's `measured_palette` describes the reference, not this site, so `scripts/verify.mjs` from the `design-dna` skill will report a large ΔE against it by design. Do not "correct" the palette toward that measurement.

### SEO

`lib/seo.tsx` generates all structured data (`organizationJsonLd`, `productJsonLd`, `faqJsonLd`) from typed content plus the `<JsonLd>` renderer; `absoluteUrl` builds URLs from `siteConfig.url`. Page metadata is per-route `metadata` / `generateMetadata`, with the title template set in `app/layout.tsx`. `app/sitemap.ts` and `app/robots.ts` derive from the same data.

### Enquiry flow

`components/forms/QuoteForm.tsx` (client, validates) → `POST app/api/quote/route.ts` (re-validates server-side). The route is the single integration point for a delivery channel: it forwards to `QUOTE_WEBHOOK_URL` when set and otherwise `console.info`s the enquiry so nothing is lost. `/contact?product=<slug>#quote` pre-selects a product; product pages already link that way.

## Content integrity rules

This is a real business site with legal exposure, and the existing content follows these deliberately:

- **Nothing is invented.** No licence number, certification mark, testimonial, customer logo or trade statistic anywhere in the project. Never draw, trace, recreate or fetch an issuing body's emblem, and never fill in a plausible-looking registration number.
- **The compliance section is typographic again, by decision.** `ComplianceItem` in `data/company.ts` carries `logo` / `logoAlt` alongside `reference`, and `<Compliance>` shows an emblem when it has one and the designation as type when it does not. Every entry is currently on the typographic path: the FSSAI mark was fitted and then removed on the client's instruction. Leave the emblem branch in place — it is what keeps all rows the same height either way, and re-enabling it is a `data/company.ts` edit plus a file in `/public/brand`, never a component change. Any emblem must be a file the client supplies; never draw, trace, recreate or fetch one.
- Items marked `PLACEHOLDER` in `data/company.ts` (email, phone, WhatsApp, address, founded year, socials) are unset on purpose and must be supplied by the client. Leave them, don't guess them.
- The FSSAI, IEC and GST references in `compliance` **are** supplied and live. They are reproduced exactly as the client gave them — never normalise, reformat or "correct" a legal identifier. Two carry a `VERIFY` comment explaining a format mismatch worth checking against the certificate; leave those comments until the client confirms the numbers.
- Specification values are indicative standard Indian trade grades, and every specification table says exact figures are confirmed per lot and in the contract. Keep that caveat attached to any new spec table.

## Accessibility baseline

Skip link, semantic landmarks, one `h1` per page, no heading-level skips, keyboard-accessible nav, focus-trapped mobile menu with `Escape` to close. `prefers-reduced-motion` is respected both in CSS (`app/globals.css`) and per-component; `SourceStory` renders its finished state instead of the scroll animation. New work is expected to hold this line.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
