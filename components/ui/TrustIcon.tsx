import type { TrustPoint } from "@/data/company";

/**
 * Minimal line icons drawn to one grid — no icon library, no filled shapes,
 * so they sit quietly next to the typography.
 */
const paths: Record<TrustPoint["icon"], React.ReactNode> = {
  leaf: (
    <>
      <path d="M6 26C6 15 14 8 26 7c1 12-6 20-17 20H6z" />
      <path d="M6 26C11 21 16 17 24 13" />
    </>
  ),
  origin: (
    <>
      <circle cx="16" cy="16" r="11" />
      <path d="M5 16h22M16 5c3 3.5 4.5 7.5 4.5 11S19 24.5 16 27c-3-2.5-4.5-6.5-4.5-11S13 8.5 16 5z" />
    </>
  ),
  document: (
    <>
      <path d="M8 4h11l5 5v19H8z" />
      <path d="M19 4v5h5M12 16h8M12 21h8" />
    </>
  ),
  package: (
    <>
      <path d="M16 4l11 6v12l-11 6-11-6V10z" />
      <path d="M5 10l11 6 11-6M16 16v12" />
    </>
  ),
  handshake: (
    <>
      <path d="M4 13l6-5 6 3 6-3 6 5" />
      <path d="M10 21l4 4 3-3 3 3 4-4" />
      <path d="M4 13v6l6 2M28 13v6l-6 2" />
    </>
  ),
  message: (
    <>
      <path d="M5 7h22v15H15l-7 6v-6H5z" />
      <path d="M11 13h10M11 17h6" />
    </>
  ),
};

export const TrustIcon = ({ name }: { name: TrustPoint["icon"] }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {paths[name]}
  </svg>
);
