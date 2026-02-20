'use client';

import React from 'react';

interface HtmlFieldWrapperProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function HtmlFieldWrapper({
  value,
  onChange,
  placeholder,
}: HtmlFieldWrapperProps) {
  // Import TipTap editor directly for standalone use
  const { TiptapEditor } = require('@/lib/pages/admin/components/shared/editing/fields/html');

  return (
    <TiptapEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder || 'Start typing...'}
      minHeight={150}
    />
  );
}
