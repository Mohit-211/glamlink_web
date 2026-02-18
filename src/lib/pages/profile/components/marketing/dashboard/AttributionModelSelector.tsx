/**
 * Attribution Model Selector Component
 *
 * Dropdown for selecting marketing attribution model.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { ATTRIBUTION_MODELS, ATTRIBUTION_WINDOW_DAYS } from '@/lib/features/crm/marketing/constants';
import { AttributionModel } from '@/lib/features/crm/marketing/types';

interface AttributionModelSelectorProps {
  value: AttributionModel;
  onChange: (model: AttributionModel) => void;
}

export function AttributionModelSelector({ value, onChange }: AttributionModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedModel = ATTRIBUTION_MODELS.find(m => m.id === value);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span>{selectedModel?.name || 'Attribution model'}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="font-medium text-gray-900">Attribution model</h3>
          </div>

          <div className="py-1">
            {ATTRIBUTION_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onChange(model.id as AttributionModel);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-50
                  ${value === model.id ? 'bg-pink-50' : ''}
                `}
              >
                <div className="flex items-start space-x-3">
                  {/* Visual indicator */}
                  <div className="mt-1 flex space-x-0.5">
                    {model.id === 'linear' ? (
                      [...Array(4)].map((_, i) => (
                        <div key={i} className="w-1 h-4 bg-gray-300 rounded" />
                      ))
                    ) : model.id === 'first_click' ? (
                      <>
                        <div className="w-1 h-4 bg-pink-500 rounded" />
                        <div className="w-1 h-3 bg-gray-200 rounded" />
                        <div className="w-1 h-2 bg-gray-200 rounded" />
                      </>
                    ) : model.id === 'last_click' || model.id === 'last_non_direct_click' ? (
                      <>
                        <div className="w-1 h-2 bg-gray-200 rounded" />
                        <div className="w-1 h-3 bg-gray-200 rounded" />
                        <div className="w-1 h-4 bg-pink-500 rounded" />
                      </>
                    ) : (
                      [...Array(3)].map((_, i) => (
                        <div key={i} className="w-1 h-4 bg-pink-500 rounded" />
                      ))
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{model.name}</span>
                      {model.isDefault && (
                        <span className="text-xs text-gray-500">(default)</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{model.description}</p>
                  </div>

                  {value === model.id && (
                    <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="px-4 py-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              A {ATTRIBUTION_WINDOW_DAYS}-day attribution window applies.{' '}
              <a href="#" className="text-pink-600 hover:underline">Learn more</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
