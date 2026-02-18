"use client";

import { useState } from "react";

interface BulletPointArrayProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
  placeholder?: string;
  maxPoints?: number;
  helperText?: string;
}

export default function BulletPointArray({
  label,
  value,
  onChange,
  required = false,
  placeholder = "Enter a bullet point",
  maxPoints = 5,
  helperText
}: BulletPointArrayProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handlePointChange = (index: number, newValue: string) => {
    const newPoints = [...value];
    newPoints[index] = newValue;
    onChange(newPoints);
  };

  const addPoint = () => {
    if (value.length < maxPoints) {
      onChange([...value, ""]);
      setFocusedIndex(value.length);
    }
  };

  const removePoint = (index: number) => {
    const newPoints = value.filter((_, i) => i !== index);
    onChange(newPoints);
    if (focusedIndex === index) {
      setFocusedIndex(null);
    } else if (focusedIndex !== null && focusedIndex > index) {
      setFocusedIndex(focusedIndex - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index === value.length - 1 && value.length < maxPoints) {
        addPoint();
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="space-y-2">
        {value.map((point, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-shrink-0 w-6 h-6 bg-glamlink-teal/10 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-glamlink-teal">
                {index + 1}
              </span>
            </div>
            <input
              type="text"
              value={point}
              onChange={(e) => handlePointChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setFocusedIndex(index)}
              placeholder={placeholder}
              className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-glamlink-teal focus:ring-glamlink-teal sm:text-sm"
            />
            {value.length > 1 && (
              <button
                type="button"
                onClick={() => removePoint(index)}
                className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}

        {value.length < maxPoints && (
          <button
            type="button"
            onClick={addPoint}
            className="flex items-center space-x-2 text-sm text-glamlink-teal hover:text-glamlink-teal-dark transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Add bullet point</span>
          </button>
        )}
      </div>

      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}