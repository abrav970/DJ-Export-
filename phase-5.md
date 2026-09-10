# PHASE 5 — CINEMATIC PRODUCT SEQUENCE

Replace the conventional product-card presentation with a continuous cinematic product sequence.

The three products are:

1. Black Pepper
2. Coffee
3. Cardamom

The sequence should feel like one continuous scene rather than three disconnected cards.

## Narrative

WAYANAD
↓
PEPPER
↓
COFFEE
↓
CARDAMOM
↓
EXPORT

## Structure

Create a pinned/scrubbed visual sequence.

During scrolling:

### Scene 1 — Pepper

Pepper becomes the dominant visual.

Use:

* large product imagery
* macro texture
* product name
* origin
* concise commercial information

Animation:

* scale
* position
* subtle rotation where appropriate
* depth
* text reveal

### Scene 2 — Coffee

Pepper gradually exits.

Coffee enters from another spatial layer.

The transition should use overlapping movement rather than a simple fade.

### Scene 3 — Cardamom

Coffee transitions out.

Cardamom becomes dominant.

## Important

Do not make the products look like floating random objects.

Their movement should have a clear visual hierarchy.

Use real product photography/assets.

If transparent product assets are available, use them for foreground depth.

## Technical implementation

Use:

GSAP
ScrollTrigger
Lenis
CSS 3D
masked reveals

Use Three.js only if a genuine 3D object or spatial scene adds meaningful value.

Do not make the entire product section WebGL unnecessarily.

## Mobile

Create a simplified version with fewer layers and less movement.

Do not simply scale down desktop.

## Output

Implement only this product sequence and test it thoroughly.
