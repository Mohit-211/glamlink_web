"use client";

import React from "react";

// =============================================================================
// BULLET LIST DISPLAY COMPONENT
// =============================================================================

export interface BulletListDisplayProps {
  /** Array of items to display as bullets */
  items: string[];
  /** Color of the bullet dot (default: Glamlink teal #22B8C8) */
  bulletColor?: string;
  /** Additional CSS classes for the container */
  className?: string;
  /** Text size class (default: text-base) */
  textSize?: string;
  /** Text color class (default: text-gray-700) */
  textColor?: string;
}

/**
 * BulletListDisplay - Renders a styled bullet list with colored dots
 *
 * Uses Glamlink teal (#22B8C8) for bullet dots by default.
 * Renders as a semantic ul/li structure with custom styling.
 */
export function BulletListDisplay({
  items,
  bulletColor = '#22B8C8',
  className = '',
  textSize = 'text-base',
  textColor = 'text-gray-700',
}: BulletListDisplayProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ul
      className={`bullet-list-display ${className}`}
      style={{ listStyle: 'none', margin: 0, padding: 0 }}
    >
      {items.map((item, index) => (
        <li
          key={index}
          className={`flex items-start ${textColor} ${textSize}`}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            marginTop: index === 0 ? 0 : '8px',
            lineHeight: '1.5',
          }}
        >
          <span
            className="flex-shrink-0"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: bulletColor,
              marginTop: '6px',
            }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default BulletListDisplay;
