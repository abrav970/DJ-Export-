# Phase 14 — Final creative QA

A critical audit of the homepage against the intended experience:
Wayanad → pepper / coffee / cardamom → quality → export → international market.

**Nothing in this document has been implemented.** The brief asks for the ten
weakest parts and for approval before any of them is acted on. The one exception
is noted at the bottom, and it is a defect introduced during this session rather
than a QA finding.

Page shape as audited: 11,122 px of document, roughly fifteen screens at a
742 px viewport, eight top-level sections, four scroll-linked passages.

---

## The ten weakest parts

> **Two of these no longer stand.** #1 was withdrawn after re-measuring (the
> detail is kept in place rather than deleted, because how it went wrong matters
> more than the finding did), and #8 described a section that has since been
> removed. Eight live findings remain.

### ~~1. The scrim is destroying the best photograph on the site~~ — WITHDRAWN

**This finding was wrong and is retracted.**

It claimed the hero rendered as "a flat, desaturated, olive-green murk" and
blamed the green `ink-950` scrims. Re-checked on a foregrounded tab, the hero
renders exactly as composed: warm amber light, a dark ground, and three clearly
separated bowls. Nothing is wrong with the scrim.

The murk was an artifact of the measuring environment. The automated tab runs
backgrounded, which freezes CSS transitions mid-flight, and the hills layer —
which is `opacity: 0` in the markup and carries a 0.92 `ink-950` wash of its own
— was stuck partly visible, painting that wash straight over the commodities.
What I photographed was a half-applied layer, not the page.

The lesson is the one this project keeps relearning: **advance frames before
measuring, and never read a paint state from a hidden tab.** Every other finding
here rests on the DOM, the served HTML or a foregrounded screenshot; this one
rested on a screenshot alone, and it is the one that was wrong.

### 2. The hero shows roasted coffee; the catalogue sells green — HIGH

**Problem.** The third bowl in the hero holds dark, glossy, unmistakably
**roasted** coffee. Every grade DJ Export actually offers is green: Robusta
Cherry AB/PB, Robusta Parchment AB, Arabica Plantation A, Arabica Cherry AB —
cherry, parchment and plantation preparations, screen 13–18, 60 kg jute bags.
Nothing roasted is sold, and the product macro two screens later correctly shows
"cleaned and graded green coffee beans".

**Why it hurts.** "Coffee roasters" is one of the four buyer types the site names
as a target. A roaster is buying green coffee to roast themselves; a hero that
opens on roasted beans signals either a different product or a company that does
not know its own trade. It is the sort of detail that costs credibility silently,
because the visitor never tells you why they left.

**Fix.** Replace or retouch the third bowl with green beans. This is a
photography commission, and it should be folded into whichever shoot replaces the
unverified assets in finding 3. In the interim, the alt text should stop saying
"coffee beans" and say what is actually pictured.

**Priority: high.** It is a factual mismatch on the first screen.

### 3. Four unverified assets sit beside documentary photography — HIGH, client-blocked

**Problem.** `CREDITS.md` records that the `.png` files were supplied by the
client and that their provenance could not be established. Their filenames —
`THE THREE-PRODUCT HERO COMPOSITION.png`, `LOADING INTO CONTAINER.png`,
`CONTAINER  SHIP IMAGE.png`, `hero background.png` — and their look (flawless
staging, volumetric haze, no imperfection anywhere) are consistent with
generated imagery. Two of them are on the opening screen.

They are interleaved with genuine documentary Pexels frames — real hands over a
real grading tray, real jute sacks in a real store — and the mismatch in texture
between the two sets is visible.

**Why it hurts.** The eighth dimension is whether this reads as an actual
international exporter. A generated hero on an agricultural export site is the
single fastest way to answer no, and the risk is asymmetric: nobody notices when
photography is real, and the ones who notice it is not are exactly the
professional buyers this page is for.

**Fix.** Confirm provenance with the client, and replace anything generated.
`SHOTLIST.md` already carries the briefs. Not actionable in code.

**Priority: high, but blocked on the client.**

### 4. There is no proof of credibility until screen eight — MEDIUM-HIGH

**Problem.** The FSSAI and IEC references — the only third-party credentials the
business has — appear inside `<ProductSpecs>`, roughly seven screens down. Above
that the page offers atmosphere and product, but nothing a procurement officer
can check.

Meanwhile `trustPoints` in `data/company.ts` — four written, on-message
credibility lines — **is referenced by nothing anywhere in the project.** It is
dead data that was written for exactly this job.

**Why it hurts.** A B2B buyer scans for legitimacy signals early and leaves if
they are absent. The site currently asks for a great deal of scrolling before it
offers any.

**Fix.** Either mount the trust strip under the hero as originally intended, or
delete `trustPoints` so the data layer stops implying a section that does not
exist. The first is better; the second is at least honest. If mounted, keep it
to one line each — it is a scanning aid, not a features section.

