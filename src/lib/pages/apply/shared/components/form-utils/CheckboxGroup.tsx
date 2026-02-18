"use client";

import { useState } from "react";

interface CheckboxOption {
  id: string;
  label: string;
  description?: string;
}

interface CheckboxGroupProps {
  label: string;
  options: CheckboxOption[];
  selectedValues: string[] | boolean;
  onChange: (values: string[] | boolean) => void;
  required?: boolean;
  helperText?: string;
}

export default function CheckboxGroup({
  label,
  options,
  selectedValues,
  onChange,
  required = false,
  helperText
}: CheckboxGroupProps) {
  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    // Single checkbox mode - return boolean
    if (options.length === 1) {
      onChange(checked);
    } else {
      // Multi-checkbox mode - return array
      const valuesArray = Array.isArray(selectedValues) ? selectedValues : [];
      if (checked) {
        onChange([...valuesArray, optionId]);
      } else {
        onChange(valuesArray.filter(value => value !== optionId));
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="space-y-3">
        {options.map((option) => (
          <div
            key={option.id}
            className="relative flex items-start"
          >
            <div className="flex items-center h-5">
              <input
                id={option.id}
                name={option.id}
                type="checkbox"
                checked={options.length === 1 ? Boolean(selectedValues) : Array.isArray(selectedValues) && selectedValues.includes(option.id)}
                onChange={(e) => handleCheckboxChange(option.id, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-glamlink-teal focus:ring-glamlink-teal"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor={option.id}
                className="font-medium text-gray-700 cursor-pointer"
              >
                {option.label}
              </label>
              {option.description && (
                <p className="text-gray-500">{option.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}