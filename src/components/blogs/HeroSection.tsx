"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogs } from "@/api/Api";
import slugify from "slugify";

interface BlogPost {
  journal_author: any;
  journal_category: any;
  id: number;
  title: string;
  short_description: string;
  cover_image: string;
  created_at: string;
}

const HeroSection = () => {
  const [featured, setFeatured] = useState<BlogPost | null>(null);

  console.log(featured, "featured");

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await getAllBlogs();

        console.log(response, "response=====>");

        const blogs = Array.isArray(response?.data?.rows)
          ? response.data.rows
          : [];

        // ✅ Find Cover Feature blog
        const featuredBlog =
        blogs.find(
          (blog: BlogPost) =>
            blog?.journal_category?.title?.trim().toLowerCase() ===
            "cover feature"
        ) || blogs[0];
        if (featuredBlog) {
          setFeatured(featuredBlog);
        }
      } catch (error) {
        console.error("Error fetching featured blog:", error);
      }
    };

    fetchFeatured();
  }, []);

  if (!featured) return null;
console.log(featured)
  return (
    <section className="relative bg-[#fafafa] rounded-2xl px-6 md:px-10 py-10 md:py-12">
      <Link
        href={`/journal/${featured.id}/${slugify(featured.title, {
          lower: true,
          strict: true,
        })}`}
        className="group block space-y-6"
      >
        {/* TOP */}
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-8 items-center">
          {/* IMAGE */}
          <div className="relative overflow-hidden rounded-xl aspect-[16/10]">
            <Image
              unoptimized={process.env.NODE_ENV === "development"}
              src={featured.cover_image}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />

            <span className="absolute top-3 left-3 bg-white/90 text-black text-[10px] px-2.5 py-1 rounded">
              {featured?.journal_category?.title}
            </span>
          </div>

          {/* CONTENT */}
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest text-primary">
              The Glamlink Journal
            </p>

            <h1 className="font-display text-xl md:text-2xl leading-snug tracking-tight">
              {featured.title}
            </h1>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              {featured.short_description}
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="pt-4 border-t border-border/40 space-y-2">
          {/* FEATURE TITLE */}
          <h2 className="font-display text-lg md:text-xl leading-snug text-primary group-hover:opacity-80 transition">
            {featured.title}
          </h2>

          {/* META */}
          <div className="flex items-center gap-3 text-xs">
            <span className="font-medium">
              {featured?.journal_author?.name}
            </span>
            <span className="w-1 h-1 bg-border rounded-full" />
            <span className="text-muted-foreground">
              {new Date(featured.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default HeroSection;