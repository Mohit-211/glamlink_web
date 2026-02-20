/**
 * Date Range Picker Component
 *
 * Allows selecting date ranges from presets or custom dates.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { DATE_RANGE_PRESETS } from '@/lib/features/crm/marketing/constants';
import { getDateRange } from '@/lib/features/crm/marketing/utils';

interface DateRange {
  start: string;
  end: string;
  preset?: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState(value.start);
  const [customEnd, setCustomEnd] = useState(value.end);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePresetSelect = (presetId: string) => {
    const range = getDateRange(presetId);
    onChange(range);
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    onChange({ start: customStart, end: customEnd, preset: 'custom' });
    setIsOpen(false);
  };

  const displayLabel = value.preset
    ? DATE_RANGE_PRESETS.find(p => p.id === value.preset)?.label || 'Custom'
    : `${formatDisplayDate(value.start)} - ${formatDisplayDate(value.end)}`;

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{displayLabel}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-[600px] bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="flex">
            {/* Presets Column */}
            <div className="w-48 border-r border-gray-200 py-2">
              {DATE_RANGE_PRESETS.filter(p => p.id !== 'custom').map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`
                    w-full px-4 py-2 text-left text-sm hover:bg-gray-50
                    ${value.preset === preset.id ? 'bg-pink-50 text-pink-700' : 'text-gray-700'}
                  `}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Calendar Column */}
            <div className="flex-1 p-4">
              <div className="flex space-x-4">
                {/* Start Date Input */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Start</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>

                {/* End Date Input */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">End</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomApply}
                  className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDisplayDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
