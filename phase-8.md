# PHASE 8 — WAYANAD TO INTERNATIONAL MARKET

Create a cinematic export journey showing the geographic relationship between DJ Export's source and international markets.

Narrative:

WAYANAD
↓
KERALA
↓
EXPORT
↓
INTERNATIONAL MARKET

## Visual concept

Create a restrained geographic visualization.

Possible implementation:

Option A:
HTML/CSS + SVG map

Option B:
Three.js

Option C:
React Three Fiber

Choose the simplest implementation that achieves the intended visual quality.

Do not use WebGL merely because it is available.

## Animation

As the user scrolls:

1. Origin is established.
2. Route begins.
3. Route travels outward.
4. International destinations appear.
5. Scene transitions toward the final global section.

Use ScrollTrigger scrub.

The movement should feel like a camera journey.

## Visual style

Avoid:

* glowing sci-fi maps
* excessive neon
* futuristic HUD
* gaming-style globe

Prefer:

* dark/earthy tones
* subtle lines
* minimal geographic detail
* editorial typography
* restrained motion

## Performance

Lazy-load the 3D scene if possible.

Do not block initial page rendering with Three.js.

Provide a fallback for mobile/reduced-motion.
