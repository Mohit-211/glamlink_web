import Link from "next/link";
import ApiImage from "@/components/common/ApiImage";
import { formatDate } from "@/lib/format";
import { articleHref, journalCategoryHref } from "@/lib/routes";
import type { ArticleCard } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/*
 * The Journal's story cards, laid out like a magazine's: no frame, the photo,
 * the section (a link to its page), the headline, the standfirst and the byline.
 * The photo and the headline both open the story; only the headline is in the
 * tab order.
 *
 *   stack    photo on top: Top Stories, a section's grid
 *   row      photo beside the text: The Latest
 *   lead     a larger stack: the first story of an In Focus shelf
 *   compact  a thumbnail beside the headline: the rest of the shelf
 */

type Layout = "stack" | "row" | "lead" | "compact";

const PHOTO: Record<Layout, string> = {
  stack: "aspect-3/2 rounded-2xl",
  row: "aspect-4/3 rounded-2xl",
  lead: "aspect-16/10 rounded-3xl",
  compact: "aspect-square rounded-xl",
};

const PHOTO_SIZES: Record<Layout, string> = {
  stack: "(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 100vw",
  row: "(min-width: 1024px) 22vw, 40vw",
  lead: "(min-width: 1024px) 55vw, 100vw",
  compact: "112px",
};

const HEADLINE: Record<Layout, string> = {
  stack: "text-lg md:text-xl",
  row: "text-base sm:text-xl md:text-2xl",
  lead: "text-2xl md:text-3xl",
  compact: "text-base",
};

const STANDFIRST: Record<Layout, string> = {
  stack: "line-clamp-2",
  row: "hidden sm:line-clamp-3",
  lead: "line-clamp-3",
  compact: "hidden",
};

/** "By The Glamlink Edit · Oct 4, 2026" */
export function Byline({ article, className }: { article: ArticleCard; className?: string }) {
  const author = article.journal_author?.name?.trim();
  const published = article.publish_date ?? article.created_at;
  const date = formatDate(published);
  if (!author && !date) return null;
  return (
    <p className={cn("eyebrow text-muted-foreground", className)}>
      {author && <span>By {author}</span>}
      {author && date && <span aria-hidden="true"> · </span>}
      {date && <time dateTime={published ?? undefined}>{date}</time>}
    </p>
  );
}

/** The story's section, linking to the section's page. */
export function Kicker({ article }: { article: ArticleCard }) {
  const category = article.journal_category;
  if (!category?.title) return null;
  if (!category.slug) return <span className="eyebrow">{category.title.trim()}</span>;
  return (
    <Link href={journalCategoryHref(category.slug)} className="eyebrow transition-colors hover:text-secondary">
      {category.title.trim()}
    </Link>
  );
}

export default function StoryCard({
  article,
  layout = "stack",
  showKicker = true,
  preload = false,
}: {
  article: ArticleCard;
  layout?: Layout;
  /** Off where every story shares the section, as on a section's own shelf. */
  showKicker?: boolean;
  preload?: boolean;
}) {
  const href = articleHref(article);
  const beside = layout === "row" || layout === "compact";

  return (
    <article
      className={cn(
        "group",
        layout === "row" && "grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start gap-4 sm:gap-6",
        layout === "compact" && "grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[7rem_minmax(0,1fr)]"
      )}
    >
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className={cn("relative block overflow-hidden bg-muted", PHOTO[layout])}
      >
        <ApiImage
          src={article.cover_image}
          alt=""
          fill
          preload={preload}
          sizes={PHOTO_SIZES[layout]}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </Link>

      <div className={cn("min-w-0", !beside && "mt-5")}>
        {showKicker && article.journal_category?.title && (
          <p className="mb-2">
            <Kicker article={article} />
          </p>
        )}
        <h3 className={cn("font-semibold leading-snug tracking-tight text-balance", HEADLINE[layout])}>
          <Link href={href} className="transition-colors hover:text-secondary">
            {article.title.trim()}
          </Link>
        </h3>
        {article.short_description && (
          <p className={cn("mt-2 text-sm leading-relaxed text-muted-foreground md:text-base", STANDFIRST[layout])}>
            {article.short_description}
          </p>
        )}
        <Byline article={article} className="mt-3" />
      </div>
    </article>
  );
}
