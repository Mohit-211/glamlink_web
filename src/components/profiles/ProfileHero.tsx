import { ExternalLink } from "lucide-react";
import { HeroPhoto } from "@/components/common/PageHero";
import { cn } from "@/lib/utils";
import { trackAs } from "./profileEvents";

/**
 * A profile's hero, in the family of the site's PageHero: the cover photo fills a
 * tint band and fades into it on the left (from lg up), under the name, tagline,
 * intro and "Visit Website". On phones the words come first and the cover under
 * them. Its foot leaves room for the logo, which overlaps it (ProfileIdentity).
 */
export default function ProfileHero({
  name,
  tagline,
  intro,
  website,
  cover,
}: {
  name: string;
  tagline: string | null;
  intro: string | null;
  website: string | null;
  cover: string | null;
}) {
  return (
    <section aria-labelledby="profile-name" className="bg-tint pt-16 md:pt-20">
      <div className={cn("grid", cover && "lg:min-h-112")}>
        <div
          className={cn(
            "container-glamlink relative z-10 pt-10 md:pt-14 lg:col-start-1 lg:row-start-1 lg:self-center lg:pb-24 lg:pt-14",
            cover ? "pb-8 md:pb-10" : "pb-20 md:pb-24"
          )}
        >
          <div className="max-w-xl animate-fade-up">
            <h1 id="profile-name" className="hero-title">
              {name}
            </h1>
            {tagline && (
              <p className="mt-4 text-sm font-semibold uppercase leading-relaxed tracking-widest text-secondary">
                {tagline}
              </p>
            )}
            {intro && <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">{intro}</p>}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-8"
                {...trackAs("WEBSITE_CLICK", website)}
              >
                Visit Website
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
        {cover && (
          <div className="relative mx-5 mb-6 aspect-video overflow-hidden rounded-3xl sm:mx-6 lg:col-start-1 lg:row-start-1 lg:m-0 lg:aspect-auto lg:rounded-none">
            <HeroPhoto src={cover} position="object-center" preload />
          </div>
        )}
      </div>
    </section>
  );
}
