'use client';

/**
 * NameTitle - Professional name, title, and business name display
 */

import React from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';

export interface NameTitleProps {
  professional: Professional;
}

export default function NameTitle({ professional }: NameTitleProps) {
  return (
    <div className="text-center" style={{ marginBottom: '30px' }}>
      <h1
        className="font-bold text-gray-900"
        style={{ fontSize: '56px', lineHeight: '1.2', marginBottom: '12px' }}
      >
        {professional.name || 'Professional Name'}
      </h1>
      {professional.title && (
        <p
          className="text-gray-600"
          style={{ fontSize: '32px', marginBottom: '8px' }}
        >
          {professional.title}
        </p>
      )}
      {professional.business_name && (
        <p
          className="text-glamlink-teal font-medium"
          style={{ fontSize: '28px' }}
        >
          {professional.business_name}
        </p>
      )}
    </div>
  );
}
