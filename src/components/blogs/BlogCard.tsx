'use client';

import Image from "next/image";
import AuthorAvatar from "./AuthorAvatar";

interface BlogCardProps {

  image?: string;
  category?: string;
  title: string;
  excerpt?: string;
  author?: string;
  authorImage?: string | null;
  date?: string;
  featured?: boolean;
}

const BlogCard = ({
  image,
  category,
  title,
  excerpt,
  author,
  authorImage,
  date,
  featured = false,
}: BlogCardProps) => {
  return (
    <article className="group cursor-pointer flex flex-col h-full w-full min-w-0 bg-card rounded-2xl overflow-hidden border border-border hover:shadow-large transition-all duration-300">

      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden flex-shrink-0">
        <Image
          unoptimized={process.env.NODE_ENV === "development"}
          fill
          src={image || "/assets/blog-1.jpg"}
          alt={title}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.05] transition-transform duration-700"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-overlay/30 to-transparent" />

        {/* Category pill */}
        {/* {category && (
          <div className="absolute top-3 left-3">
            <span
              className="rounded-full border border-primary/20 bg-card/90 px-3 py-1.5 eyebrow text-primary"
            >
              {category}
            </span>
          </div>
        )} */}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 min-w-0 p-4 sm:p-5">
        {category && (
          <p className="eyebrow mb-1 truncate">
            {category}
          </p>
        )}
        {/* Title */}
        <h3 className="text-foreground text-base sm:text-lg leading-snug mb-2 group-hover:text-secondary transition-colors duration-200 line-clamp-2 wrap-break-word">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm leading-relaxed text-muted-foreground/80 font-normal line-clamp-2 flex-1 mb-4">
            {excerpt}
          </p>
        )}

        {/* Author + Date */}
        {(author || date) && (
          <div className="flex items-center gap-2 min-w-0 pt-3 border-t border-border mt-auto">
            {author && <AuthorAvatar name={author} image={authorImage} size={28} className="text-xs" />}
            {author && (
              <span className="text-xs font-medium text-foreground/80 truncate min-w-0">{author}</span>
            )}
            {author && date && (
              <span className="w-1 h-1 rounded-full bg-border flex-shrink-0 mx-1" />
            )}
            {date && (
              <span className="text-xs text-muted-foreground/80 whitespace-nowrap">{date}</span>
            )}
          </div>
        )}

      </div>
    </article>
  );
};

export default BlogCard;