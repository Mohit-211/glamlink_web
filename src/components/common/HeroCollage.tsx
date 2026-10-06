/* ────────────────────────────────────────────────
   HeroCollage — the standard Glamlink hero visual.
   One tall tile (left), two stacked tiles (right) and an
   optional floating circle accent (desktop only). Used via
   CommonHero's `collage` prop so every hero looks the same.
───────────────────────────────────────────────── */

export type CollageTile = {
  src: string;
  alt: string;
  /** Pill caption in the bottom-left corner */
  label?: string;
  /** "cover" fills the tile (photos). "contain" keeps the whole image visible (magazine/podcast covers). */
  fit?: "cover" | "contain";
  /** Render as an autoplaying, muted, looping video */
  video?: boolean;
  onClick?: () => void;
  priority?: boolean;
};

export type HeroCollageProps = {
  main: CollageTile;
  top: CollageTile;
  bottom: CollageTile;
  accent?: { src: string; alt: string };
};

function Tile({ tile, className = "" }: { tile: CollageTile; className?: string }) {
  const contain = tile.fit === "contain";
  const mediaClass = contain
    ? "h-full w-full object-contain p-3 drop-shadow-md"
    : "h-full w-full object-cover";

  return (
    <figure
      onClick={tile.onClick}
      className={`relative overflow-hidden rounded-4xl shadow-large ${contain ? "bg-secondary" : ""} ${
        tile.onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {tile.video ? (
        <video className={mediaClass} autoPlay muted loop playsInline preload="metadata" aria-label={tile.alt}>
          <source src={tile.src} type="video/mp4" />
        </video>
      ) : (
        <img
          src={tile.src}
          alt={tile.alt}
          className={mediaClass}
          fetchPriority={tile.priority ? "high" : undefined}
        />
      )}
      {tile.label && (
        <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
          {tile.label}
        </figcaption>
      )}
    </figure>
  );
}

export default function HeroCollage({ main, top, bottom, accent }: HeroCollageProps) {
  return (
    <div className="relative grid h-full w-full grid-cols-2 gap-3 sm:gap-4">
      <Tile tile={main} className="row-span-2" />
      <Tile tile={top} className="mt-10" />
      <Tile tile={bottom} className="mb-10" />

      {/* Floating accent (desktop only — would overflow narrow screens) */}
      {accent && (
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 hidden lg:block h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-large animate-float">
          <img src={accent.src} alt={accent.alt} className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
}
