import { BadgeCheck, ExternalLink, MapPin } from "lucide-react";
import { getProfessionalType, type DirectoryBusiness } from "@/lib/directory";
import StarRating from "./StarRating";
import { GoogleWordmark } from "./GoogleAttribution";

interface DirectoryBusinessCardProps {
  business: DirectoryBusiness;
  onClaim: (business: DirectoryBusiness) => void;
}

export default function DirectoryBusinessCard({ business, onClaim }: DirectoryBusinessCardProps) {
  const category = getProfessionalType(business.professionalType)?.label ?? "Beauty + Wellness";
  const href = business.websiteUrl ?? business.mapsUrl;

  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-medium">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={business.imageUrl}
          alt={business.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
          {category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-semibold leading-snug line-clamp-2">
          {business.name}
        </h3>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {business.city}, {business.state}
          </span>
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="font-semibold text-foreground">{business.rating.toFixed(1)}</span>
          <StarRating value={business.rating} />
          <span className="text-muted-foreground">
            ({business.reviewCount.toLocaleString("en-US")})
          </span>
          <GoogleWordmark className="ml-auto text-xs" />
        </div>

        <div className="mt-auto pt-5 flex flex-col gap-2">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full py-2.5"
          >
            {business.websiteUrl ? "Visit Website" : "View Business"}
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>

          {!business.isClaimed && (
            <button
              type="button"
              onClick={() => onClaim(business)}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-dashed border-primary/40 bg-primary/[0.03] px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/10"
            >
              <BadgeCheck className="w-4 h-4" aria-hidden="true" />
              Claim This Profile
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
