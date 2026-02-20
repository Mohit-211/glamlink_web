"use client";

import { BaseFieldProps } from './index';

interface SelectFieldProps extends BaseFieldProps {
  options?: Array<{
    id: string;
    label: string;
  }>;
}

export default function SelectField({
  fieldKey,
  config,
  value,
  onChange,
  error,
  disabled,
  options = []
}: SelectFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(fieldKey, e.target.value);
  };

  return (
    <div className="transition-all duration-200">
      <label className="block text-sm font-medium text-gray-700">
        {config.label}
        {config.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {config.description && (
        <p className="mt-1 text-sm text-gray-500">{config.description}</p>
      )}

      <div className="mt-3">
        <select
          value={value || config.defaultValue || ''}
          onChange={handleChange}
          disabled={disabled}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors
            border-gray-300 focus:ring-glamlink-teal focus:border-glamlink-teal
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {config.helperText && (
        <p className="mt-1 text-sm text-gray-500">{config.helperText}</p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}