"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { ForProfessionalsSection } from '@/lib/pages/admin/components/content-settings/content/sections/for-professionals/types';
import { isTwoBoxesSection } from '@/lib/pages/admin/components/content-settings/content/sections/for-professionals/types';
import ProDownloadDialog from "@/lib/components/modals/ProDownloadDialog";

interface TwoBoxesSectionProps {
  section: ForProfessionalsSection;
}

export function TwoBoxesSection({ section }: TwoBoxesSectionProps) {
  if (!isTwoBoxesSection(section)) return null;
  const { content } = section;

  const [showProDialog, setShowProDialog] = useState(false);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* AI Box */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-2 bg-glamlink-teal"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {content.leftBox.title}
                </h3>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  {content.leftBox.description}
                </p>

                <div className="space-y-4 mb-8">
                  {content.leftBox.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-glamlink-teal/10 rounded-full flex items-center justify-center mt-0.5">
                        <Check className="w-4 h-4 text-glamlink-teal" />
                      </div>
                      <p className="text-gray-700">{feature}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowProDialog(true)}
                  className="block w-full text-center px-6 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
                >
                  {content.leftBox.buttonText}
                </button>
              </div>
            </div>

            {/* Founders Badge Box */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-2 bg-glamlink-teal"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {content.rightBox.title}
                </h3>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  {content.rightBox.description}
                </p>

                <div className="mb-6">
                  <p className="font-semibold text-gray-900 mb-4">{content.rightBox.criteriaLabel}</p>
                  <div className="space-y-3">
                    {content.rightBox.criteria.map((criteria, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-glamlink-teal/10 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="w-4 h-4 text-glamlink-teal" />
                        </div>
                        <p className="text-gray-700">{criteria}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowProDialog(true)}
                  className="block w-full text-center px-6 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
                >
                  {content.rightBox.buttonText}
                </button>
              </div>
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
