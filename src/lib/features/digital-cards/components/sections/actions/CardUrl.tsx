'use client';

/**
 * CardUrl - Display the digital card URL
 */

import React from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';

export interface CardUrlProps {
  professional: Professional;
  cardUrl: string;
}

export default function CardUrl({ professional, cardUrl }: CardUrlProps) {
  return (
    <div
      className="text-center border-t border-gray-200"
      style={{ paddingTop: '30px', marginTop: '30px' }}
    >
      <p className="text-gray-400" style={{ fontSize: '20px', marginBottom: '8px' }}>
        View my digital card at
      </p>
      <p
        className="text-glamlink-teal font-medium break-all"
        style={{ fontSize: '24px' }}
      >
        {cardUrl.replace(/^https?:\/\//, '')}
      </p>
    </div>
  );
}
