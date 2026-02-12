'use client';

import { getCategories } from '@/api/Api';
import { useEffect, useState } from 'react';

interface Category {
  id: number;
  title: string;
}

const CategoryNav = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();

        console.log("Full API Response:", response);

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

  return (
  <nav className="sticky top-[65px] z-40 bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-center gap-6 overflow-x-auto py-4 scrollbar-hide">

        {/* Default All */}
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            activeCategory === 'All'
              ? 'bg-primary/10 text-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All
        </button>

        {/* API Categories */}
        {!loading &&
          categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.title)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeCategory === category.title
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:text-gray-900'
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
