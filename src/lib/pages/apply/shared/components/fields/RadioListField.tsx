"use client";

import { BaseFieldProps } from './index';

export default function RadioListField({
  fieldKey,
  config,
  value,
  onChange,
  error,
  disabled
}: BaseFieldProps) {
  const selectedValue = value || config.defaultValue || '';

  const handleRadioChange = (optionValue: string) => {
    onChange(fieldKey, optionValue);
  };

  return (
    <div className="transition-all duration-200">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          {config.label}
          {config.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="space-y-3">
          {config.options?.map((option: any) => (
            <div key={option.id || option.value} className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={option.id || option.value}
                  type="radio"
                  name={fieldKey}
                  value={option.id || option.value}
                  checked={selectedValue === (option.id || option.value)}
                  onChange={() => handleRadioChange(option.id || option.value)}
                  disabled={disabled}
                  className="h-4 w-4 border-gray-300 text-glamlink-teal focus:ring-glamlink-teal disabled:opacity-50"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor={option.id || option.value}
                  className="font-medium text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {option.label}
                </label>
              </div>
            </div>
          ))}
        </div>

        {config.description && (
          <p className="text-sm text-gray-500">{config.description}</p>
        )}

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}