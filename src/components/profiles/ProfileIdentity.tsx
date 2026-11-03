import { Fragment } from "react";
import { MapPin } from "lucide-react";
import ApiImage from "@/components/common/ApiImage";
import ShareButton from "@/components/common/ShareButton";
import type { SocialLink } from "@/lib/api/types";
import SocialLinks from "./SocialLinks";
import { trackAs } from "./profileEvents";

/** "Jane Doe" → "JD": shown in the round frame when a page has no picture. */
const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

/**
 * Under the hero: the round logo (or photo) overlapping the cover, the name, the
 * category line, the website and social links, the place and Share.
 */
export default function ProfileIdentity({
  name,
  brand,
  image,
  subtitle,
  website,
  social,
  place,
  shareUrl,
}: {
  name: string;
  brand: boolean;
  image: string | null;
  subtitle: string[];
  website: string | null;
  social: SocialLink[];
  place: string;
  shareUrl: string;
}) {
  return (
    <div className="container-glamlink">
      <div className="flex flex-col gap-5 border-b border-border pb-8 md:flex-row md:items-end md:gap-8">
        <div className="relative z-10 -mt-14 h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-background bg-card shadow-medium md:-mt-16 md:h-36 md:w-36 lg:h-40 lg:w-40">
          {image ? (
            <ApiImage
              src={image}
              alt={name}
              fill
              loading="eager"
              sizes="(min-width: 1024px) 160px, (min-width: 768px) 144px, 112px"
              className={brand ? "object-contain p-[14%]" : "object-cover"}
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center bg-accent text-3xl font-semibold text-secondary md:text-4xl"
            >
              {initialsOf(name)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 md:pb-1">
          <p className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">{name}</p>
          {subtitle.length > 0 && (
            <p className="mt-1.5 text-sm text-muted-foreground md:text-base">
              {subtitle.map((part, i) => (
                <Fragment key={part}>
                  {i > 0 && (
                    <span aria-hidden="true" className="mx-2.5 text-muted-foreground/50">
                      |
                    </span>
                  )}
                  <span>{part}</span>
                </Fragment>
              ))}
            </p>
          )}
          <SocialLinks website={website} social={social} className={subtitle.length > 0 ? "mt-3" : "mt-2"} />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm md:flex-col md:items-start md:gap-y-2.5 md:pb-2">
          {place && (
            <p className="inline-flex items-center gap-2 text-foreground/90">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              {place}
            </p>
          )}
          <ShareButton
            url={shareUrl}
            title={name}
            className="font-medium text-foreground/90 transition-colors hover:text-secondary"
            {...trackAs("SHARE_CLICK")}
          />
        </div>
      </div>
    </div>
  );
}
