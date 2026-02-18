"use client";

import type { MagazineSection } from '@/lib/pages/admin/components/content-settings/content/sections/magazine/types';
import { isMagazineListingSection } from '@/lib/pages/admin/components/content-settings/content/sections/magazine/types';
import { MagazineListing } from "@/lib/pages/magazine/components/home";
import type { MagazineIssueCard } from "@/lib/pages/magazine/types";

interface MagazineListingSectionProps {
  section: MagazineSection;
  issues?: MagazineIssueCard[];
  issuesByYear?: Record<number, MagazineIssueCard[]>;
}

export function MagazineListingSection({ section, issues = [], issuesByYear = {} }: MagazineListingSectionProps) {
  if (!isMagazineListingSection(section)) return null;

  return <MagazineListing issues={issues} issuesByYear={issuesByYear} />;
}
