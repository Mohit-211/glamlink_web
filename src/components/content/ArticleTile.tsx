import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ApiImage from "@/components/common/ApiImage";
import { formatDate } from "@/lib/format";
import { articleHref } from "@/lib/routes";
import type { ArticleCard } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface ArticleTileProps {
  article: ArticleCard;
  /** "row": image beside the text from md up (home page); "stacked": image on top. */
  layout?: "stacked" | "row";
  /** Load the cover eagerly (the first row of a page). */
  priority?: boolean;
}

/** An article card: cover, category, title, excerpt and date, linking to the article. */
export default function ArticleTile({ article, layout = "stacked", priority = false }: ArticleTileProps) {
  const row = layout === "row";
  const date = formatDate(article.publish_date ?? article.created_at);

  return (
    <Link
      href={articleHref(article)}
      className={cn(
        "group flex h-full overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-medium",
        row ? "flex-col sm:flex-row lg:flex-col xl:flex-row" : "flex-col"
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-muted",
          row ? "aspect-video sm:aspect-auto sm:w-2/5 lg:aspect-video lg:w-full xl:aspect-auto xl:w-2/5" : "aspect-video"
        )}
      >
        <ApiImage
          src={article.cover_image}
          alt=""
          fill
          priority={priority}
          sizes={row ? "(min-width: 1280px) 160px, (min-width: 640px) 40vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5">
        {article.journal_category?.title && (
          <p className="eyebrow mb-1.5 truncate">{article.journal_category.title}</p>
        )}
        <h3 className="line-clamp-2 text-base leading-snug transition-colors group-hover:text-secondary md:text-lg">
          {article.title}
        </h3>
        {article.short_description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {article.short_description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-muted-foreground">
          {row ? (
            <span className="link-glamlink inline-flex items-center gap-1 text-sm">
              Read more
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          ) : (
            <span className="truncate">{article.journal_author?.name}</span>
          )}
          {date && <time dateTime={article.publish_date ?? undefined}>{date}</time>}
        </div>
      </div>
    </Link>
  );
}
