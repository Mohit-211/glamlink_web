'use client';

import { useEffect, useState, useMemo } from 'react';
import BlogCard from './BlogCard';
import Link from 'next/link';
import { getBlogsByCategpryId } from '@/api/Api';
import slugify from 'slugify';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────── */
const POSTS_PER_PAGE = 4;
const SIBLING_COUNT = 1;

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
function buildPageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const left = Math.max(2, current - SIBLING_COUNT);
  const right = Math.min(total - 1, current + SIBLING_COUNT);
  const pages: (number | '…')[] = [1];

  if (left > 2) pages.push('…');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push('…');
  pages.push(total);

  return pages;
}

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
interface Props {
  category_id: string;
}

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
const RelatedArticles: React.FC<Props> = ({ category_id }) => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!category_id) return;
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getBlogsByCategpryId(category_id);
        setBlogs(data?.data?.rows ?? []);
        setPage(1); // reset on category change
      } catch (error) {
        console.error('Error fetching related blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [category_id]);

  const totalPages = Math.max(1, Math.ceil(blogs.length / POSTS_PER_PAGE));

  const paginated = useMemo(() => {
    const start = (page - 1) * POSTS_PER_PAGE;
    return blogs.slice(start, start + POSTS_PER_PAGE);
  }, [blogs, page]);

  const goTo = (p: number) => {
    setPage(p);
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl overflow-hidden border border-gray-100"
          >
            <div className="w-full aspect-[16/10] bg-gray-100" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-gray-100 rounded w-1/3" />
              <div className="h-5 bg-gray-100 rounded w-full" />
              <div className="h-5 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (blogs.length === 0) return null;

  const pageRange = buildPageRange(page, totalPages);

  return (
    <div className="space-y-8">
      {/* ── Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {paginated.map((item, index) => {
          const slug = slugify(item?.title || '', { lower: true, strict: true });
          const formattedDate = item?.created_at
            ? new Date(item.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : '';

          return (
            <Link
              key={item?.id ?? index}
              href={`/journal/${item.id}/${slug}`}
              className="block h-full"
              style={{
                animation: 'fadeInUp 0.4s ease both',
                animationDelay: `${0.1 * (index + 1)}s`,
              }}
            >
              <BlogCard
                image={item?.cover_image}
                category={item?.journal_category?.title}
                title={item?.title}
                excerpt={item?.short_description}
                author={item?.journal_author?.name}
                date={formattedDate}
              />
            </Link>
          );
        })}
      </div>

      {/* ── Pagination bar ── */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 pt-2">
          {/* Count */}
          <p className="text-[11px] text-muted-foreground">
            Showing{' '}
            <span className="font-medium text-foreground">
              {(page - 1) * POSTS_PER_PAGE + 1}–
              {Math.min(page * POSTS_PER_PAGE, blogs.length)}
            </span>{' '}
            of{' '}
            <span className="font-medium text-foreground">{blogs.length}</span>{' '}
            articles
          </p>

          {/* Buttons */}
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
              p === '…' ? (
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
                  aria-current={p === page ? 'page' : undefined}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all duration-150
                    ${
                      p === page
                        ? 'bg-[#24bbcb] text-white border border-[#24bbcb]'
                        : 'border border-border/40 text-muted-foreground hover:border-[#24bbcb] hover:text-[#24bbcb]'
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

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default RelatedArticles;