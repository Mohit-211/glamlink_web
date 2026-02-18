'use client';

import React from 'react';
import type { EditorTab } from '../usePageCreator';

// =============================================================================
// PROPS INTERFACE
// =============================================================================

interface TabNavigationProps {
  activeTab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
}

// =============================================================================
// TAB CONFIGURATION
// =============================================================================

const TABS: { id: EditorTab; label: string; activeColor: string }[] = [
  { id: 'form', label: 'Form Editor', activeColor: 'indigo' },
  { id: 'json', label: 'JSON Editor', activeColor: 'indigo' },
  { id: 'canvas', label: 'Canvas Editor', activeColor: 'green' },
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="flex-shrink-0 border-b border-gray-200 mb-4">
      <nav className="flex -mb-px">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const colorClasses = isActive
            ? tab.activeColor === 'green'
              ? 'border-green-500 text-green-600'
              : 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`
                py-2 px-4 text-sm font-medium border-b-2 transition-colors
                ${colorClasses}
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
