import { MapPin, Sparkles } from "lucide-react";
import type { FeaturedProfile } from "@/lib/directory";

export default function FeaturedProfileCard({ profile }: { profile: FeaturedProfile }) {
  return (
    <article
      className="group relative shrink-0 snap-start w-[78%] min-[480px]:w-[calc((100%_-_1rem)/2)] md:w-[calc((100%_-_3rem)/3)] lg:w-[calc((100%_-_4.5rem)/4)]"
      aria-label={`${profile.name}, ${profile.title}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-muted shadow-medium ring-1 ring-black/5">
        <img
          src={profile.imageUrl}
          alt={profile.name}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"
        />

        {/* Featured indicator */}
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary shadow-sm">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          Featured
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
            {profile.featuredIn}
          </p>
          <h3 className="font-display mt-1.5 text-2xl leading-tight font-semibold text-white">
            {profile.name}
          </h3>
          <p className="mt-1 text-sm text-white/85">{profile.title}</p>
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-white/80">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            {profile.city}, {profile.state}
          </p>
        </div>

        {profile.href && (
          <a href={profile.href} className="absolute inset-0" aria-label={`Read about ${profile.name}`} />
        )}
      </div>
    </article>
  );
}
