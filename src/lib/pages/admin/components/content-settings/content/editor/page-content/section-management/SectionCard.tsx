'use client';

import { ForClientsSection, getSectionTypeLabel } from '../../../sections/for-clients/types';

interface SectionCardProps {
  section: ForClientsSection;
  index: number;
  totalSections: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function SectionCard({
  section,
  index,
  totalSections,
  onEdit,
  onDelete,
  onToggleVisibility,
  onMoveUp,
  onMoveDown
}: SectionCardProps) {
  return (
    <div className={`border rounded-lg ${section.visible ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'}`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Section info */}
        <div className="flex items-center gap-4">
          {/* Order number */}
          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
            {index + 1}
          </span>

          {/* Section details */}
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${section.visible ? 'text-gray-900' : 'text-gray-500'}`}>
                {section.name}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium bg-glamlink-teal/10 text-glamlink-teal rounded">
                {getSectionTypeLabel(section.type)}
              </span>
              {!section.visible && (
                <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-500 rounded">
                  Hidden
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1">
          {/* Move Up */}
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {/* Move Down */}
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === totalSections - 1}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* Toggle Visibility */}
          <button
            type="button"
            onClick={onToggleVisibility}
            className={`p-2 rounded-md ${
              section.visible
                ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                : 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50'
            }`}
            title={section.visible ? 'Hide section' : 'Show section'}
          >
            {section.visible ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={onEdit}
            className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
            title="Edit section"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={onDelete}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
            title="Delete section"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
