'use client';

import React from 'react';
import type { PreviewComponentProps } from '@/lib/pages/admin/config/previewComponents';
import type { MagazineIssueSection } from '@/lib/pages/magazine/types';

/**
 * TableOfContentsPreview - Preview of magazine table of contents
 *
 * Shows a list of all sections in the magazine issue with page numbers
 * Matches the actual TableOfContentsSection rendering
 */
export default function TableOfContentsPreview({ issue }: PreviewComponentProps) {
  const backgroundColor = (issue as any)?.tocBackgroundColor || '#ffffff';
  const sections = issue.sections || [];

  // Get background styles
  const bgStyle: React.CSSProperties = {};
  let bgClass = '';

  if (backgroundColor) {
    if (backgroundColor.startsWith('#') || backgroundColor.startsWith('linear-gradient') || backgroundColor.startsWith('radial-gradient')) {
      bgStyle.background = backgroundColor;
    } else if (backgroundColor.startsWith('bg-')) {
      bgClass = backgroundColor;
    }
  }

  // Filter out the cover and TOC sections themselves
  const contentSections = sections.filter((section: MagazineIssueSection) =>
    section.id !== 'cover' &&
    section.id !== 'toc' &&
    section.type !== 'table-of-contents'
  );

  return (
    <div
      className={`w-full min-h-[600px] rounded-lg overflow-hidden p-8 ${bgClass}`}
      style={bgStyle}
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Table of Contents</h1>
        {issue.title && (
          <p className="text-lg text-gray-600">{issue.title}</p>
        )}
        {issue.issueDate && (
          <p className="text-sm text-gray-500 mt-1">{formatDate(issue.issueDate)}</p>
        )}
      </div>

      {/* Editor's Note (if present) */}
      {issue.editorNote && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex justify-between items-baseline">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {(issue as any).editorNoteTocTitle || "Editor's Note"}
              </h3>
              {(issue as any).editorNoteTocSubtitle && (
                <p className="text-sm text-gray-600">{(issue as any).editorNoteTocSubtitle}</p>
              )}
            </div>
            <span className="text-gray-500 font-medium">2</span>
          </div>
        </div>
      )}

      {/* Sections List */}
      {contentSections.length > 0 ? (
        <div className="space-y-4">
          {contentSections.map((section: MagazineIssueSection, index: number) => {
            // Page number starts after cover (1) and editor's note (2 if present)
            const pageNumber = issue.editorNote ? index + 3 : index + 2;

            return (
              <div
                key={section.id || index}
                className="flex justify-between items-baseline pb-2 border-b border-gray-100 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900">
                    {section.title || `Section ${index + 1}`}
                  </h4>
                  {section.subtitle && (
                    <p className="text-sm text-gray-600 mt-0.5">{section.subtitle}</p>
                  )}
                  {/* Show section type as helper text */}
                  <p className="text-xs text-gray-400 mt-1 capitalize">
                    {formatSectionType(section.type)}
                  </p>
                </div>
                <span className="text-gray-500 font-medium ml-4">{pageNumber}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p>No sections added yet</p>
          <p className="text-sm mt-2">Add sections to see them in the table of contents</p>
        </div>
      )}

      {/* Summary Footer */}
      {contentSections.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600">
            {contentSections.length} {contentSections.length === 1 ? 'section' : 'sections'} • Issue #{issue.issueNumber || 1}
          </p>
        </div>
      )}
    </div>
  );
}

// Helper function to format date
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

// Helper function to format section type
function formatSectionType(type: string): string {
  return type
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}
