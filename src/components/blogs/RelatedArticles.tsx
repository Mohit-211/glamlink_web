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
        console.log(data,"data")
        setBlogs(data?.data?.rows
 || data || []);
      } catch (error) {
        console.error('Error fetching related blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [category_id]);

  return (
    <section className="bg-secondary/30 py-16 md:py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="caption-text text-caption mb-3">Continue Reading</p>
            <h2 className="font-editorial text-2xl md:text-3xl font-medium text-headline">
              Related Articles
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-10">No related articles found</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {blogs?.map((item, index) => (
                      <Link
                        key={item?.id}
                        href={`/journal/${item.id}/${slugify(item.title, {
                          lower: true,
                          strict: true,
                        })}`}
                        className="block animate-fade-in-up"
                        style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                      >
                      
                        <BlogCard
                          image={item?.cover_image}
                          category="Blog"
                          title={item.title}
                          excerpt={item?.short_description}
                          author="Admin"
                          date={new Date(item.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        />
                      </Link>
                    ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RelatedArticles;
