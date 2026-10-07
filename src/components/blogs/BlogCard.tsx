'use client';

import Image from "next/image";

interface BlogCardProps {

  image?: string;
  category?: string;
  title: string;
  excerpt?: string;
  author?: string;
  date?: string;
  featured?: boolean;
}

const BlogCard = ({
  image,
  category,
  title,
  excerpt,
  author,
  date,
  featured = false,
}: BlogCardProps) => {
  return (
    <article className="group cursor-pointer flex flex-col h-full w-full min-w-0 bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">

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
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Category pill */}
        {/* {category && (
          <div className="absolute top-3 left-3">
            <span
              className="text-[10px] font-medium tracking-widest uppercase text-[#24bbcb] px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.93)",
                border: "1px solid rgba(36,187,203,0.2)",
              }}
            >
              {category}
            </span>
          </div>
        )} */}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 min-w-0 p-4 sm:p-5">
        {category && (
          <p className="text-[10px] uppercase tracking-widest text-primary mb-1 truncate">
            {category}
          </p>
        )}
        {/* Title */}
        <h3 className="font-serif text-gray-900 text-[16px] sm:text-[18px] leading-[1.35] mb-2 group-hover:text-[#24bbcb] transition-colors duration-200 line-clamp-2 wrap-break-word">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-[13px] leading-relaxed text-gray-400 font-normal line-clamp-2 flex-1 mb-4">
            {excerpt}
          </p>
        )}

        {/* Author + Date */}
        {(author || date) && (
          <div className="flex items-center gap-2 min-w-0 pt-3 border-t border-gray-100 mt-auto">
            {author && (
              <div className="w-7 h-7 rounded-full bg-[#24bbcb] text-white flex items-center justify-center text-[11px] font-medium flex-shrink-0">
                {author.charAt(0)}
              </div>
            )}
            {author && (
              <span className="text-[12px] font-medium text-gray-700 truncate min-w-0">{author}</span>
            )}
            {author && date && (
              <span className="w-1 h-1 rounded-full bg-gray-200 flex-shrink-0 mx-1" />
            )}
            {date && (
              <span className="text-[11px] text-gray-400 whitespace-nowrap">{date}</span>
            )}
          </div>
        )}

      </div>
    </article>
  );
};

export default BlogCard;