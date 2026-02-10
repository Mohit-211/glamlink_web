'use client';
import { useState } from 'react';

const categories = [
  'All',
  'Beauty Professionals',
  'Salon Growth',
  'Influencer Marketing',
  'Trends',
  'Industry Insights',
];

const CategoryNav = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <nav className="border-b border-border/50 bg-background sticky top-[65px] z-40">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-1 overflow-x-auto py-4 scrollbar-hide -mx-2 px-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`category-pill whitespace-nowrap ${
                activeCategory === category
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
