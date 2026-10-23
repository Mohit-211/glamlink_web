import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import ApiImage from "@/components/common/ApiImage";
import { formatPlace } from "@/lib/format";
import { profileHref } from "@/lib/routes";
import type { ProfileCard } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface ProfileTileProps {
  profile: ProfileCard;
  sizes?: string;
}

/**
 * A professional's or a brand's card, linking to their page. A brand's image is
 * usually a logo, so it is shown whole on white; a professional's photo fills
 * the frame.
 */
export default function ProfileTile({
  profile,
  sizes = "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw",
}: ProfileTileProps) {
  const brand = profile.type === "brand";
  const place = formatPlace(profile.city, profile.state);
  const detail = brand ? profile.tagline : profile.specialty || profile.tagline;

  return (
    <Link
      href={profileHref(profile.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-medium"
    >
      <div className={cn("relative overflow-hidden", brand ? "aspect-3/2 bg-card" : "aspect-4/5 bg-muted")}>
        <ApiImage
          src={profile.image}
          alt=""
          fill
          sizes={sizes}
          className={cn(
            "transition-transform duration-500 group-hover:scale-[1.04]",
            brand ? "object-contain p-6" : "object-cover"
          )}
        />
      </div>

      <div className={cn("flex flex-1 flex-col gap-1 p-4", brand && "border-t border-border")}>
        <h3 className="flex items-center gap-1.5 text-sm font-semibold leading-snug transition-colors group-hover:text-secondary md:text-[15px]">
          <span className="truncate">{profile.name}</span>
          {profile.is_featured && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Featured" />}
        </h3>
        {detail && <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground md:text-sm">{detail}</p>}
        {!brand && place && (
          <p className="mt-auto flex items-center gap-1 pt-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{place}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
