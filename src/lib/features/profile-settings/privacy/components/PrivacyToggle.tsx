"use client";

import { AlertCircle } from "lucide-react";

interface PrivacyToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  warning?: string;
}

export default function PrivacyToggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  warning,
}: PrivacyToggleProps) {
  return (
    <div className="flex items-start justify-between py-4">
      <div className="flex-1 pr-4">
        <label className="text-sm font-medium text-gray-900">{label}</label>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        {warning && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{warning}</span>
          </div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:ring-offset-2
          ${checked ? 'bg-glamlink-teal' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
            transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
}
