"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import BlogCard from "./BlogCard";
import { getAllBlogs } from "@/api/Api";
import slugify from "slugify";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";

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
  /** Debounced search query from JournalClient's search bar (title/category/author/content) */
  searchQuery: string;
  /** Called whenever the category filter causes the page to reset */
  onPageReset?: () => void;
  /** Resets the active category back to "All" (used by the search empty state) */
  onResetCategory?: () => void;
  /** Clears the search input (used by the search empty state) */
  onClearSearch?: () => void;
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
const BlogGrid: React.FC<Props> = ({
  activeCategory,
  searchQuery,
  onResetCategory,
  onClearSearch,
}) => {
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const normalizedQuery = searchQuery.trim().toLowerCase();

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

  /* Reset to page 1 whenever the category or search query changes */
  useEffect(() => {
    setPage(1);
  }, [activeCategory, normalizedQuery]);

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

  /* Filter by category */
  const categoryFilteredBlogs = useMemo(() => {
    // Exclude the featured/cover-feature post so it isn't duplicated in the grid
    const withoutFeatured =
      featuredId != null
        ? allBlogs.filter((blog) => blog.id !== featuredId)
        : allBlogs;

    if (!activeCategory || activeCategory === "All") return withoutFeatured;
    return withoutFeatured.filter(
      (blog) =>
        blog?.journal_category?.title &&
        slugify(blog.journal_category.title, { lower: true, strict: true }) ===
          activeCategory
    );
  }, [activeCategory, allBlogs, featuredId]);

  /* Further filter by search query — matches title, category, author, or excerpt/content */
  const filteredBlogs = useMemo(() => {
    if (!normalizedQuery) return categoryFilteredBlogs;
    return categoryFilteredBlogs.filter((blog) => {
      const haystack = [
        blog.title,
        blog.short_description,
        blog?.journal_category?.title,
        blog?.journal_author?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [categoryFilteredBlogs, normalizedQuery]);

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

  /* ── Initial loading (skeleton) ── */
  if (loading) {
    return (
      <section className="mt-10 space-y-10">
        <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-x-12 gap-y-16" aria-hidden="true">
          {Array.from({ length: POSTS_PER_PAGE }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 animate-pulse">
              <div className="w-full aspect-video rounded-2xl bg-muted/60" />
              <div className="space-y-2">
                <div className="h-2.5 w-16 rounded bg-muted/60" />
                <div className="h-4 w-4/5 rounded bg-muted/60" />
                <div className="h-3 w-full rounded bg-muted/40" />
                <div className="h-3 w-2/3 rounded bg-muted/40" />
              </div>
            </div>
          ))}
        </div>
        <p className="sr-only" role="status">
          Loading articles…
        </p>
      </section>
    );
  }

  const pageRange = buildPageRange(page, totalPages);
  const hasActiveCategory = !!activeCategory && activeCategory !== "All";

  return (
    <section className="mt-10 space-y-10">
      {/* ── Empty state ── */}
      {!filteredBlogs.length ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <SearchX className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm font-medium text-foreground">
            {normalizedQuery
              ? `No articles match "${searchQuery}"`
              : "No articles found."}
          </p>
          <p className="max-w-sm text-xs text-muted-foreground">
            {normalizedQuery
              ? "Try a different keyword, or check the spelling. You can search by title, category, author, or content."
              : "There are no articles in this category yet."}
          </p>
          <div className="flex items-center gap-3 pt-1">
            {normalizedQuery && onClearSearch && (
              <button
                onClick={onClearSearch}
                className="text-xs font-medium text-[#24bbcb] hover:underline"
              >
                Clear search
              </button>
            )}
            {hasActiveCategory && onResetCategory && (
              <button
                onClick={onResetCategory}
                className="text-xs font-medium text-[#24bbcb] hover:underline"
              >
                View all categories
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* ── Result count (search only) ── */}
          {normalizedQuery && (
            <p className="text-[11px] text-muted-foreground -mb-4">
              {filteredBlogs.length}{" "}
              {filteredBlogs.length === 1 ? "result" : "results"} for &ldquo;
              {searchQuery}&rdquo;
            </p>
          )}

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
        </>
      )}
    </section>
  );
};

export default BlogGrid;