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
    <article className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">

      {/* Image */}
      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden flex-shrink-0">
        <Image
          unoptimized={process.env.NODE_ENV === "development"}
          fill
          src={image || "/assets/blog-1.jpg"}
          alt={title}
          className="object-cover group-hover:scale-[1.05] transition-transform duration-700"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Category pill */}
        {/* {category && (
          <div className="absolute top-3 left-3">
            <span
              className="text-[10px] font-medium tracking-widest uppercase text-[#23AEB8] px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.93)",
                border: "1px solid rgba(35,174,184,0.2)",
              }}
            >
              {category}
            </span>
          </div>
        )} */}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-[10px] uppercase tracking-widest text-primary mb-1">
          {category}
        </p>
        {/* Title */}
        <h3 className="font-serif text-gray-900 text-[18px] leading-[1.35] mb-2 group-hover:text-[#23AEB8] transition-colors duration-200 line-clamp-2">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-[13px] leading-relaxed text-gray-400 font-light line-clamp-2 flex-1 mb-4">
            {excerpt}
          </p>
        )}

        {/* Author + Date */}
        {(author || date) && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
            {author && (
              <div className="w-7 h-7 rounded-full bg-[#23AEB8] text-white flex items-center justify-center text-[11px] font-medium flex-shrink-0">
                {author.charAt(0)}
              </div>
            )}
            {author && (
              <span className="text-[12px] font-medium text-gray-700 truncate">{author}</span>
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