import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    /*
      The 16 is a decoy rung, not a device.

      Several sections render a desktop branch and a small-screen branch into
      the same document and hide one with "display: none". A hidden <img> is
      still fetched, so both branches used to download a real photograph — 410KB
      of the homepage's 1830KB of imagery was a second copy of a picture the
      page already had.

      The fix is the pattern the hero established: give the branch that is not
      rendering a "sizes" of 1px, so the browser resolves the smallest candidate
      in the srcset. That only works if the srcset *has* a small candidate. Next
      builds the srcset from this list whenever "sizes" contains a vw unit —
      "imageSizes" is not consulted — so with 420 as the floor every decoy still
      pulled a 420-wide image, 6 to 40KB each.

      A 16-wide rung costs nothing and is unreachable by accident: the smallest
      real branch resolves to 100vw, which on a 360px phone at DPR 3 asks for
      1080. Nothing but a 1px decoy will ever select it.
    */
    deviceSizes: [16, 420, 640, 828, 1080, 1280, 1600, 1920, 2400],
  },
  poweredByHeader: false,
};

export default nextConfig;
