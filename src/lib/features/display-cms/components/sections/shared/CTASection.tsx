"use client";

import { useState } from "react";
import type { HomeSection } from '@/lib/pages/admin/components/content-settings/content/sections/home/types';
import { isCTASection } from '@/lib/pages/admin/components/content-settings/content/sections/home/types';
import UserDownloadDialog from "@/lib/components/modals/UserDownloadDialog";
import ProDownloadDialog from "@/lib/components/modals/ProDownloadDialog";

interface CTASectionProps {
  section: HomeSection | any; // Allow for-clients sections too
  onCtaClick?: () => void;
}

export function CTASection({ section }: CTASectionProps) {
  if (!section || section.type !== 'cta') return null;
  const { content } = section;

  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showProDialog, setShowProDialog] = useState(false);

  // Check if this is a for-clients CTA (simpler structure with heading/buttonText)
  const isForClientsCTA = content && 'heading' in content && 'buttonText' in content;

  // Check if this is a home CTA (complex structure with userSection/proSection)
  const isHomeCTA = content && 'userSection' in content && 'proSection' in content;

  const handleUserClick = () => {
    if (isHomeCTA && content.userSection?.button?.action === "download-user") {
      setShowUserDialog(true);
    }
  };

  const handleProClick = () => {
    if (isHomeCTA && content.proSection?.button?.action === "download-pro") {
      setShowProDialog(true);
    }
  };

  const handleForClientsClick = () => {
    if (isForClientsCTA && content.buttonAction === "download") {
      setShowUserDialog(true);
    }
  };

  // Render for-clients CTA (simple single button)
  if (isForClientsCTA) {
    const gradientClass = content.gradientFrom && content.gradientTo
      ? `bg-gradient-to-r from-${content.gradientFrom} to-${content.gradientTo}`
      : content.backgroundColor
      ? `bg-${content.backgroundColor}`
      : 'bg-gradient-to-r from-glamlink-teal to-cyan-600';

    return (
      <>
        <section className={`py-16 ${gradientClass}`}>
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                {content.heading}
              </h2>
              <button
                onClick={handleForClientsClick}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full transition bg-white text-glamlink-teal hover:bg-gray-100 shadow-lg"
              >
                {content.buttonText}
              </button>
            </div>
          </div>
        </section>
        <UserDownloadDialog isOpen={showUserDialog} onClose={() => setShowUserDialog(false)} />
      </>
    );
  }

  // Render home CTA (dual buttons with sections)
  if (isHomeCTA) {
    return (
      <>
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-semibold text-gray-900 mb-8">{content.title}</h2>

              <p className="text-lg text-gray-700 mb-12">{content.subtitle}</p>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {content.userSection.title}
                  </h3>
                  <p className="text-gray-700">{content.userSection.description}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {content.proSection.title}
                  </h3>
                  <p className="text-gray-700">{content.proSection.description}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleUserClick}
                  className="inline-flex items-center justify-center px-8 py-3 font-medium rounded-full transition bg-glamlink-teal text-white hover:bg-teal-700"
                >
                  {content.userSection.button.text}
                </button>
                <button
                  onClick={handleProClick}
                  className="inline-flex items-center justify-center px-8 py-3 font-medium rounded-full transition bg-gray-900 text-white hover:bg-gray-800"
                >
                  {content.proSection.button.text}
                </button>
              </div>
            </div>
          </div>
        </section>

        <UserDownloadDialog isOpen={showUserDialog} onClose={() => setShowUserDialog(false)} />
        <ProDownloadDialog isOpen={showProDialog} onClose={() => setShowProDialog(false)} />
      </>
    );
  }

  // Fallback if neither structure matches
  return null;
}
