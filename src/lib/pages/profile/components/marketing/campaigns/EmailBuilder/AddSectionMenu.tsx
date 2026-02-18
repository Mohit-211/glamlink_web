/**
 * Add Section Menu Component
 *
 * Floating menu for adding new sections to email.
 * Provides quick access to all section types.
 */

'use client';

import { useState } from 'react';
import { EmailSectionType } from '@/lib/features/crm/marketing/types';

interface AddSectionMenuProps {
  onAddSection: (type: EmailSectionType) => void;
}

type SectionTypeOption = {
  type: EmailSectionType;
  label: string;
  description: string;
  icon: string;
};

const SECTION_TYPES: SectionTypeOption[] = [
  {
    type: 'header',
    label: 'Header',
    description: 'Brand logo or title',
    icon: '🏷️',
  },
  {
    type: 'text',
    label: 'Text',
    description: 'Paragraph content',
    icon: '📝',
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Add a photo',
    icon: '🖼️',
  },
  {
    type: 'button',
    label: 'Button',
    description: 'Call-to-action',
    icon: '🔘',
  },
  {
    type: 'divider',
    label: 'Divider',
    description: 'Horizontal line',
    icon: '➖',
  },
  {
    type: 'footer',
    label: 'Footer',
    description: 'Contact & unsubscribe',
    icon: '📄',
  },
];

export function AddSectionMenu({ onAddSection }: AddSectionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (type: EmailSectionType) => {
    onAddSection(type);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
      {/* Menu */}
      {isOpen && (
        <div className="mb-3 bg-white rounded-xl shadow-xl border border-gray-200 p-2 w-80">
          <div className="grid grid-cols-2 gap-2">
            {SECTION_TYPES.map((option) => (
              <button
                key={option.type}
                onClick={() => handleSelect(option.type)}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-6 py-3 bg-pink-600 text-white rounded-full shadow-lg hover:bg-pink-700 transition-colors"
      >
        {isOpen ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="font-medium">Close</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">Add section</span>
          </>
        )}
      </button>
    </div>
  );
}
