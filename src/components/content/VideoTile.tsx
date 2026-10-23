import Link from "next/link";
import { Play } from "lucide-react";
import ApiImage from "@/components/common/ApiImage";
import { formatDuration } from "@/lib/format";
import { videoHref } from "@/lib/routes";
import type { VideoCard } from "@/lib/api/types";

interface VideoTileProps {
  video: VideoCard;
  /** Hide the series name where the whole row is one series. */
  showSeries?: boolean;
  sizes?: string;
}

/** A video card: thumbnail with play mark and length, series and title. */
export default function VideoTile({
  video,
  showSeries = true,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 70vw",
}: VideoTileProps) {
  const duration = formatDuration(video.duration_seconds);

  return (
    <Link href={videoHref(video.slug)} className="group flex h-full flex-col">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted">
        <ApiImage
          src={video.thumbnail}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-overlay/40 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-card/95 text-primary shadow-soft transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" />
        </span>
        {duration && (
          <span className="absolute bottom-3 right-3 rounded-md bg-overlay/70 px-1.5 py-0.5 text-[11px] font-medium text-overlay-foreground">
            {duration}
          </span>
        )}
      </div>
      {showSeries && video.series?.name && <p className="eyebrow mt-3 truncate">{video.series.name}</p>}
      <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-secondary">
        {video.title}
      </h3>
    </Link>
  );
}
