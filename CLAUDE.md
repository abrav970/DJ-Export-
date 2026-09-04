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

Env: copy `.env.example` to `.env.local`. `NEXT_PUBLIC_SITE_URL` feeds `siteConfig.url`, which drives canonical URLs, `metadataBase`, sitemap and JSON-LD, so a wrong value silently poisons every absolute URL.

## Stack

Next.js 16 App Router · React 19 · TypeScript (strict) · Tailwind CSS v4 (CSS-first, no `tailwind.config`) · Framer Motion · GSAP. Path alias `@/*` → repo root.

## Architecture

A marketing/enquiry site for an India-based agricultural exporter. Three ideas carry most of the design; breaking any of them is what usually goes wrong.

### 1. Content is data, components are dumb

`data/` is the content layer and the only place copy, specs or contact details should live. Components never hard-code product facts.

- `data/company.ts` — contact details, compliance references, trust points, process steps, buyer types, FAQs, `navigation`, `siteConfig`
- `data/products.ts` — the `Product[]` catalogue plus the `MediaSlot` union and helpers (`getProductBySlug`, `getRelatedProducts`, `productOptions`, `packagingFormats`)
- `data/media.ts` — the imagery registry

Adding a product means appending to `products` in `data/products.ts` — the `/products/[slug]` route (via `generateStaticParams`), cards, related products, the enquiry-form dropdown and the Product JSON-LD all derive from that array. Only `navigation` in `data/company.ts` needs a manual entry for the header dropdown.

### 2. Imagery is slot-addressed, with vector scenes as the default

`MediaSlot` (defined in `data/products.ts`) is the union of every image position on the site. `<Media slot="…">` looks the slot up in `data/media.ts`: if `src` is set it renders `next/image`; otherwise it renders the hand-drawn SVG scene from `components/media/scenes.tsx`. Callers never branch on which.

- Switching a slot to a real photograph is a `data/media.ts` edit only — never a component change.
- Adding a slot means extending the `MediaSlot` union **and** adding entries to both `media` (`data/media.ts`) and `scenes` (`components/media/scenes.tsx`); both are `Record<MediaSlot, …>`, so TypeScript will point at the gaps.
- Scenes build SVG gradient/filter ids from their `id` prop. Where a page can render the same slot twice, pass a distinct `idPrefix` to `<Media>` or the duplicate ids cross-wire the artwork.
- The scene library (`scenes.tsx`, `artworkParts.tsx`, `materials.tsx`, ~1200 lines) is server-only by construction — keep it out of `"use client"` components so it stays out of the client bundle.
- `next.config.ts` sets `dangerouslyAllowSVG: true`; it is safe only because every served asset is our own. Don't point `src` at a remote host.

### 3. One motion language

`lib/motion.ts` holds the single easing curve, duration and travel distance (`easePremium`, `baseTransition`, `fadeUp`, `stagger`, `wordMask`, `viewportOnce`). The `components/motion/` primitives (`Reveal`, `StaggerGroup`, `Parallax`, `Counter`, `HeadlineReveal`) are the only things that should animate. Compose them rather than writing new one-off `motion.*` calls or bespoke transitions.

Animate only `transform`/`opacity`. GSAP is used in exactly one place — `components/sections/SourceStory.tsx` — and is dynamically imported as its section approaches the viewport; keep it that way rather than importing GSAP at module scope anywhere.

**Never call `useReducedMotion()` during render.** It returns `false` on the server (no `matchMedia`) and `true` on a reduced-motion client, so branching on it in `initial`/`style` emits different markup on each side and trips a hydration mismatch on every page. Reduced motion is handled in two places instead:

- **Tweened animation** — `<MotionProvider>` in `app/layout.tsx` wraps the tree in `MotionConfig reducedMotion="user"`, which suppresses transform animations at animation time without changing what renders.
- **Scroll-linked values** — `Parallax` and the `HeadlineReveal` character sweep bind a MotionValue directly, which Framer cannot suppress. They carry `data-parallax-layer`, `data-scroll-fade` and `data-sweep-char`, neutralised by the `prefers-reduced-motion` block in `app/globals.css`.

`Counter` may read the hook, but only inside an effect (it collapses the duration to 0), never during render.

`"use client"` is deliberately confined to the form, header/mobile menu, FAQ, hero, `SourceStory` and the motion primitives. Everything else is a server component.

### Styling

Tailwind v4 with all tokens in the `@theme` block of `app/globals.css` — the palette (`ink-*`, `bronze-*`, `cream-*`, `leaf-*`), fonts, `spacing-section`, shadows, and the shape scale (`--radius-control` 8px, `--radius-card` 14px, `--radius-tile` 18px, `--shadow-soft`). Use token classes (`bg-ink-900`, `text-bronze-400`), not raw hex. Shared component classes `.container-x`, `.eyebrow`, `.rule`, `.grain`, `.dot-field` are defined there too. Fonts come from `next/font/google` in `app/layout.tsx` and are wired through CSS variables.

### Design DNA

`design/design-dna.json` is a three-dimension design profile (system / style / effects) extracted from a reference agri-export site, kept as the written rationale for the visual language: banded dark↔light rhythm, `.dot-field` on light bands, staggered rounded portrait tiles, the filled-plus-hairline-border button with its trailing arrow and asymmetric padding, and the scrubbed character sweep on headlines.

Only the *grammar* was adopted. The palette, Cormorant/Inter pairing, vector artwork and copy are DJ Export's own and deliberately diverge from the reference — the profile's `measured_palette` describes the reference, not this site, so `scripts/verify.mjs` from the `design-dna` skill will report a large ΔE against it by design. Do not "correct" the palette toward that measurement.

### SEO

`lib/seo.tsx` generates all structured data (`organizationJsonLd`, `productJsonLd`, `faqJsonLd`) from typed content plus the `<JsonLd>` renderer; `absoluteUrl` builds URLs from `siteConfig.url`. Page metadata is per-route `metadata` / `generateMetadata`, with the title template set in `app/layout.tsx`. `app/sitemap.ts` and `app/robots.ts` derive from the same data.

### Enquiry flow

`components/forms/QuoteForm.tsx` (client, validates) → `POST app/api/quote/route.ts` (re-validates server-side). The route is the single integration point for a delivery channel: it forwards to `QUOTE_WEBHOOK_URL` when set and otherwise `console.info`s the enquiry so nothing is lost. `/contact?product=<slug>#quote` pre-selects a product; product pages already link that way.

## Content integrity rules

This is a real business site with legal exposure, and the existing content follows these deliberately:

- **Nothing is invented.** No licence number, certification mark, testimonial, customer logo or trade statistic anywhere in the project. The compliance section is typographic by design — do not add certification badges or fill in a plausible-looking registration number.
- Items marked `PLACEHOLDER` in `data/company.ts` (email, phone, WhatsApp, address, founded year, FSSAI and IEC references, socials) are unset on purpose and must be supplied by the client. Leave them, don't guess them.
- Specification values are indicative standard Indian trade grades, and every specification table says exact figures are confirmed per lot and in the contract. Keep that caveat attached to any new spec table.

## Accessibility baseline

Skip link, semantic landmarks, one `h1` per page, no heading-level skips, keyboard-accessible nav, focus-trapped mobile menu with `Escape` to close. `prefers-reduced-motion` is respected both in CSS (`app/globals.css`) and per-component; `SourceStory` renders its finished state instead of the scroll animation. New work is expected to hold this line.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
