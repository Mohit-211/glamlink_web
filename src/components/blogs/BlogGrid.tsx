"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import BlogCard from "./BlogCard";
import { getAllBlogs } from "@/api/Api";
import slugify from "slugify";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
interface BlogPost {
  publish_date: number;
  journal_author?: { name?: string };
  journal_category?: { title?: string };
  id: number;
  title?: string;
  short_description?: string;
  cover_image?: string;
  created_at?: string;
}

interface Props {
  activeCategory: string;
  /** Called whenever the category filter causes the page to reset */
  onPageReset?: () => void;
}

/* ─────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────── */
const POSTS_PER_PAGE = 6;
const SIBLING_COUNT = 1; // pages shown on each side of current

/* ─────────────────────────────────────────────────────────────
   Pagination helpers
───────────────────────────────────────────────────────────── */
function buildPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const left = Math.max(2, current - SIBLING_COUNT);
  const right = Math.min(total - 1, current + SIBLING_COUNT);
  const pages: (number | "…")[] = [1];

  if (left > 2) pages.push("…");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("…");
  pages.push(total);

  return pages;
}

/* ─────────────────────────────────────────────────────────────
   BlogGrid
───────────────────────────────────────────────────────────── */
const BlogGrid: React.FC<Props> = ({ activeCategory }) => {
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  /* Fetch once */
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();
        const blogArray = Array.isArray(response?.data?.rows)
          ? response.data.rows
          : [];
        setAllBlogs(blogArray);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setAllBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  /* Reset to page 1 whenever category changes */
  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  /* Determine the same "featured" post HeroSection shows, so we can exclude it here.
     Mirrors HeroSection's logic exactly: prefer a "Cover Feature" category blog,
     otherwise fall back to the first blog in the list. */
  const featuredId = useMemo(() => {
    if (!allBlogs.length) return null;
    const featuredBlog =
      allBlogs.find(
        (blog) =>
          blog?.journal_category?.title?.trim().toLowerCase() ===
          "cover feature"
      ) || allBlogs[0];
    return featuredBlog?.id ?? null;
  }, [allBlogs]);

  /* Filter */
  const filteredBlogs = useMemo(() => {
    // Exclude the featured/cover-feature post so it isn't duplicated in the grid
    const withoutFeatured =
      featuredId != null
        ? allBlogs.filter((blog) => blog.id !== featuredId)
        : allBlogs;

    if (!activeCategory || activeCategory === "All") return withoutFeatured;
    return withoutFeatured.filter((blog) =>
      blog?.journal_category?.title
        ?.toLowerCase()
        .trim()
        .includes(activeCategory.toLowerCase().trim())
    );
  }, [activeCategory, allBlogs, featuredId]);

  /* Paginate */
  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / POSTS_PER_PAGE));
  const paginated = useMemo(() => {
    const start = (page - 1) * POSTS_PER_PAGE;
    return filteredBlogs.slice(start, start + POSTS_PER_PAGE);
  }, [filteredBlogs, page]);

  const goTo = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <p className="text-center py-16 text-sm text-muted-foreground">
        Loading articles...
      </p>
    );
  }

  /* ── Empty ── */
  if (!filteredBlogs.length) {
    return (
      <p className="text-center py-16 text-sm text-muted-foreground">
        No articles found.
      </p>
    );
  }

  const pageRange = buildPageRange(page, totalPages);

  return (
    <section className="mt-10 space-y-10">
      {/* ── Grid ── */}
      <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-x-12 gap-y-16">
        {paginated.map((item, index) => {
          const title = item.title || "Untitled";
          const author = item?.journal_author?.name || "Unknown";
          const category = item?.journal_category?.title || "General";
          const image = item.cover_image || "/assets/fallback.jpg";
          const excerpt = item.short_description || "";
          const date = new Date("2026-06-01T17:30:29.000Z").toLocaleString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
 
});
          return (
            <Link
              key={item.id}
              href={`/journal/${item.id}/${slugify(title, {
                lower: true,
                strict: true,
              })}`}
              className="block group animate-fade-up"
              style={{ animationDelay: `${0.06 * index}s` }}
            >
              <BlogCard
                image={image}
                category={category}
                title={title}
                excerpt={excerpt}
                author={author}
                date={date}
              />
            </Link>
          );
        })}
      </div>

      {/* ── Pagination bar ── */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 pt-4">
          {/* Post count info */}
          <p className="text-[11px] text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(page - 1) * POSTS_PER_PAGE + 1}–
              {Math.min(page * POSTS_PER_PAGE, filteredBlogs.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {filteredBlogs.length}
            </span>{" "}
            articles
          </p>

          {/* Page buttons */}
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              aria-label="Previous page"
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-border/40
                text-muted-foreground hover:border-[#24bbcb] hover:text-[#24bbcb]
                disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {/* Page numbers */}
            {pageRange.map((p, i) =>
              p === "…" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => goTo(p as number)}
                  aria-current={p === page ? "page" : undefined}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all duration-150
                    ${p === page
                      ? "bg-[#24bbcb] text-white border border-[#24bbcb]"
                      : "border border-border/40 text-muted-foreground hover:border-[#24bbcb] hover:text-[#24bbcb]"
                    }`}
                >
                  {p}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages}
              aria-label="Next page"
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-border/40
                text-muted-foreground hover:border-[#24bbcb] hover:text-[#24bbcb]
                disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogGrid;