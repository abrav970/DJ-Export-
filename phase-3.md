# PHASE 3 — CINEMATIC HERO IMPLEMENTATION

Now upgrade only the DJ Export homepage hero.

Do not modify the other homepage sections yet.

## Creative objective

The hero should communicate:

Wayanad, Kerala, India
→
premium pepper, coffee and cardamom
→
international markets

It should feel like entering a physical environment rather than viewing a conventional hero banner.

## Visual structure

Create layered depth:

Layer 1:
Wayanad/plantation background

Layer 2:
atmospheric/environmental imagery

Layer 3:
product imagery or foreground visual elements where appropriate

Layer 4:
hero typography

Layer 5:
navigation/CTA

Use subtle depth and parallax.

## Scroll behavior

The hero should be pinned while the user scrolls through the cinematic sequence.

During scroll:

1. Hero establishes Wayanad.
2. Background slowly moves.
3. Foreground moves at a different rate.
4. Hero typography subtly shifts.
5. Image scales/pushes forward.
6. Visual depth increases.
7. Hero transitions naturally into the Wayanad origin section.

Use GSAP ScrollTrigger with scrub.

Use Lenis for smooth scrolling.

Use CSS 3D where sufficient.

Do not introduce Three.js unless the visual cannot be achieved convincingly with CSS/GSAP.

## Typography

Use restrained editorial text animation.

Prefer:

* line reveal
* word reveal
* subtle stagger
* mask reveal

Avoid:

* bouncing letters
* excessive rotation
* gimmicky text effects

## Performance

Use optimized images.

Avoid loading unnecessary assets before they are needed.

## Deliverables

Implement the hero only.

Then test:

* desktop
* tablet
* mobile
* reduced motion

Do not proceed to the next section until the hero is stable.
