'use client';

import type { HomeSection } from '@/lib/pages/admin/components/content-settings/content/sections/home/types';
import { isDigitalCardsShowcaseSection } from '@/lib/pages/admin/components/content-settings/content/sections/home/types';
import PaginationCarouselClean from '@/lib/pages/for-professionals/components/PaginationCarouselClean';

interface DigitalCardsShowcaseSectionProps {
  section: HomeSection;
}

export function DigitalCardsShowcaseSection({ section }: DigitalCardsShowcaseSectionProps) {
  if (!isDigitalCardsShowcaseSection(section)) return null;

  const { content } = section;

  return (
    <section className="py-12 bg-white">
      {/* Pass title/subtitle to carousel for consistent styling */}
      <PaginationCarouselClean
        cardsPerPage={content.cardsPerPage || 6}
        title={content.title}
        subtitle={content.subtitle}
      />
    </section>
  );
}

export default DigitalCardsShowcaseSection;
