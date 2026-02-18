"use client";

import { Lock } from "lucide-react";

interface NotificationToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
}

export default function NotificationToggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  required = false,
}: NotificationToggleProps) {
  const isDisabled = disabled || required;

  return (
    <div className="flex items-start justify-between py-4">
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-900">{label}</label>
          {required && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              <Lock className="w-3 h-3" />
              Required
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={isDisabled}
        onClick={() => !isDisabled && onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:ring-offset-2
          ${checked ? 'bg-glamlink-teal' : 'bg-gray-200'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
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
