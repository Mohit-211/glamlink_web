"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import BlogCard from "./BlogCard";
import { getAllBlogs } from "@/api/Api";
import slugify from "slugify";

interface BlogPost {
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
}

const BlogGrid: React.FC<Props> = ({ activeCategory }) => {
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!activeCategory || activeCategory === "All") {
      setFilteredBlogs(allBlogs);
      return;
    }

    const filtered = allBlogs.filter((blog) =>
      blog?.journal_category?.title
        ?.toLowerCase()
        .trim()
        .includes(activeCategory.toLowerCase().trim())
    );

    setFilteredBlogs(filtered);
  }, [activeCategory, allBlogs]);

  if (loading) {
    return (
      <p className="text-center py-16 text-sm text-muted-foreground">
        Loading articles...
      </p>
    );
  }

  if (!filteredBlogs.length) {
    return (
      <p className="text-center py-16 text-sm text-muted-foreground">
        No articles found.
      </p>
    );
  }

  return (
    <section className="mt-10">
      <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-x-12 gap-y-16">
        {filteredBlogs.map((item, index) => {
          const title = item.title || "Untitled";
          const author = item?.journal_author?.name || "Unknown";
          const category = item?.journal_category?.title || "General";
          const image = item.cover_image || "/assets/fallback.jpg";
          const excerpt = item.short_description || "";
          const date = new Date(
            item.created_at || Date.now()
          ).toLocaleDateString("en-US", {
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
    </section>
  );
};

export default BlogGrid;
