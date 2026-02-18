"use client";

import type { ForClientsSection } from "@/lib/pages/admin/components/content-settings/content/sections/for-clients/types";
import { isHowItWorksSection } from "@/lib/pages/admin/components/content-settings/content/sections/for-clients/types";

interface HowItWorksSectionProps {
  section: ForClientsSection;
}

export function HowItWorksSection({ section }: HowItWorksSectionProps) {
  if (!isHowItWorksSection(section)) return null;
  const { content } = section;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {content.sectionTitle}
          </h2>
          <div className="space-y-8">
            {content.steps.map((step, index) => (
              <div key={step.id} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-glamlink-teal text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  {index < content.steps.length - 1 && (
                    <div className="mt-8 ml-6 w-px h-8 bg-gray-300"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
