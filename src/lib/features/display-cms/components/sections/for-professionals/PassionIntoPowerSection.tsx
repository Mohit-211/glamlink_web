"use client";

import { useState } from "react";
import type { ForProfessionalsSection } from '@/lib/pages/admin/components/content-settings/content/sections/for-professionals/types';
import { isPassionIntoPowerSection } from '@/lib/pages/admin/components/content-settings/content/sections/for-professionals/types';
import ProDownloadDialog from "@/lib/components/modals/ProDownloadDialog";

interface PassionIntoPowerSectionProps {
  section: ForProfessionalsSection;
}

export function PassionIntoPowerSection({ section }: PassionIntoPowerSectionProps) {
  if (!isPassionIntoPowerSection(section)) return null;
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
    <section className="pb-12 bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            {content.title}
          </h2>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-12">
            {content.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex flex-col items-center">
              <button
                onClick={handlePrimaryClick}
                className="px-8 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
              >
                {content.primaryButton.text}
              </button>
              <span className="text-sm text-gray-600 mt-2">{content.primaryButton.subtext}</span>
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={handleSecondaryClick}
                className="px-8 py-3 bg-white text-glamlink-teal font-semibold rounded-full border-2 border-glamlink-teal hover:bg-gray-50 transition-colors"
              >
                {content.secondaryButton.text}
              </button>
              <span className="text-sm text-gray-600 mt-2">{content.secondaryButton.subtext}</span>
            </div>
          </div>
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
