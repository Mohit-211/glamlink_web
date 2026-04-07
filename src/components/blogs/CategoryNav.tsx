"use client";

import { getCategories } from "@/api/Api";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  title: string;
}

interface Props {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  vertical?: boolean; // ✅ NEW
}

const CategoryNav = ({
  activeCategory,
  setActiveCategory,
  vertical = false,
}: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();

        const categoryArray = Array.isArray(response?.data?.rows)
          ? response.data.rows
          : [];

        setCategories(categoryArray);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* ───────────────────────────────────────────── */
  /* 🔥 VERTICAL SIDEBAR VERSION */
  /* ───────────────────────────────────────────── */
  if (vertical) {
    return (
      <div className="border border-border/40 rounded-xl p-4 bg-background shadow-sm">
        {/* Title */}
        <div className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Categories
          </h2>
        </div>

        {/* List */}
        <div className="flex flex-col gap-1">
          {/* All */}
          <button
            onClick={() => setActiveCategory("All")}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200
              ${
                activeCategory === "All"
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
          >
            All
          </button>

          {/* Categories */}
          {!loading &&
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.title)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200
                  ${
                    activeCategory === category.title
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
              >
                {category.title}
              </button>
            ))}
        </div>
      </div>
    );
  }

  /* ───────────────────────────────────────────── */
  /* DEFAULT (HORIZONTAL — KEEP FOR MOBILE/FALLBACK) */
  /* ───────────────────────────────────────────── */

  return (
    <nav className="sticky top-[65px] z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-6 overflow-x-auto py-4 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap
              ${
                activeCategory === "All"
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
          >
            All
          </button>

          {!loading &&
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.title)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap
                  ${
                    activeCategory === category.title
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {category.title}
              </button>
            ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
