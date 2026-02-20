"use client";

import type { DigitalCardFinalCTASection as DigitalCardFinalCTASectionType } from '@/lib/pages/admin/components/content-settings/content/sections/digital-card/types';
import { isDigitalCardFinalCTASection } from '@/lib/pages/admin/components/content-settings/content/sections/digital-card/types';

interface DigitalCardFinalCTASectionProps {
  section: DigitalCardFinalCTASectionType | any;
}

/**
 * Digital Card Final CTA Section
 *
 * Gradient background section with title, subtitle, two CTAs, and disclaimer
 * Matches legacy design with teal-to-cyan gradient
 */
export function DigitalCardFinalCTASection({ section }: DigitalCardFinalCTASectionProps) {
  if (!isDigitalCardFinalCTASection(section)) {
    return null;
  }

  const { content } = section;

  const scrollToForm = () => {
    const formElement = document.getElementById('digital-card-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-gradient-to-r from-glamlink-teal to-cyan-600">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {content.title}
          </h2>

          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {content.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToForm}
              className="px-8 py-4 bg-white text-glamlink-teal font-bold text-lg rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              {content.primaryButton.text}
            </button>
            <a
              href={content.secondaryButton.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-transparent text-white font-bold text-lg rounded-full border-2 border-white hover:bg-white/10 transition-colors"
            >
              {content.secondaryButton.text}
            </a>
          </div>

          <p className="mt-8 text-white/80">
            {content.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
