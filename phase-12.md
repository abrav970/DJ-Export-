# PHASE 12 — MOBILE EXPERIENCE

Now optimize the entire cinematic experience for mobile.

Do not simply scale the desktop implementation.

Audit every animation and section.

## Mobile principles

Prioritize:

1. readability
2. performance
3. touch interaction
4. storytelling
5. visual hierarchy

Reduce:

* number of depth layers
* 3D complexity
* particle count
* simultaneous animations
* large transform distances
* expensive WebGL effects

Preserve:

* product storytelling
* Wayanad origin
* typography hierarchy
* masked reveals
* major transitions
* export journey

## Touch

Do not rely on hover.

Any hover-only information must have a touch/mobile equivalent.

## WebGL

Disable or simplify expensive WebGL scenes on lower-powered devices where appropriate.

## Reduced motion

Respect:

prefers-reduced-motion

Provide a meaningful static/low-motion experience.

## Test

Verify:

* small phones
* large phones
* tablets
* desktop
* landscape mobile

Fix overflow, CLS, text wrapping and scroll-jank.
