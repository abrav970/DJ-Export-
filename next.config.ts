import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Local, art-directed vector artwork is used until real photography is supplied.
    // Only our own assets are served, so inline SVG optimisation is safe here.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 828, 1080, 1280, 1600, 1920, 2400],
  },
  poweredByHeader: false,
};

export default nextConfig;
