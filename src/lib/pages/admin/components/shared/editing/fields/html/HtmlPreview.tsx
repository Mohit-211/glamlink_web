'use client';

import React from 'react';

interface HtmlPreviewProps {
  content: string;
  className?: string;
}

export default function HtmlPreview({ content, className = '' }: HtmlPreviewProps) {
  if (!content) {
    return (
      <div className={`text-gray-400 italic p-4 border border-gray-200 rounded-md ${className}`}>
        No content to preview
      </div>
    );
  }

  return (
    <div
      className={`prose prose-sm max-w-none p-4 border border-gray-200 rounded-md ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
