# PHASE 13 — PERFORMANCE AND PRODUCTION HARDENING

Perform a complete production performance audit.

Do not change the visual direction unnecessarily.

Inspect:

* LCP
* CLS
* INP
* JavaScript bundle
* image sizes
* image formats
* font loading
* lazy loading
* animation performance
* GPU usage
* WebGL performance
* memory usage
* mobile FPS
* unnecessary re-renders
* ScrollTrigger instances
* event listeners
* cleanup of animation contexts

## Images

Use appropriate:

* WebP/AVIF
* responsive image sizes
* lazy loading where appropriate
* priority loading only for critical hero assets

## GSAP

Ensure:

* ScrollTriggers are cleaned up
* React lifecycle is handled correctly
* animations do not create memory leaks
* unnecessary DOM reads/writes are avoided

## Three.js

Ensure:

* renderer is properly disposed
* geometries/materials/textures are disposed
* scenes are lazy-loaded where appropriate
* unnecessary render loops are eliminated
* pixel ratio is capped appropriately

## Goal

Maintain the cinematic experience without sacrificing real-world usability.

Produce a performance report with:

Before
After
Remaining issues
Recommended fixes
