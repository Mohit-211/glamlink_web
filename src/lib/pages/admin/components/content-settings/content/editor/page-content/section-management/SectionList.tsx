'use client';

import { ForClientsSection } from '../../../sections/for-clients/types';
import SectionCard from './SectionCard';

interface SectionListProps {
  sections: ForClientsSection[];
  onEditSection: (section: ForClientsSection) => void;
  onDeleteSection: (sectionId: string) => void;
  onToggleVisibility: (sectionId: string) => void;
  onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
}

export default function SectionList({
  sections,
  onEditSection,
  onDeleteSection,
  onToggleVisibility,
  onMoveSection
}: SectionListProps) {
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  if (sortedSections.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 className="mt-4 text-sm font-medium text-gray-900">No sections added</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding a section to your page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedSections.map((section, index) => (
        <SectionCard
          key={section.id}
          section={section}
          index={index}
          totalSections={sortedSections.length}
          onEdit={() => onEditSection(section)}
          onDelete={() => {
            if (confirm(`Are you sure you want to delete "${section.name}"? This cannot be undone.`)) {
              onDeleteSection(section.id);
            }
          }}
          onToggleVisibility={() => onToggleVisibility(section.id)}
          onMoveUp={() => onMoveSection(section.id, 'up')}
          onMoveDown={() => onMoveSection(section.id, 'down')}
        />
      ))}
    </div>
  );
}
