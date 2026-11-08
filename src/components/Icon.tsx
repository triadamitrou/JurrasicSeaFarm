import type { IconName } from "@/lib/site";

/**
 * Line icons for the industries Sugar Kelp serves. Drawn on a 24 grid
 * in one stroke weight so they read as a set, and coloured by
 * currentColor so they follow whatever section they sit in.
 */
const paths: Record<IconName, React.ReactNode> = {
  // A bowl with steam: food and drink.
  bowl: (
    <>
      <path d="M3 12h18a9 9 0 0 1-18 0Z" />
      <path d="M8 3c-1 1.2-1 2.3 0 3.5s1 2.3 0 3.5" />
      <path d="M12.5 3c-1 1.2-1 2.3 0 3.5s1 2.3 0 3.5" />
    </>
  ),
  // A drop: cosmetics.
  droplet: <path d="M12 3s6.5 7.2 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10.2 12 3 12 3Z" />,
  // A seedling: plant health.
  sprout: (
    <>
      <path d="M12 21v-9" />
      <path d="M12 12C12 7.5 8.5 5 4 5c0 4.5 3.5 7 8 7Z" />
      <path d="M12 14c0-3.6 2.8-6 7-6 0 3.6-2.8 6-7 6Z" />
    </>
  ),
  // An ear of wheat: crops.
  wheat: (
    <>
      <path d="M12 22V8" />
      <path d="M12 8c-1.8-1.2-1.8-3.8 0-5 1.8 1.2 1.8 3.8 0 5Z" />
      <path d="M12 13c-2.2.2-4-1.4-4-3.6 2.2-.2 4 1.4 4 3.6Z" />
      <path d="M12 13c2.2.2 4-1.4 4-3.6-2.2-.2-4 1.4-4 3.6Z" />
      <path d="M12 18c-2.2.2-4-1.4-4-3.6 2.2-.2 4 1.4 4 3.6Z" />
      <path d="M12 18c2.2.2 4-1.4 4-3.6-2.2-.2-4 1.4-4 3.6Z" />
    </>
  ),
  // A works with a chimney: industry.
  factory: (
    <>
      <path d="M3 21V11l5 3V11l5 3V11l5 3V4h3v17Z" />
      <path d="M7 18h2M12 18h2M17 18h2" />
    </>
  ),
  // Arrows in a loop: bioplastics, made to break down.
  recycle: (
    <>
      <path d="M7.5 9.5 10 5.2a2.3 2.3 0 0 1 4 0l1.3 2.3" />
      <path d="m13.6 7.6 1.7-.1.3-1.8" />
      <path d="M18 12.5 20.4 17a2.3 2.3 0 0 1-2 3.4H16" />
      <path d="m17.5 18.8-1.5 1.6 1.3 1.4" />
      <path d="M9.5 20.4H5.6a2.3 2.3 0 0 1-2-3.4l1.3-2.3" />
      <path d="m4.1 16.6-.6-1.7 1.9-.6" />
    </>
  ),
  // A plaster: wound care.
  plaster: (
    <>
      <rect x="2.5" y="8" width="19" height="8" rx="4" transform="rotate(-45 12 12)" />
      <path d="M10.6 10.6h.01M13.4 13.4h.01M13.4 10.6h.01M10.6 13.4h.01" strokeWidth="2.2" />
    </>
  ),
  // A capsule: pharmaceuticals.
  pill: (
    <>
      <rect x="2.5" y="8" width="19" height="8" rx="4" transform="rotate(-45 12 12)" />
      <path d="m8.6 8.6 6.8 6.8" />
    </>
  ),
  // A cell with its nucleus: tissue engineering.
  cell: (
    <>
      <path d="M12 3c4 0 9 2.5 9 8.5S16.5 21 11.5 21 3 17.5 3 12 8 3 12 3Z" />
      <circle cx="12.5" cy="11.5" r="3" />
      <path d="M7 16h.01M17 7.5h.01M8 7.5h.01" strokeWidth="2.2" />
    </>
  ),
};

export default function Icon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
