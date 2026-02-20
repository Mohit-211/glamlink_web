/**
 * ConditionNode Component
 *
 * Displays condition configuration in workflow builder with branching logic
 */

'use client';

import { AutomationCondition } from '@/lib/features/crm/marketing/types';

interface ConditionNodeProps {
  condition: AutomationCondition;
  onChange: (updates: Partial<AutomationCondition>) => void;
  onDelete: () => void;
  readOnly?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function ConditionNode({ condition, onChange, onDelete, readOnly, isSelected, onSelect }: ConditionNodeProps) {
  return (
    <div
      onClick={onSelect}
      className={`
        bg-white rounded-xl border-2 p-4 w-80 cursor-pointer transition-all
        ${isSelected ? 'border-pink-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 uppercase font-medium mb-1">Condition</div>
          <div className="font-medium text-gray-900 text-sm">
            {condition.field || 'Select condition'}
          </div>
          <div className="flex items-center space-x-4 mt-2 text-xs">
            <span className="flex items-center text-green-600">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              True
            </span>
            <span className="flex items-center text-red-600">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              False
            </span>
          </div>
        </div>
        {!readOnly && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 text-gray-400 hover:text-red-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default ConditionNode;
