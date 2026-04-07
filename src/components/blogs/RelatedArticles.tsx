'use client';

import { useEffect, useState } from 'react';
import BlogCard from './BlogCard';
import Link from 'next/link';
import { getBlogsByCategpryId } from '@/api/Api';
import slugify from 'slugify';

interface Props {
  category_id: string;
}

const RelatedArticles: React.FC<Props> = ({ category_id }) => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category_id) return;
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getBlogsByCategpryId(category_id);
        const rows = data?.data?.rows || data?.data || data || [];
        setBlogs(Array.isArray(rows) ? rows.slice(0, 3) : []);
      } catch (error) {
        console.error('Error fetching related blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [category_id]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl overflow-hidden border border-gray-100">
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

  return (
    <>
      {/* Section header */}
      

      {/* Grid — always 3 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {blogs.map((item, index) => {
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

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default RelatedArticles;