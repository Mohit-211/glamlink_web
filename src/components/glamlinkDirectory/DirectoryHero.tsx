import type { ReactNode } from "react";
import Image from "next/image";
import { BadgeCheck, MapPin } from "lucide-react";
import heroPhoto from "../../../public/home-hero/directory-hero.png";

/**
 * The directory's hero: copy and the search (children). On phones the text and the
 * search come first and the group photo under them; from lg the photo fills the band
 * behind them, its left side faded into the page.
 */
export default function DirectoryHero({ children }: { children: ReactNode }) {
  return (
    <section className="bg-background pt-16 md:pt-20">
      <div className="grid lg:min-h-152">
        <div className="container-glamlink relative z-10 py-10 md:py-14 lg:col-start-1 lg:row-start-1 lg:self-center lg:py-16">
          <div className="max-w-2xl animate-fade-up">
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

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground lg:text-foreground">
              {["Glamlink-featured experts", "Google-powered listings", "Across the U.S."].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hair, med spa, injectors, estheticians, wellness and grooming professionals */}
        <div className="relative mx-5 mb-10 aspect-2/1 overflow-hidden rounded-3xl sm:mx-6 lg:col-start-1 lg:row-start-1 lg:m-0 lg:aspect-auto lg:rounded-none">
          <Image
            src={heroPhoto}
            alt=""
            fill
            preload
            placeholder="blur"
            sizes="100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 hidden bg-linear-to-r from-background via-background/90 via-40% to-transparent to-75% lg:block" />
        </div>
      </div>
    </section>
  );
}
