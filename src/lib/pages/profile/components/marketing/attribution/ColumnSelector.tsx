/**
 * Column Selector Component
 *
 * Dropdown menu for customizing visible table columns.
 * Features grouped columns with search functionality.
 */

'use client';

import { useRef, useEffect } from 'react';

interface ColumnSelectorProps {
  visibleColumns: string[];
  onChange: (columns: string[]) => void;
  onClose: () => void;
}

const COLUMN_GROUPS = [
  {
    label: 'Referrer',
    columns: [
      { id: 'referringCategory', label: 'Referring category' },
      { id: 'referringUrl', label: 'Referring URL' },
      { id: 'channelType', label: 'Channel', disabled: true },
      { id: 'type', label: 'Type', disabled: true },
    ],
  },
  {
    label: 'Orders',
    columns: [
      { id: 'sales', label: 'Sales' },
      { id: 'orders', label: 'Orders' },
      { id: 'aov', label: 'AOV' },
      { id: 'cost', label: 'Cost' },
      { id: 'roas', label: 'ROAS' },
      { id: 'cpa', label: 'CPA' },
    ],
  },
  {
    label: 'Sessions',
    columns: [
      { id: 'sessions', label: 'Sessions' },
      { id: 'conversionRate', label: 'Conversion rate' },
      { id: 'ctr', label: 'CTR' },
      { id: 'newCustomerOrders', label: 'Orders from new customers' },
      { id: 'returningCustomerOrders', label: 'Orders from returning customers' },
    ],
  },
];

export function ColumnSelector({ visibleColumns, onChange, onClose }: ColumnSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const toggleColumn = (columnId: string) => {
    if (visibleColumns.includes(columnId)) {
      onChange(visibleColumns.filter(c => c !== columnId));
    } else {
      onChange([...visibleColumns, columnId]);
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4">
        <input
          type="search"
          placeholder="Search for columns"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
        />
      </div>

      <div className="max-h-80 overflow-y-auto">
        {COLUMN_GROUPS.map((group) => (
          <div key={group.label} className="px-4 pb-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">{group.label}</h4>
            <div className="space-y-1">
              {group.columns.map((col) => (
                <label
                  key={col.id}
                  className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer ${
                    col.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(col.id) || col.disabled}
                    onChange={() => !col.disabled && toggleColumn(col.id)}
                    disabled={col.disabled}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">{col.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
