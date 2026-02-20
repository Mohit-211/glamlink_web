'use client';

/**
 * DisplayFilters - Unified filter controls component
 *
 * A flexible, reusable filter component that can be configured to show:
 * - Search input
 * - Select dropdowns (multiple)
 * - Checkbox toggles (multiple)
 * - Stats badges (multiple)
 * - Action buttons (multiple)
 */

import React from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface SelectFilterConfig {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;  // e.g., "All Statuses"
}

export interface CheckboxFilterConfig {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export interface StatBadgeConfig {
  id: string;
  count: number;
  label: string;
  color: 'teal' | 'green' | 'yellow' | 'red' | 'blue' | 'indigo' | 'purple' | 'pink' | 'gray';
  showWhenZero?: boolean;
}

export interface ActionButtonConfig {
  id: string;
  label: string;
  loadingLabel?: string;
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  show?: boolean;
}

export interface DisplayFiltersProps {
  // Search
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;

  // Select filters
  selectFilters?: SelectFilterConfig[];

  // Checkbox toggles
  checkboxFilters?: CheckboxFilterConfig[];

  // Stats badges
  statBadges?: StatBadgeConfig[];

  // Action buttons
  actionButtons?: ActionButtonConfig[];

  // Styling
  accentColor?: 'teal' | 'indigo' | 'blue' | 'purple';
}

// =============================================================================
// COLOR MAPS
// =============================================================================

const BADGE_COLORS: Record<StatBadgeConfig['color'], { bg: string; text: string }> = {
  teal: { bg: 'bg-teal-100', text: 'text-teal-800' },
  green: { bg: 'bg-green-100', text: 'text-green-800' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  red: { bg: 'bg-red-100', text: 'text-red-800' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-800' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-800' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600' }
};

const ACCENT_COLORS: Record<string, { ring: string; checkbox: string; button: string; buttonHover: string }> = {
  teal: { ring: 'focus:ring-teal-500', checkbox: 'text-teal-600 focus:ring-teal-500', button: 'bg-teal-600', buttonHover: 'hover:bg-teal-700' },
  indigo: { ring: 'focus:ring-indigo-500', checkbox: 'text-indigo-600 focus:ring-indigo-500', button: 'bg-indigo-600', buttonHover: 'hover:bg-indigo-700' },
  blue: { ring: 'focus:ring-blue-500', checkbox: 'text-blue-600 focus:ring-blue-500', button: 'bg-blue-600', buttonHover: 'hover:bg-blue-700' },
  purple: { ring: 'focus:ring-purple-500', checkbox: 'text-purple-600 focus:ring-purple-500', button: 'bg-purple-600', buttonHover: 'hover:bg-purple-700' }
};

const BUTTON_VARIANTS: Record<string, { base: string; hover: string }> = {
  primary: { base: 'bg-indigo-600 text-white', hover: 'hover:bg-indigo-700' },
  secondary: { base: 'bg-gray-100 text-gray-700 border border-gray-300', hover: 'hover:bg-gray-200' },
  danger: { base: 'bg-red-600 text-white', hover: 'hover:bg-red-700' }
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function DisplayFilters({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  selectFilters = [],
  checkboxFilters = [],
  statBadges = [],
  actionButtons = [],
  accentColor = 'indigo'
}: DisplayFiltersProps) {
  const accent = ACCENT_COLORS[accentColor];

  return (
    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Input */}
        {onSearchChange && (
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 ${accent.ring} focus:border-transparent`}
            />
          </div>
        )}

        {/* Select Filters */}
        {selectFilters.map((filter) => (
          <select
            key={filter.id}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className={`px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 ${accent.ring}`}
          >
            {filter.placeholder && (
              <option value="all">{filter.placeholder}</option>
            )}
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {/* Checkbox Toggles */}
        {checkboxFilters.map((filter) => (
          <label
            key={filter.id}
            className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={filter.checked}
              onChange={(e) => filter.onChange(e.target.checked)}
              className={`rounded border-gray-300 ${accent.checkbox}`}
            />
            {filter.label}
          </label>
        ))}

        {/* Stats Badges */}
        {statBadges.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {statBadges.map((badge) => {
              if (badge.count === 0 && !badge.showWhenZero) return null;
              const colors = BADGE_COLORS[badge.color];
              return (
                <span
                  key={badge.id}
                  className={`px-2 py-1 ${colors.bg} ${colors.text} rounded-full`}
                >
                  {badge.count} {badge.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        {actionButtons.map((button) => {
          if (button.show === false) return null;
          const variant = BUTTON_VARIANTS[button.variant || 'primary'];
          return (
            <button
              key={button.id}
              onClick={button.onClick}
              disabled={button.disabled || button.isLoading}
              className={`px-3 py-2 text-sm rounded-md ${variant.base} ${variant.hover} disabled:opacity-50 transition-colors`}
            >
              {button.isLoading ? (button.loadingLabel || 'Loading...') : button.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