**Priority: medium-high.** Small change, direct effect on the credibility
dimension.

### 5. Two pinned passages share the same structure, three screens apart — MEDIUM

**Problem.** `<ProductSequence>` and `<Journey>` are both "one held frame, the
subject inside it changes, type beside it, hairline progress". They differ in
wipe direction and pace — deliberately, and that work was worth doing — but the
underlying composition is the same one twice, and the second runs for 3,222 px.

**Why it hurts.** The fourth dimension asks whether scrolling feels like
controlling a timeline. It does, twice, in the same way. By the second passage
the reader has learned the gesture, and learning a gesture is what turns
choreography into a mechanism.

**Fix.** Change the *composition*, not the timing. The sourcing journey could put
the frame full-bleed with the type overlaid, or split the frame, or run the
stages horizontally. Anything that stops the reader recognising the layout.

**Priority: medium.** A real weakness, but the fix is a redesign of a section
that currently works.

### 6. The reader's last sight of the product is six screens before the ask — MEDIUM

**Problem.** The page now ends: container ship photograph → CTA (type on flat
forest). Removing the route chart improved this — the closing stretch is one
abstract screen rather than two — but the underlying gap is unchanged. The last
time a commodity is on screen is the sourcing journey; between there and the
enquiry the reader sees a vessel and then a paragraph.

**Why it hurts.** The seventh dimension — do the commodities feel tangible — is
answered strongly in the middle of the page and not at all at the point where
the reader is asked to act.

**Fix.** One small, quiet product macro in the CTA. It does not need motion; it
needs presence.

**Priority: medium.**

### 7. The cardamom frame is generic and the heaviest asset on the page — MEDIUM

**Problem.** `cardamom-plantation.jpg` reads as undifferentiated green foliage —
a viewer who is not told cannot tell it is cardamom. It is also 407 KB, 31% of
all image bytes on the homepage (see the performance report).

**Why it hurts.** It is one of three frames carrying the range, and it is the one
that does not show its product. The other two — pepper on the vine, coffee
cherries on the branch — are legible instantly.

**Fix.** One frame, closer in, where the capsules are visible at the base of the
plant. Solves the visual and the payload in the same shot.

**Priority: medium.**

### ~~8. The global chart is desktop-only~~ — REMOVED WITH THE SECTION

The international-markets section this described has since been deleted at the
client's request, so the finding no longer applies. The homepage now closes
crossing → enquiry.

### 9. Fifteen screens, and the only in-page CTA above the fold is in the header — MEDIUM

**Problem.** The homepage is 11,122 px. A buyer who already knows they want a
quote has the header button, and after that nothing until `<ProductSpecs>` at
screen eight.

**Why it hurts.** The page is built as one continuous passage, which is the right
call for a first-time visitor and the wrong one for a returning buyer. Both use
the same page.

**Fix.** Not another CTA band — that would break the passage. Either a persistent
mobile enquiry affordance, or accept the length as a deliberate choice for the
primary audience and make sure `/contact` is reachable in one tap from anywhere.
It currently is, via the header.

**Priority: medium, and partly a strategy question rather than a design one.**

### 10. Section labels still carry five different trackings — LOW

**Problem.** `--tracking-label` is 0.28em. Section labels across the site use
0.32em, 0.28em, 0.24em, 0.22em and 0.2em. This is documented in `CLAUDE.md` as
known drift from the token-naming phase.

**Why it hurts.** The sixth dimension is whether the typography feels premium and
editorial. At this scale nobody consciously sees a 0.04em difference, but
consistency across a page is most of what "editorial" means.

**Fix.** Converge on the token when touching a section for another reason — which
is what `CLAUDE.md` already instructs — rather than as a sweep. Several of the
sections above will be touched anyway.

**Priority: low.**

---

## Where the page is strong

Recorded so the list above is not read as a verdict:

- **Section transitions.** All seven boundaries measured: zero gap, five exact
  colour matches, two photo-backed and previously measured. There is no abrupt
  jump anywhere on the page, and no dark-to-light flip.
- **Layout stability.** CLS 0.0000 with zero shift entries, across 33 images.
- **Reduced motion.** Under `reduce`, 3 of 16 ScrollTriggers survive, and they
  are exactly the three position readouts that should. The page is still
  navigable and every story still advances.
- **Content integrity.** No invented licence number, certification, testimonial,
  customer or statistic. The global section names one place — the one the
  catalogue supports — and refuses to name a destination market.
- **Business clarity.** The headline states products, origin and market in one
  sentence on the first screen.

---

## The one change already made

`<Crossing>`'s new copy read "Cleared, loaded and on the water." **"Cleared"** in
a shipping context reads as customs-cleared, which is a specific claim about a
specific responsibility, and this site does not make claims it cannot support.
Changed to "From Wayanad, to the water."

This was a defect in work done during this session rather than a QA finding, so
it was corrected rather than queued.
