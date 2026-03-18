'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import BlogCard from './BlogCard';
import { getAllBlogs } from '@/api/Api';
import FeaturedPost from './FeaturedPost';
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

interface Props {
  activeCategory: string;
}

const BlogGrid: React.FC<Props> = ({ activeCategory }) => {
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch once
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();

        const blogArray = Array.isArray(response?.data?.rows)
          ? response.data.rows
          : [];

        setAllBlogs(blogArray);
        setFilteredBlogs(blogArray);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setAllBlogs([]);
        setFilteredBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // 🔥 Filter when category changes
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredBlogs(allBlogs);
    } else {
      const filtered = allBlogs.filter(
        (blog) =>
          blog?.journal_category?.title === activeCategory
      );
      setFilteredBlogs(filtered);
    }
  }, [activeCategory, allBlogs]);

  if (loading) {
    return (
      <section className="container mx-auto px-6 py-12">
        <p className="text-center">Loading blogs...</p>
      </section>
    );
  }

  if (!filteredBlogs.length) {
    return (
      <section className="container mx-auto px-6 py-12">
        <p className="text-center">No blogs found.</p>
      </section>
    );
  }

  const featured = filteredBlogs[0];

  return (
    <section className="container mx-auto px-6 py-12">

      {/* Featured */}
      {featured && (
        <Link
          href={`/journal/${featured.id}/${slugify(featured.title, {
            lower: true,
            strict: true,
          })}`}
        >
          <FeaturedPost
            image={featured.cover_image}
            category={featured?.journal_category?.title}
            title={featured.title}
            excerpt={featured.short_description}
            author={featured?.journal_author?.name}
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
        {filteredBlogs.map((item, index) => (
          <Link
            key={item.id}
            href={`/journal/${item.id}/${slugify(item.title, {
              lower: true,
              strict: true,
            })}`}
            className="block animate-fade-in-up"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <BlogCard
              image={item.cover_image}
              category={item?.journal_category?.title}
              title={item.title}
              excerpt={item.short_description}
              author={item?.journal_author?.name}
              date={new Date(item.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BlogGrid;