'use client';

import React from 'react';
import { useTabContainer } from './useTabContainer';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

export interface CustomTab {
  id: string;
  label: string;
  fields: FieldConfig[];
  icon?: React.ComponentType<{ className?: string }>;
}

interface TabsContainerProps {
  customTabs?: CustomTab[];
  showTabs: boolean;
  defaultTab?: string;
  allFields: FieldConfig[];
  onTabChange?: (tabId: string) => void;
  children: (activeFields: FieldConfig[], activeSubTab: 'default' | 'form' | 'preview' | 'json') => React.ReactNode;
}

/**
 * TabsContainer - Manages two-level tab hierarchy for FormModal
 *
 * Key features:
 * - Custom tabs (e.g., "Basic Info", "Cover Config") at top level
 * - 4 subtabs: Default, Form, Preview, JSON
 * - Field filtering based on active custom tab
 * - Render prop pattern for content
 * - Backward compatible (works without custom tabs)
 */
export default function TabsContainer({
  customTabs,
  showTabs,
  defaultTab = 'default',
  allFields,
  onTabChange,
  children,
}: TabsContainerProps) {
  const {
    activeCustomTab,
    activeSubTab,
    activeFields,
    handleCustomTabClick,
    handleSubTabClick,
  } = useTabContainer({
    customTabs,
    defaultTab,
    allFields,
    onTabChange,
  });

  return (
    <>
      {/* Custom tabs row (if provided) */}
      {customTabs && customTabs.length > 0 && (
        <div className="flex border-b border-gray-200 px-6 bg-gray-50">
          {customTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleCustomTabClick(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2 ${
                activeCustomTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Subtabs (if tabs enabled) */}
      {showTabs && (
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => handleSubTabClick('default')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeSubTab === 'default'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Default
          </button>
          <button
            onClick={() => handleSubTabClick('form')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeSubTab === 'form'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Form
          </button>
          <button
            onClick={() => handleSubTabClick('preview')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeSubTab === 'preview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => handleSubTabClick('json')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeSubTab === 'json'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            JSON
          </button>
        </div>
      )}

      {/* Render children with active fields and tab info */}
      {children(activeFields, activeSubTab)}
    </>
  );
}
