The latest implementation is visually much better. DO NOT redesign the visual language again.

I have reviewed the latest version and want you to focus on the remaining composition, imagery, motion and interaction issues.

First use the UI/UX Pro Max skill and Frontend Design skill again, plus any relevant animation/motion/GSAP skills available to you.

AUDIT THE CURRENT IMPLEMENTATION FIRST.

## 1. HERO COMPOSITION

The three hero products are currently not visible properly.

Coffee and Black Pepper are partially cropped.

Fix this without making the hero feel smaller.

- Move the hero text block slightly further LEFT.
- Reduce the text block width slightly if necessary.
- Give the product photography more horizontal breathing room.
- Reduce the hero gradient/overlay intensity.
- The photography should remain rich and visible.
- Do NOT simply shrink the entire hero image.
- Do NOT cover the products with additional overlays.

The final hero must clearly show:
Coffee + Pepper + Cardamom.

## 2. REPLACE PACKING / EXPORT IMAGE

The current packing/export image feels generic and does not match the premium editorial photography of the rest of the site.

Replace it with a genuinely premium, realistic, documentary-style image sourced from the web.

Search for high-quality real photography representing:

- agricultural commodity export
- spice/coffee warehouse
- premium export packing
- agricultural sacks
- workers handling export commodities
- international agricultural supply chain

Prioritize:
- real photography
- editorial/documentary quality
- natural lighting
- realistic textures
- premium composition
- no obvious stock-photo feeling
- no AI-looking imagery
- no visible third-party company branding/logos
- no watermarked images

The new image must visually match the existing hero and plantation photography.

Do NOT use a random generic warehouse image.

## 3. IMPLEMENT A GLOBAL SCROLL-REVEAL SYSTEM

This is now the biggest missing feature.

The page currently looks good but feels too static.

Implement sophisticated scroll-triggered reveals.

TEXT:
- reveal upward
- line-by-line or word-by-word
- opacity + translateY
- subtle stagger

IMAGES:
- clip-path reveal
- opacity
- scale 1.05/1.08 → 1
- subtle parallax

SECTION LABELS:
- subtle fade/reveal

Do NOT simply use the same fade-in animation everywhere.

Create a consistent but varied motion language.

## 4. HERO MOTION

On page load:

- background/image reveals subtly
- headline reveals line-by-line
- supporting text follows
- CTA follows
- image settles from slight scale
- navigation settles naturally

After loading:

Add very subtle desktop mouse-parallax to the hero image.

Disable mouse-parallax on mobile.

## 5. PRODUCT SECTION MOTION

Coffee, Pepper and Cardamom should not simply appear as static blocks.

As each product enters the viewport:

- image reveals through a mask
- image scales down subtly
- text reveals
- metadata appears
- product label follows
- supporting image has slightly different parallax movement

On hover:
- image subtly zooms
- crop moves slightly
- CTA/arrow shifts subtly

Keep everything elegant.

## 6. SOURCING SECTION

The plantation image and text should reveal as the user scrolls.

Example:

IMAGE:
scale 1.08 → 1

TEXT:
translateY 30px → 0

LABEL:
fade + slight letter-spacing transition

Add subtle image parallax.

Do not make the animation excessive.

## 7. CREATE CONTINUOUS TRANSITIONS

The homepage should feel like one continuous story:

ORIGIN
→ PRODUCTS
→ ESTATE
→ HARVEST
→ QUALITY
→ PACKING
→ EXPORT
→ GLOBAL MARKET

Avoid abrupt section changes.

Use subtle:
- background interpolation
- image overlap
- masks
- parallax
- color transitions

## 8. PACKING → EXPORT → GLOBAL

These sections should feel connected.

Do not make them look like three independent website sections.

Use scroll-driven transitions so the user's scrolling reveals the next stage.

If technically appropriate, use a pinned ScrollTrigger sequence.

The goal is:

PACKING
→ LOADED
→ DOCUMENTED
→ SHIPPED
→ GLOBAL

The user should feel like they are following one shipment.

## 9. TYPOGRAPHY REVEALS

Do not animate entire text blocks as one object.

Large headings should reveal:
- line by line
or
- phrase by phrase

Supporting copy should follow with a small delay.

Keep the motion subtle and premium.

## 10. ADD DEPTH

Use subtle layers:

background
→ main image
→ foreground crop
→ typography

Use different parallax speeds.

Do not add fake 3D effects.

## 11. MICRO-INTERACTIONS

Add subtle interaction to:

- buttons
- product images
- navigation links
- arrows
- CTA elements

Buttons:
- subtle background transition
- arrow moves 3–4px
- smooth easing

Images:
- subtle scale
- slight crop movement

Avoid exaggerated hover effects.

## 12. SCROLL EXPERIENCE

Audit the entire page while scrolling.

There should be no large dead zones where nothing responds to scrolling.

Every major section should have at least one meaningful response:
- text reveal
- image reveal
- parallax
- background transition
- product transition
- typography movement

Do not add animation just to fill space.

## 13. MOTION QUALITY

Use premium easing.

Prefer:
- smooth ease-out
- expo-like reveal
- controlled duration
- stagger

Avoid:
- bounce
- elastic
- excessive spring
- random rotations
- flashy effects

Animation should feel like a premium brand film.

## 14. PERFORMANCE

Use transform/opacity wherever possible.

Respect prefers-reduced-motion.

Do not introduce scroll jank.

Use performant GSAP/ScrollTrigger patterns if available.

## 15. FINAL AUDIT

After implementing everything, actually scroll through the entire homepage and evaluate:

- hero product visibility
- gradient intensity
- image quality
- scroll reveals
- typography reveals
- section transitions
- parallax
- hover interactions
- mobile behavior
- performance
- visual consistency

DO NOT STOP after adding a few fade-ins.

The target is:

STATIC PREMIUM DESIGN
→
CINEMATIC INTERACTIVE EXPERIENCE.

Preserve the current color palette, typography direction and overall visual identity because those are now working.

Focus this iteration on:
COMPOSITION + PREMIUM IMAGERY + SCROLL REVEALS + MOTION + INTERACTION + CONTINUOUS FLOW.