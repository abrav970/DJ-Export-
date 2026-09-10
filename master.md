# DJ EXPORT — EXPERIENCE UPGRADE MASTER DIRECTIVE

You are upgrading an existing production-quality website for DJ Export.

Do NOT rebuild the website from scratch.

Do NOT replace the existing brand identity unnecessarily.

Do NOT turn this into a generic SaaS, technology, agriculture-tech, or futuristic website.

## Business

DJ Export is an international B2B exporter specializing in:

* Black Pepper
* Coffee
* Cardamom

Products are sourced from Wayanad, Kerala, India and supplied to international markets.

The website must communicate:

Wayanad → Product → Quality → Export → International Market

The website should feel like a premium international commodity/export brand with cinematic editorial storytelling.

## Creative direction

The target experience is inspired by high-end immersive/Awwwards-style websites.

The website should use:

* cinematic scroll storytelling
* scroll-driven animation
* smooth/inertial scrolling
* parallax
* depth
* layered compositions
* pinned sections
* scroll scrubbing
* masked image reveals
* staggered typography
* cinematic scene transitions
* subtle 3D
* selective WebGL/Three.js
* premium editorial typography
* realistic documentary photography

The experience must remain elegant, restrained and commercially credible.

Avoid excessive:

* gradients
* neon
* glassmorphism
* futuristic HUD interfaces
* random particles
* unnecessary 3D
* excessive cursor effects
* gimmicky animations

## Technical direction

Use the existing application architecture wherever practical.

Use:

* GSAP
* GSAP ScrollTrigger
* Lenis
* Three.js
* React Three Fiber if appropriate
* CSS 3D transforms
* clip-path/masking
* WebGL only where it provides meaningful visual value

Use HTML/CSS for semantic content and GSAP for choreography.

Use Three.js/WebGL selectively rather than rendering the entire website through WebGL.

## Critical implementation rules

1. Preserve existing functionality.
2. Preserve SEO-relevant content and routes.
3. Preserve existing useful components.
4. Avoid unnecessary dependency changes.
5. Avoid rewriting working code without a reason.
6. Make animations reusable rather than duplicating animation logic.
7. Keep desktop and mobile behavior explicitly designed.
8. Respect prefers-reduced-motion.
9. Do not create animation merely for decoration.
10. Every major animation must support the visual story.

## Motion philosophy

The page should not feel like:

Hero → Section → Section → Section.

It should feel like one continuous visual journey:

Wayanad
↓
Pepper / Coffee / Cardamom
↓
Selection / Quality
↓
Export
↓
International Market

The scroll position should function as a cinematic timeline.

## Important

Do not implement anything yet.

First perform a complete audit of the existing codebase and produce an implementation plan.

Wait for approval before modifying files.
