import Link from "next/link";
import { BookOpen, Play } from "lucide-react";
import ApiImage from "@/components/common/ApiImage";
import type { EducationCard } from "@/lib/api/types";
import { formatDuration } from "@/lib/format";
import { trackAs } from "./profileEvents";
import { educationHref } from "./profileSections";

/** An education post as a card (cover, kind, title and summary), linking to the post's page. */
export default function EducationTile({
  slug,
  item,
  sizes = "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 100vw",
}: {
  /** The profile's slug. */
  slug: string;
  item: EducationCard;
  sizes?: string;
}) {
  const video = item.kind === "video";
  const cover = item.cover_image || item.video?.thumbnail || null;
  const duration = formatDuration(item.video?.duration_seconds);

  return (
    <Link
      href={educationHref(slug, item.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-medium"
      {...trackAs("EDUCATION_CLICK", item.slug)}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <ApiImage
          src={cover}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {video && (
          <span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/95 text-primary shadow-soft transition-colors group-hover:bg-secondary group-hover:text-primary-foreground">
            <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" />
          </span>
        )}
        {duration && (
          <span className="absolute bottom-3 right-3 rounded-md bg-overlay/70 px-1.5 py-0.5 text-xs font-medium text-overlay-foreground">
            {duration}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="eyebrow inline-flex items-center gap-1.5">
          {video ? <Play className="h-3 w-3" aria-hidden="true" /> : <BookOpen className="h-3 w-3" aria-hidden="true" />}
          {video ? "Video" : "Article"}
        </p>
        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-secondary md:text-base">
          {item.title}
        </h3>
        {item.summary && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
        )}
      </div>
    </Link>
  );
}
