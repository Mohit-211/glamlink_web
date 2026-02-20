'use client';

import { PROFESSIONAL_CATEGORIES } from '@/lib/config/professionalCategories';
import {
  Users,
  Sparkles,
  Scissors,
  Heart,
  Droplet,
  Palette,
  Zap,
} from 'lucide-react';

interface CategoryTabsProps {
  selected: string;
  onSelect: (id: string) => void;
}

// Icon mapping for categories
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Sparkles,
  Scissors,
  Heart,
  Droplet,
  Palette,
  Zap,
};

export default function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {PROFESSIONAL_CATEGORIES.map((category) => {
        const isSelected = selected === category.id;
        const IconComponent = category.icon ? iconMap[category.icon] : null;

        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
              ${
                isSelected
                  ? 'bg-glamlink-teal text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-glamlink-teal/50'
              }
            `}
          >
            {IconComponent && (
              <IconComponent
                className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-glamlink-teal'}`}
              />
            )}
            <span className="font-medium text-sm whitespace-nowrap">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}
