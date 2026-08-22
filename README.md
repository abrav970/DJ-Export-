# DJ Export — B2B agricultural export website

Marketing and enquiry site for DJ Export, an India-based exporter of coffee,
black pepper and cardamom. Built for international B2B buyers: importers,
distributors, wholesalers, roasters and food companies.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
npm run typecheck
```

Copy `.env.example` to `.env.local` and fill in the values you need.

---

## What to edit first

Everything a non-developer is likely to change lives in `data/`.

| File | Contents |
| --- | --- |
| `data/company.ts` | Contact details, licence references, statistics, trust points, process steps, buyer types, FAQ copy, navigation |
| `data/products.ts` | The product catalogue: specifications, grades, packing, quality notes, HS codes |
| `data/media.ts` | Which image is used in each slot on the site |

Items marked `PLACEHOLDER` in `data/company.ts` **must** be replaced before the
site goes live: email, phone, WhatsApp number, registered address and the FSSAI
and IEC registration numbers. No licence number, certification mark,
testimonial, customer logo or trade statistic has been invented anywhere in the
project — the licence section is typographic by design.

Specification values describe standard Indian trade grades and are presented as
indicative; every specification table states that exact figures are confirmed
per lot and in the contract.

### Adding a product

Append an entry to `products` in `data/products.ts`. The route
(`/products/<slug>`), navigation entry, cards, related-products list, enquiry
form dropdown and JSON-LD all read from that array — no component changes
needed. Add the product to `navigation` in `data/company.ts` if it should
appear in the header dropdown.

---

## Imagery

The site ships with art-directed vector scenes drawn in the brand palette
(`components/media/scenes.tsx`), so it looks complete and loads fast without
stock photography. Every visual is addressed by a **slot**.

To use real photographs, drop the files in `public/images` and set `src` on the
slot in `data/media.ts`:

```ts
"coffee-cherries": {
  src: "/images/coffee-cherries.jpg",
  alt: "Ripe coffee cherries on the branch before picking",
  position: "center 40%", // optional focal point
},
```

`<Media>` then renders it through `next/image` — sizing, lazy loading, modern
formats and alt text all continue to work unchanged. Suggested source sizes:
2400px wide for full-bleed scenes, 1600px for feature and gallery images.

Where a page could render the same slot twice, pass `idPrefix` to `<Media>` so
the scene's internal SVG gradient and filter ids stay unique.

---

## Enquiry form

`components/forms/QuoteForm.tsx` validates client-side and posts to
`app/api/quote/route.ts`, which re-validates on the server. That route is the
single place to connect a delivery channel:

- set `QUOTE_WEBHOOK_URL` to forward each enquiry as JSON (CRM, Zapier, n8n,
  internal endpoint), or
- replace the webhook block with an email provider SDK, or a WhatsApp Business
  API call.

Until a channel is configured the route records enquiries in the server log so
nothing is silently lost. A product can be pre-selected by linking to
`/contact?product=coffee#quote`, which the product pages already do.

---

## Project structure

```
app/
  layout.tsx            Fonts, metadata, header/footer, Organization JSON-LD
  page.tsx              Homepage composition
  about/ products/ contact/
  products/[slug]/      Dynamic product pages (statically generated)
  api/quote/            Enquiry endpoint
  sitemap.ts robots.ts  SEO plumbing
components/
  layout/               Header, mobile menu, footer, logo lockups
  sections/             Homepage and page sections
  product/              Product card, specification table, detail body
  forms/                Enquiry form
  media/                Media resolver + vector scene library
  motion/               Reveal, stagger, parallax, counter, headline reveal
  ui/                   Buttons, section heading, eyebrow, icons
data/                   Company, products, media
lib/                    SEO helpers, motion language, small utilities
```

---

## Design system

The palette is sampled from the supplied logo — brushed bronze on deep charcoal
— with warm cream editorial sections and a muted plantation green used
sparingly. Tokens live in `app/globals.css` (`@theme`).

- Display: Cormorant Garamond — headlines and figures
- Body/UI: Inter — copy, labels, navigation
- Motion: one easing curve and one reveal distance, defined in `lib/motion.ts`

The logo artwork itself is used unmodified (`public/brand/dj-export-logo.jpg`).
In compact placements the mark is framed to the monogram, since the artwork's
own wordmark is unreadable at header size.

---

## Accessibility & performance notes

- Skip link, semantic landmarks, one `h1` per page, no heading-level skips
- Keyboard-accessible navigation, focus-trapped mobile menu, `Escape` to close
- Every animation respects `prefers-reduced-motion`; the scroll-driven section
  renders its finished state instead
- Animations are limited to `transform` and `opacity`
- GSAP is imported dynamically and only when its section approaches the
  viewport; the artwork library never enters the client bundle
- All pages are statically generated
