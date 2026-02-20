"use client";

import CardWithIconAnimated from "@/lib/components/CardWithIconAnimated";
import type { ForClientsSection } from "@/lib/pages/admin/components/content-settings/content/sections/for-clients/types";
import { isFeaturesSection } from "@/lib/pages/admin/components/content-settings/content/sections/for-clients/types";

interface FeaturesSectionProps {
  section: ForClientsSection;
}

export function FeaturesSection({ section }: FeaturesSectionProps) {
  if (!isFeaturesSection(section)) return null;
  const { content } = section;

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            {content.sectionTitle}
          </h2>

          <div className="grid lg:grid-cols-2 gap-6">
            {content.features.map((feature) => (
              <CardWithIconAnimated
                key={feature.id}
                title={feature.title}
                description={feature.description}
                icon={feature.icon || ""}
                // @ts-expect-error - animation can be undefined
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
