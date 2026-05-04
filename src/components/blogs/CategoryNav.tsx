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
  vertical?: boolean;
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
  /* ✅ DESKTOP SIDEBAR (UNCHANGED) */
  /* ───────────────────────────────────────────── */
  if (vertical) {
    return (
      <div className="border border-border/40 rounded-xl p-4 bg-background shadow-sm">
        <div className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Categories
          </h2>
        </div>

        <div className="flex flex-col gap-1">
          <button
            onClick={() => setActiveCategory("All")}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition
              ${
                activeCategory === "All"
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
          >
            All
          </button>

          {!loading &&
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.title)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition
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
  /* ✅ MOBILE HORIZONTAL SCROLL (LIKE ALLURE) */
  /* ───────────────────────────────────────────── */

  return (
    <nav className="lg:hidden sticky top-[60px] z-50 bg-white border-b border-gray-200">
      <div className="w-full px-4">
        <div className="flex items-center gap-3 overflow-x-auto py-3 whitespace-nowrap scrollbar-hide">
          
          {/* ALL */}
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium flex-shrink-0 transition
              ${
                activeCategory === "All"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
          >
            All
          </button>

          {/* DYNAMIC */}
          {!loading &&
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.title)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex-shrink-0 transition
                  ${
                    activeCategory === category.title
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700"
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