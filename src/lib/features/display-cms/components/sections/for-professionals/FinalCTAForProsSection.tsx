"use client";

import { useState } from "react";
import type { ForProfessionalsSection } from '@/lib/pages/admin/components/content-settings/content/sections/for-professionals/types';
import { isFinalCTAForProsSection } from '@/lib/pages/admin/components/content-settings/content/sections/for-professionals/types';
import ProDownloadDialog from "@/lib/components/modals/ProDownloadDialog";

interface FinalCTAForProsSectionProps {
  section: ForProfessionalsSection;
}

export function FinalCTAForProsSection({ section }: FinalCTAForProsSectionProps) {
  if (!isFinalCTAForProsSection(section)) return null;
  const { content } = section;

  const [showProDialog, setShowProDialog] = useState(false);

  const handlePrimaryClick = () => {
    if (content.primaryButton.action === 'download-pro') {
      setShowProDialog(true);
    }
  };

  const handleSecondaryClick = () => {
    if (content.secondaryButton.action === 'external-link' && content.secondaryButton.link) {
      window.open(content.secondaryButton.link, '_blank', 'noopener,noreferrer');
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
              onClick={handlePrimaryClick}
              className="px-8 py-4 bg-white text-glamlink-teal font-bold text-lg rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              {content.primaryButton.text}
            </button>
            <button
              onClick={handleSecondaryClick}
              className="px-8 py-4 bg-transparent text-white font-bold text-lg rounded-full border-2 border-white hover:bg-white/10 transition-colors"
            >
              {content.secondaryButton.text}
            </button>
          </div>

          <p className="mt-8 text-white/80">
            {content.disclaimer}
          </p>
        </div>
      </div>

      {/* Pro Download Dialog */}
      <ProDownloadDialog
        isOpen={showProDialog}
        onClose={() => setShowProDialog(false)}
      />
    </section>
  );
}
