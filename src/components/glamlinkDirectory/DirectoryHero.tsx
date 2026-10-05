import type { ReactNode } from "react";
import { BadgeCheck, MapPin } from "lucide-react";
import { unsplash } from "@/lib/directory/mockData";

const HERO_IMAGES = {
  hair: unsplash("1562322140-8baeececf3df", 700),
  medSpa: unsplash("1552693673-1bf958298935", 600),
  wellness: unsplash("1600334129128-685c5582fd35", 600),
  makeup: unsplash("1487412947147-5cebf100ffc2", 300),
};

const MOBILE_STRIP = [
  { src: HERO_IMAGES.hair, alt: "Hair stylist styling a client" },
  { src: HERO_IMAGES.medSpa, alt: "Med spa skin treatment" },
  { src: HERO_IMAGES.wellness, alt: "Hot stone wellness massage" },
];

export default function DirectoryHero({ children }: { children: ReactNode }) {
  return (
    <section className="hero-glamlink relative overflow-hidden bg-background">
      <div className="container-glamlink relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* COPY + SEARCH */}
          <div className="lg:col-span-7 animate-fade-up">
            <span className="badge-soft text-xs sm:text-sm">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              Nationwide Beauty + Wellness Directory
            </span>

            <h1 className="hero-title mt-6">
              Find Beauty + Wellness Professionals{" "}
              <span className="text-primary">Near You</span>
            </h1>

            <p className="hero-subtitle mt-6 max-w-xl">
              Search trusted professionals and businesses across the U.S.
            </p>

            <div className="mt-8 md:mt-10">{children}</div>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Glamlink-featured experts", "Google-powered listings", "Across the U.S."].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* DESKTOP COLLAGE */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="relative grid grid-cols-2 gap-4 h-[540px]">
              <figure className="relative row-span-2 overflow-hidden rounded-[2rem] shadow-large">
                <img
                  src={HERO_IMAGES.hair}
                  alt="Hair stylist styling a client"
                  className="h-full w-full object-cover"
                  fetchPriority="high"
                />
                <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
                  Hair
                </figcaption>
              </figure>

              <figure className="relative overflow-hidden rounded-[2rem] shadow-large mt-10">
                <img
                  src={HERO_IMAGES.medSpa}
                  alt="Med spa skin treatment"
                  className="h-full w-full object-cover"
                />
                <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
                  Skin + Med Spa
                </figcaption>
              </figure>

              <figure className="relative overflow-hidden rounded-[2rem] shadow-large mb-10">
                <img
                  src={HERO_IMAGES.wellness}
                  alt="Hot stone wellness massage"
                  className="h-full w-full object-cover"
                />
                <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
                  Wellness
                </figcaption>
              </figure>

              {/* Floating makeup accent */}
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-large animate-float">
                <img
                  src={HERO_IMAGES.makeup}
                  alt="Makeup artistry"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE / TABLET IMAGE STRIP */}
        <div className="lg:hidden mt-10 grid grid-cols-3 gap-3">
          {MOBILE_STRIP.map((image) => (
            <div key={image.src} className="aspect-[4/5] overflow-hidden rounded-2xl shadow-medium">
              <img src={image.src} alt={image.alt} className="h-full w-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
