"use client";

import type { ForProfessionalsSection } from '@/lib/pages/admin/components/content-settings/content/sections/for-professionals/types';
import { isPaginationCarouselSection } from '@/lib/pages/admin/components/content-settings/content/sections/for-professionals/types';
import PaginationCarouselClean from "@/lib/pages/for-professionals/components/PaginationCarouselClean";

interface PaginationCarouselSectionProps {
  section: ForProfessionalsSection;
}

export function PaginationCarouselSection({ section }: PaginationCarouselSectionProps) {
  if (!isPaginationCarouselSection(section)) return null;

  return (
    <PaginationCarouselClean
      title="Meet The Professionals"
      subtitle="Browse our network of certified beauty professionals"
    />
  );
}
