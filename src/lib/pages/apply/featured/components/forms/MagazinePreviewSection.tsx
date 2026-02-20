"use client";

import { useState } from "react";
import { GetFeaturedFormData } from "../../types";
import MagazinePreviewDialog from "../MagazinePreviewDialog";

interface MagazinePreviewSectionProps {
  formData: GetFeaturedFormData;
}

export default function MagazinePreviewSection({
  formData
}: MagazinePreviewSectionProps) {
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  return (
    <>
      {/* Preview Magazine Content Button */}
      <div className="bg-gradient-to-r from-glamlink-teal/10 to-cyan-50 rounded-lg border border-glamlink-teal/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Preview Magazine Content
            </h4>
            <p className="text-gray-600 text-sm">
              See how your magazine content could appear in different featured layouts and styles
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPreviewDialog(true)}
            className="flex-shrink-0 px-4 py-2 bg-glamlink-teal text-white rounded-lg hover:bg-glamlink-teal-dark focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:ring-offset-2 transition-colors duration-200"
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </div>
          </button>
        </div>
      </div>

      {/* Magazine Preview Dialog */}
      <MagazinePreviewDialog
        isOpen={showPreviewDialog}
        onClose={() => setShowPreviewDialog(false)}
        formData={formData}
      />
    </>
  );
}