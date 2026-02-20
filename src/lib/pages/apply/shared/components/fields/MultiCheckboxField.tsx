"use client";

import { BaseFieldProps } from './index';

interface MultiCheckboxFieldProps extends BaseFieldProps {
  options: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
  minSelections?: number;
  maxSelections?: number;
  columns?: 1 | 2;
}

export default function MultiCheckboxField({
  fieldKey,
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  disabled,
  options = [],
  minSelections,
  maxSelections,
  columns = 1
}: MultiCheckboxFieldProps) {
  const selectedValues = Array.isArray(value) ? value : [];
  const currentSelections = selectedValues.length;

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    let newSelectedValues: string[];

    if (checked) {
      // Check max selections limit
      if (maxSelections && currentSelections >= maxSelections) {
        return;
      }
      newSelectedValues = [...selectedValues, optionValue];
    } else {
      // Allow deselecting options (remove min selections constraint)
      newSelectedValues = selectedValues.filter(val => val !== optionValue);
    }

    onChange(fieldKey, newSelectedValues);
  };

  const gridClass = columns === 2 ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3';

  const getSelectionWarning = () => {
    if (maxSelections && currentSelections > maxSelections) {
      return `Maximum ${maxSelections} selection${maxSelections > 1 ? 's' : ''} allowed`;
    }
    if (minSelections && currentSelections < minSelections) {
      return `Minimum ${minSelections} selection${minSelections > 1 ? 's' : ''} required`;
    }
    return null;
  };

  const selectionWarning = getSelectionWarning();

  return (
    <div className="transition-all duration-200">
      <label className="block text-sm font-medium text-gray-700">
        {config.label}
        {config.required && <span className="text-red-500 ml-1">*</span>}
        {minSelections && (
          <span className="text-gray-500 text-xs ml-1">
            (Select at least {minSelections})
          </span>
        )}
      </label>

      {config.description && (
        <p className="mt-1 text-sm text-gray-500">{config.description}</p>
      )}

      <div className={`mt-3 ${gridClass}`}>
        {options.map((option) => (
          <div key={option.id} className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id={`${fieldKey}-${option.id}`}
                type="checkbox"
                checked={selectedValues.includes(option.id)}
                onChange={(e) => handleCheckboxChange(option.id, e.target.checked)}
                disabled={disabled}
                className={`h-4 w-4 rounded border-gray-300 text-glamlink-teal focus:ring-glamlink-teal disabled:opacity-50 transition-colors duration-200 ${
                  error ? 'border-red-300 focus:ring-red-500' : ''
                } ${
                  selectionWarning && !selectedValues.includes(option.id) ? 'opacity-50' : ''
                }`}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor={`${fieldKey}-${option.id}`}
                className={`font-medium text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${
                  error ? 'text-red-700' : ''
                } ${
                  selectionWarning && !selectedValues.includes(option.id) ? 'opacity-50' : ''
                }`}
              >
                {option.label}
              </label>
              {option.description && (
                <p className="text-gray-500 mt-1">{option.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectionWarning && (
        <p className="mt-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
          {selectionWarning}
        </p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}