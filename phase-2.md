# PHASE 2 — ESTABLISH DJ EXPORT EXPERIENCE SYSTEM

Based on the approved audit, establish the foundation for the new DJ Export experience.

Use the UI UX Pro Max guidance for the design-system and UX decisions.

Use the relevant cinematic/GSAP/Lenis skills for the motion architecture.

Do not redesign individual sections yet.

## Create a unified visual system

Define:

* typography hierarchy
* display typography
* body typography
* colors
* spacing
* container widths
* border radius
* image treatment
* button treatment
* navigation treatment
* section spacing
* responsive breakpoints

The visual identity must remain:

premium
editorial
natural
international
agricultural-origin focused

## Create a motion system

Define reusable motion tokens/configuration for:

* duration
* easing
* reveal distance
* stagger
* parallax strength
* scale ranges
* opacity ranges
* rotation ranges
* scrub behavior
* transition timing

Prefer a centralized motion configuration rather than hardcoded values scattered throughout components.

## Motion principles

Use:

* slow cinematic movement
* restrained easing
* natural acceleration/deceleration
* subtle depth
* layered parallax
* intentional reveals

Avoid:

* excessive bounce
* aggressive spring effects
* random animation
* excessive rotation
* excessive scale
* animation on every element

## Build reusable animation utilities

Create reusable utilities/components for:

* fade reveal
* slide reveal
* masked image reveal
* staggered text reveal
* parallax
* pinned section
* scroll-scrubbed sequence
* section transition
* scroll progress

## Lenis

Set up Lenis correctly and integrate it with GSAP/ScrollTrigger.

Ensure ScrollTrigger receives the correct scroll updates.

## Accessibility

Implement prefers-reduced-motion behavior.

When reduced motion is enabled:

* remove large transforms
* remove unnecessary parallax
* disable complex WebGL effects
* retain content visibility
* preserve usability

## Important

Do not create the final homepage animations yet.

First establish the reusable foundation and verify that the existing website still works.
