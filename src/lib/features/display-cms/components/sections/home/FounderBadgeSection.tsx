"use client";

import Image from "next/image";
import type { HomeSection } from '@/lib/pages/admin/components/content-settings/content/sections/home/types';
import { isFounderBadgeSection } from '@/lib/pages/admin/components/content-settings/content/sections/home/types';

interface FounderBadgeSectionProps {
  section: HomeSection;
}

export function FounderBadgeSection({ section }: FounderBadgeSectionProps) {
  if (!isFounderBadgeSection(section)) return null;
  const { content } = section;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom text-center">
        <div className="max-w-3xl mx-auto">
          {content.image && (
            <div className="mb-8">
              <Image
                src={content.image}
                alt="Founder Badge"
                width={120}
                height={120}
                className="mx-auto"
              />
            </div>
          )}

          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            {content.title}
          </h2>

          <p className="text-lg text-gray-600 mb-6">
            {content.description}
          </p>

          <p className="text-lg text-gray-700 font-medium">
            {content.subtext}
          </p>
        </div>
      </div>
    </section>
  );
}
