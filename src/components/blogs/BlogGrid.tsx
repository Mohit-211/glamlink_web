'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import BlogCard from './BlogCard';
import Pagination from './Pagination';
import { getAllBlogs } from '@/api/Api';
import FeaturedPost from './FeaturedPost';
import slugify from "slugify";
interface BlogPost {
  id: number;
  title: string;
  short_description: string;
  cover_image: string;
  created_at: string;
}

const BlogGrid: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();

        const blogArray = Array.isArray(response?.data?.rows)
          ? response.data.rows
          : [];

        setBlogs(blogArray);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-6 py-12">
        <p className="text-center">Loading blogs...</p>
      </section>
    );
  }

  if (!blogs.length) {
    return (
      <section className="container mx-auto px-6 py-12">
        <p className="text-center">No blogs found.</p>
      </section>
    );
  }
console.log(blogs,"blogs")
  const featured = blogs[1]; // example: first blog as featured
  console.log(featured,"featured")
  // const regularPosts = blogs.slice(1);
  console.log(blogs, "blogs")
  return (
    <section className="container mx-auto px-6 py-12">

      {/* Featured */}
      {featured && (
        <Link href={`/journal/${featured.id}/${featured.title}`} className="block">
          <FeaturedPost
            image={featured?.cover_image}
            category="Blog"
            title={featured.title}
            excerpt={featured.short_description}
            author="Admin"
            date={new Date(featured.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          />
        </Link>
      )}

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
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

      <Pagination />
    </section>
  );
};

export default BlogGrid;
