"use client";

import type { PromosSection } from '@/lib/pages/admin/components/content-settings/content/sections/promos/types';
import { isPromosHeroSection } from '@/lib/pages/admin/components/content-settings/content/sections/promos/types';

interface PromosHeroSectionProps {
  section: PromosSection;
}

export function PromosHeroSection({ section }: PromosHeroSectionProps) {
  if (!isPromosHeroSection(section)) return null;
  const { content } = section;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {content.title}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {content.subtitle}
        </p>
      </header>
    </div>
  );
}
