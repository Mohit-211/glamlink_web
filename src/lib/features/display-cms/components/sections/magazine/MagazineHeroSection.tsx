"use client";

import type { MagazineSection } from '@/lib/pages/admin/components/content-settings/content/sections/magazine/types';
import { isMagazineHeroSection } from '@/lib/pages/admin/components/content-settings/content/sections/magazine/types';

interface MagazineHeroSectionProps {
  section: MagazineSection;
}

export function MagazineHeroSection({ section }: MagazineHeroSectionProps) {
  if (!isMagazineHeroSection(section)) return null;
  const { content } = section;

  return (
    <div className="bg-grey">
      <div className="container mx-auto px-4 pt-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{content.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{content.subtitle}</p>
        </div>
      </div>
    </div>
  );
}
