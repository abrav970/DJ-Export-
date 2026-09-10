# DJ Export — Photography Shot List

Twelve photographs are needed. Until each one is supplied the site renders a tonal
placeholder plate in its place, so the site is complete and shippable today and
becomes photographic one image at a time.

**This list mirrors `data/media.ts`.** If the two ever disagree, `data/media.ts` is
the source of truth.

## How to add a photograph

1. Drop the file at the path in the **File** column, e.g. `public/images/hero/hero-export.jpg`
2. Open `data/media.ts`, find the slot, and change `src: null` to that same path string
3. That is the whole change — sizing, responsive srcsets, AVIF/WebP conversion,
   lazy-loading and alt text are already wired

## House style

Every image must look like it belongs to the same company:

- **Natural light only.** No studio flash, no artificial fill.
- **Restrained grading.** Correct the white balance; do not push saturation or contrast.
  Green cardamom in particular must stay its true colour.
- **Documentary, not advertising.** Real working environments, real hands, real texture.
- **No stock-photo signatures.** No lens flare, no drone hero shots, no models,
  no props arranged for the camera.
- **No people's faces required.** Hands at work are welcome; portraits are not needed.

## Constraints

- **Only photograph DJ Export's own sourcing, handling and shipping.** Do not
  substitute another company's estate, warehouse or port. Depicting facilities the
  business does not operate is a factual claim, not a design choice.
- No certification marks, licence numbers or third-party logos in frame.
- Deliver as JPEG at the stated minimum width. Do not upscale; `next/image` handles
  every downscale.

---

## Product (`/images/products/`)

| Slot | File | Brief |
|---|---|---|
| `coffee-cherries` | `coffee-cherries.jpg` | 3:4 portrait, min 1600px wide. Macro on a branch of ripe red cherries, shallow depth of field. Natural daylight, no flash. Foliage falls away soft behind. |
| `coffee-beans` | `coffee-beans.jpg` | 4:5 portrait, min 1600px wide. Overhead macro of green beans filling the frame, raked side light to bring out individual bean texture and colour variation. |
| `peppercorns` | `peppercorns.jpg` | 3:4 portrait, min 1600px wide. Macro of dried black peppercorns, side light so the wrinkled surface reads. Dark ground, no props, no styling. |
| `cardamom-pods` | `cardamom-pods.jpg` | 3:4 portrait, min 1600px wide. Macro of green capsules filling the frame. True natural green — do not saturate. Soft directional daylight. |

## Hero (`/images/hero/`)

| Slot | File | Brief |
|---|---|---|
| `hero-export` | `hero-export.jpg` | 16:9 landscape, min 2400px wide. Wide environmental shot of hill estate terraces at first light. Natural low-angle sun, mist in the valleys. **Composition must keep the left third quiet — the headline sits there.** No people, no signage. |
| `wayanad-hills` | `hero-plantation.jpg` | 3:2 landscape, min 2400px wide. **This is the one frame that should genuinely be Wayanad.** Receding ridge lines with cloud separating the layers, so there is real depth to move the camera through. The upper third carries the headline — keep it quiet and mid-toned. First light or overcast; no people, no built structures, no drone-stock look. Until a genuine frame is supplied the slot runs licensed stock whose location is unrecorded, and its alt text says nothing about where it is. |

## Sourcing (`/images/sourcing/`)

| Slot | File | Brief |
|---|---|---|
| `plantation` | `plantation.jpg` | 3:4 portrait, min 1600px wide. Looking through the shade canopy onto coffee bushes. Dappled natural light, deep greens, no colour grading. Documentary, not staged. |
| `shade-canopy` | `plantation.jpg` | 2:3 portrait, min 1600px wide. **Should genuinely be Wayanad** — it is the near plane of the origin section, directly under a heading that names the district. Close in under the canopy on a single bush in fruit: the step from landscape to crop. Dappled shade, deep greens, no grading, no styling. Until a genuine frame is supplied the slot runs licensed stock whose location is unrecorded, and its alt text says nothing about where it is. |
| `pepper-vine` | `pepper-vine.jpg` | 4:5 portrait, min 1600px wide. Pepper spikes on the vine against the support tree, natural shade light. Green berries clearly resolved. |
| `cardamom-plantation` | `cardamom-plantation.jpg` | 4:5 portrait, min 1600px wide. Cardamom understory beneath heavy shade, cool green light, capsules visible at the base of the plant. |
| `landscape` | `landscape.jpg` | 3:4 portrait, min 1600px wide. Receding ridge lines with atmospheric haze separating the layers. First light. No people, no built structures. |

## Process (`/images/process/`)

| Slot | File | Brief |
|---|---|---|
| `coffee-drying` | `coffee-drying.jpg` | 16:9 landscape, min 2000px wide. Raised drying beds receding into the frame, hard midday sun. Hands raking the bed are welcome — documentary style, faces not required. |

## Export (`/images/export/`)

| Slot | File | Brief |
|---|---|---|
| `packing` | `packing.jpg` | 16:9 landscape, min 2400px wide. Stacked and marked export sacks in a working space. Warm practical light. **Used behind text at low opacity — keep the composition simple and mid-toned.** |
| `logistics` | `logistics.jpg` | 16:10 landscape, min 2000px wide. Containers stacked at port, or a container being stuffed. Overcast or early light. Documentary, no lens flare, no drone-stock look. |
