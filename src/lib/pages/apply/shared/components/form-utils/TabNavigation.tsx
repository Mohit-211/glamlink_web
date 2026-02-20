"use client";

import { Tab } from '@headlessui/react';
import { Check } from 'lucide-react';

interface TabNavigationProps {
  tabs: Array<{
    id: string;
    label: string;
    completed: boolean;
    disabled?: boolean;
  }>;
  selectedIndex: number;
  onChange: (index: number) => void;
}

export default function TabNavigation({
  tabs,
  selectedIndex,
  onChange
}: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200">
      <Tab.Group selectedIndex={selectedIndex} onChange={onChange}>
        <Tab.List className="flex space-x-8 px-4">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.id}
              disabled={tab.disabled}
              className={({ selected }) => {
                const baseClasses = `
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${tab.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : selected
                      ? 'border-glamlink-teal text-glamlink-teal'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `;
                return baseClasses;
              }}
            >
              {({ selected }) => (
                <>
                  {/* Checkmark indicator */}
                  <div className={`
                    flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors
                    ${tab.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : selected
                        ? 'border-glamlink-teal text-glamlink-teal'
                        : 'border-gray-300 text-gray-400'
                    }
                  `}>
                    {tab.completed ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>

                  {/* Tab label */}
                  <span className="font-medium">
                    {tab.label}
                  </span>

                  {/* Completion status for completed tabs */}
                  {tab.completed && !selected && (
                    <span className="text-xs text-green-600 font-medium">
                      Completed
                    </span>
                  )}
                </>
              )}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  );
}