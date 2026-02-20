'use client';

import React from 'react';
import type { PreviewComponentProps } from '@/lib/pages/admin/config/previewComponents';

/**
 * EditorsNotePreview - Preview of magazine editor's note
 *
 * Shows the editor's note with formatted HTML content
 */
export default function EditorsNotePreview({ issue }: PreviewComponentProps) {
  const backgroundColor = issue.editorNoteBackgroundColor || '#f9fafb';
  const editorNote = issue.editorNote;

  return (
    <div
      className="w-full min-h-[600px] rounded-lg overflow-hidden p-8"
      style={{
        background: backgroundColor.includes('linear-gradient')
          ? backgroundColor
          : backgroundColor
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {issue.editorNoteTocTitle || "Editor's Note"}
        </h1>
        {issue.editorNoteTocSubtitle && (
          <p className="text-lg text-gray-600">{issue.editorNoteTocSubtitle}</p>
        )}
      </div>

      {/* Content */}
      {editorNote ? (
        <div
          className="prose prose-lg max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: editorNote }}
          style={{
            fontFamily: 'Georgia, serif',
            lineHeight: '1.8'
          }}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No editor's note added yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Add an editor's note to see it previewed here
          </p>
        </div>
      )}

      {/* Footer */}
      {editorNote && (
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-600 text-center italic">
            — Marie Marks, Founder & CEO, Glamlink
          </p>
        </div>
      )}
    </div>
  );
}
