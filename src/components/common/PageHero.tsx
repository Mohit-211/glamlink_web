import type { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import ApiImage from "@/components/common/ApiImage";
import { cn } from "@/lib/utils";

/*
 * The hero at the top of every main page: a band in the hero tint under the site
 * header, with the page's kicker, title, standfirst and actions on the left. Beside
 * them, either a photo filling the band, its left side fading into the tint behind
 * the text, or a visual the page frames itself (a video, the cover story). On phones
 * the text comes first and the photo or visual under it.
 */

/**
 * A photo filling its frame (one of the site's own, or an admin's: a link from the
 * API), cooled a little toward the brand teal and, from lg up, faded into the hero
 * tint on its left.
 */
export function HeroPhoto({
  src,
  alt = "",
  position = "object-right",
  preload = false,
}: {
  src: StaticImageData | string;
  alt?: string;
  /** Which part stays in view when the photo is cropped, as an object-position class. */
  position?: string;
  preload?: boolean;
}) {
  const className = cn("object-cover", position);
  return (
    <div className="absolute inset-0 isolate">
      {typeof src === "string" ? (
        <ApiImage src={src} alt={alt} fill preload={preload} sizes="100vw" className={className} />
      ) : (
        <Image src={src} alt={alt} fill preload={preload} placeholder="blur" sizes="100vw" className={className} />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-primary/12 mix-blend-color" />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-linear-to-r from-tint via-tint/85 via-45% to-transparent to-80% lg:block xl:via-40% xl:to-75%"
      />
    </div>
  );
}

export default function PageHero({
  id,
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  imagePosition,
  media,
  children,
}: {
  /** The heading's id is `${id}-heading`. */
  id: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  image?: StaticImageData | string;
  imageAlt?: string;
  imagePosition?: string;
  /** Instead of a photo, a visual beside the text. */
  media?: ReactNode;
  /** Under the standfirst: the actions, a search box or a form. */
  children?: ReactNode;
}) {
  const text = (
    <div className="max-w-2xl animate-fade-up">
      {eyebrow && <p className="hero-eyebrow mb-5">{eyebrow}</p>}
      <h1 id={`${id}-heading`} className="hero-title">
        {title}
      </h1>
      {subtitle && <p className="hero-subtitle mt-5 max-w-xl">{subtitle}</p>}
      {children && <div className="mt-8 md:mt-10">{children}</div>}
    </div>
  );

  return (
    <section aria-labelledby={`${id}-heading`} className="bg-tint pt-16 md:pt-20">
      {image ? (
        <div className="grid lg:min-h-144">
          <div className="container-glamlink relative z-10 py-10 md:py-14 lg:col-start-1 lg:row-start-1 lg:self-center lg:py-16">
            {text}
          </div>
          <div className="relative mx-5 mb-10 aspect-video overflow-hidden rounded-3xl sm:mx-6 md:mb-14 lg:col-start-1 lg:row-start-1 lg:m-0 lg:aspect-auto lg:rounded-none">
            <HeroPhoto src={image} alt={imageAlt} position={imagePosition} preload />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "container-glamlink grid items-center gap-10 py-10 md:py-14 lg:grid-cols-2 lg:gap-16 lg:py-16",
            media && "lg:min-h-144"
          )}
        >
          {text}
          {media && <div className="flex justify-center">{media}</div>}
        </div>
      )}
    </section>
  );
}
