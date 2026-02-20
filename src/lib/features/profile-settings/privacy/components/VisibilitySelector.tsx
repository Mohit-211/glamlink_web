"use client";

import { Globe, Lock, Link2 } from "lucide-react";
import type { ProfileVisibility, VisibilityOption } from "../types";
import { VISIBILITY_OPTIONS } from "../config";

interface VisibilitySelectorProps {
  value: ProfileVisibility;
  onChange: (value: ProfileVisibility) => void;
  disabled?: boolean;
}

const ICON_MAP = {
  Globe: Globe,
  Lock: Lock,
  Link: Link2,
};

export default function VisibilitySelector({
  value,
  onChange,
  disabled = false,
}: VisibilitySelectorProps) {
  return (
    <div className="space-y-3">
      {VISIBILITY_OPTIONS.map((option) => {
        const Icon = ICON_MAP[option.icon as keyof typeof ICON_MAP];
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={`
              w-full flex items-start gap-3 p-4 rounded-lg border-2 transition-all
              ${isSelected
                ? 'border-glamlink-teal bg-glamlink-teal/5'
                : 'border-gray-200 hover:border-gray-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <Icon
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isSelected ? 'text-glamlink-teal' : 'text-gray-400'
              }`}
            />
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{option.label}</span>
                {isSelected && (
                  <span className="text-xs font-medium text-glamlink-teal">✓</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{option.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
