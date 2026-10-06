import type { MouseEvent, ReactNode } from "react";
import HeroCollage, { type HeroCollageProps } from "./HeroCollage";

/* ────────────────────────────────────────────────
   CommonHero — the standard Glamlink hero.
   Content left, visual right (stacked on mobile), one fixed
   visual area and a viewport-based height on desktop so every
   page's hero lines up the same. Images/videos are shown whole
   (never cropped or stretched) and scale down to fit that area.
───────────────────────────────────────────────── */

export type HeroAction = {
  label: ReactNode;
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

/** Classes for a hero image/video shown whole at its own aspect ratio, scaled to fit the visual area */
export const heroMediaClass =
  "block h-auto w-auto max-w-full max-h-[min(28rem,60svh)] lg:max-h-full rounded-4xl border border-border bg-card shadow-large";

type CommonHeroProps = {
  eyebrow?: ReactNode;
  /** Heading text — the whole heading is brand teal on every page */
  title: string;
  /** Closing words of the heading (kept separate so long titles break at a natural point) */
  titleHighlight?: string;
  description?: ReactNode;
  /** Extra content between the description and the CTAs (search bar, price line, tagline…) */
  children?: ReactNode;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  /** Small print under the CTAs */
  footnote?: ReactNode;
  /** The standard Glamlink collage (tall tile + two stacked tiles + circle accent) */
  collage?: HeroCollageProps;
  /** A single image, shown whole in the standard visual area */
  image?: { src: string; alt: string; priority?: boolean };
  /** Custom visual. A composition (collage, cover stack) fills the area with h-full w-full;
      a single video should use `heroMediaClass` and set `mediaFit="natural"` */
  media?: ReactNode;
  /** "fill" (default): media fills a 4:5 area. "natural": media keeps its own ratio, like `image` */
  mediaFit?: "fill" | "natural";
  className?: string;
};

function HeroButton({ action, variant }: { action: HeroAction; variant: "primary" | "outline" }) {
  const className = `${variant === "primary" ? "btn-primary" : "btn-outline"} btn-lg group`;

  if (action.href) {
    return (
      <a href={action.href} onClick={action.onClick} className={className}>
        {action.label}
      </a>
    );
  }

  return (
    <button type="button" onClick={action.onClick} className={className}>
      {action.label}
    </button>
  );
}

export default function CommonHero({
  eyebrow,
  title,
  titleHighlight,
  description,
  children,
  primaryAction,
  secondaryAction,
  footnote,
  collage,
  image,
  media,
  mediaFit = "fill",
  className = "",
}: CommonHeroProps) {
  const hasActions = primaryAction || secondaryAction;
  // Compositions need a sized box on every screen; single images/videos size themselves
  const fillsArea = Boolean(collage) || (!image && mediaFit === "fill");

  return (
    <section
      className={`hero-glamlink relative overflow-hidden bg-background flex items-center lg:min-h-[min(100svh,960px)] ${className}`}
    >
      <div className="container-glamlink relative grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-10 lg:grid-cols-12 lg:gap-16">
        {/* LEFT — content */}
        <div className="min-w-0 animate-fade-up lg:col-span-7">
          {eyebrow && <span className="badge-soft text-xs sm:text-sm">{eyebrow}</span>}

          <h1 className={`hero-title text-primary md:text-4xl lg:text-6xl ${eyebrow ? "mt-6" : ""}`}>
            {title}
            {titleHighlight && <>{" "}<span>{titleHighlight}</span></>}
          </h1>

          {description && <div className="hero-subtitle mt-6 max-w-xl">{description}</div>}

          {children && <div className="mt-8">{children}</div>}

          {hasActions && (
            <div className="mt-10 flex flex-wrap gap-4">
              {primaryAction && <HeroButton action={primaryAction} variant="primary" />}
              {secondaryAction && <HeroButton action={secondaryAction} variant="outline" />}
            </div>
          )}

          {footnote && <p className="mt-4 text-sm text-muted-foreground">{footnote}</p>}
        </div>

        {/* RIGHT — visual (same area on every page) */}
        <div className="flex min-w-0 justify-center lg:col-span-5 lg:justify-end">
          <div
            className={`relative flex w-full max-w-88 items-center justify-center sm:max-w-104
              lg:max-w-120 lg:h-[clamp(26rem,calc(100svh-15rem),37.5rem)] lg:aspect-auto
              ${fillsArea ? "aspect-4/5" : ""}`}
          >
            {collage ? (
              <HeroCollage {...collage} />
            ) : image ? (
              <img
                src={image.src}
                alt={image.alt}
                className={heroMediaClass}
                fetchPriority={image.priority ? "high" : undefined}
              />
            ) : (
              media
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
