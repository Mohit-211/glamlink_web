"use client";

import type { ForProfessionalsSection } from '@/lib/pages/admin/components/content-settings/content/sections/for-professionals/types';
import { isEverythingYouNeedSection } from '@/lib/pages/admin/components/content-settings/content/sections/for-professionals/types';
import CardWithIconAnimated from "@/lib/components/CardWithIconAnimated";

interface EverythingYouNeedSectionProps {
  section: ForProfessionalsSection;
}

export function EverythingYouNeedSection({ section }: EverythingYouNeedSectionProps) {
  if (!isEverythingYouNeedSection(section)) return null;
  const { content } = section;

  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {content.title}
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
              {content.subtitle}
            </p>
          </div>

          {/* Feature Cards Grid using CardWithIconAnimated */}
          <div className="grid lg:grid-cols-2 gap-6">
            {content.features.map((feature) => (
              <CardWithIconAnimated
                key={feature.id}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                animation={feature.animation}
                isComingSoon={feature.isComingSoon}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
