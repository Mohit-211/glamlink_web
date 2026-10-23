import Link from "next/link";
import ApiImage from "@/components/common/ApiImage";
import { topicHref } from "@/lib/routes";
import type { Topic } from "@/lib/api/types";

/** A topic tile: square image with the topic's name over its foot. */
export default function TopicTile({ topic, priority = false }: { topic: Topic; priority?: boolean }) {
  return (
    <Link href={topicHref(topic)} className="group relative block aspect-square overflow-hidden rounded-2xl bg-muted">
      <ApiImage
        src={topic.tile_image || topic.cover_image}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
      />
      <span className="absolute inset-x-2 bottom-2 line-clamp-2 rounded-xl bg-card/90 px-2 py-1.5 text-center text-xs font-semibold leading-snug text-balance text-foreground shadow-soft backdrop-blur-sm transition-colors group-hover:text-secondary sm:inset-x-3 sm:bottom-3 sm:px-3 sm:py-2 sm:text-sm">
        {topic.name}
      </span>
    </Link>
  );
}
