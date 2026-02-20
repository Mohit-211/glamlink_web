/**
 * Email Builder Component
 *
 * Right sidebar for editing individual email sections.
 * Provides section-specific editors and delete functionality.
 */

'use client';

import { Campaign, EmailSection } from '@/lib/features/crm/marketing/types';
import { SectionEditor } from './SectionEditor';

interface EmailBuilderProps {
  campaign: Campaign;
  selectedSectionId: string;
  onChange: (updates: Partial<Campaign>) => void;
  onClose: () => void;
}

export function EmailBuilder({ campaign, selectedSectionId, onChange, onClose }: EmailBuilderProps) {
  const selectedSection = campaign.content?.sections?.find(s => s.id === selectedSectionId);

  if (!selectedSection) return null;

  const handleSectionUpdate = (updates: Partial<EmailSection>) => {
    const updatedSections = campaign.content?.sections?.map(s =>
      s.id === selectedSectionId ? { ...s, ...updates } : s
    );
    onChange({
      content: { ...campaign.content, sections: updatedSections }
    });
  };

  const handleDelete = () => {
    const updatedSections = campaign.content?.sections?.filter(s => s.id !== selectedSectionId);
    onChange({
      content: { ...campaign.content, sections: updatedSections }
    });
    onClose();
  };

  const handleMoveUp = () => {
    const sections = campaign.content?.sections || [];
    const index = sections.findIndex(s => s.id === selectedSectionId);
    if (index > 0) {
      const newSections = [...sections];
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
      onChange({
        content: { ...campaign.content, sections: newSections }
      });
    }
  };

  const handleMoveDown = () => {
    const sections = campaign.content?.sections || [];
    const index = sections.findIndex(s => s.id === selectedSectionId);
    if (index < sections.length - 1) {
      const newSections = [...sections];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      onChange({
        content: { ...campaign.content, sections: newSections }
      });
    }
  };

  const currentIndex = campaign.content?.sections?.findIndex(s => s.id === selectedSectionId) ?? -1;
  const totalSections = campaign.content?.sections?.length ?? 0;

  return (
    <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto max-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-gray-900 capitalize">{selectedSection.type} Section</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Delete section"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Close editor"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Section Position Controls */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
        <span className="text-sm text-gray-500">
          Section {currentIndex + 1} of {totalSections}
        </span>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleMoveUp}
            disabled={currentIndex === 0}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={handleMoveDown}
            disabled={currentIndex === totalSections - 1}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Section Editor */}
      <SectionEditor
        section={selectedSection}
        onChange={handleSectionUpdate}
      />
    </div>
  );
}
