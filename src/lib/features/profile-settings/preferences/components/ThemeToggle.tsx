"use client";

/**
 * Theme Toggle Component
 * Three-button toggle for light/dark/system theme selection
 */

import { Sun, Moon, Monitor } from 'lucide-react';
import type { ThemeMode } from '../types';
import { THEME_OPTIONS } from '../config';

interface ThemeToggleProps {
  value: ThemeMode;
  onChange: (theme: ThemeMode) => void;
}

export default function ThemeToggle({ value, onChange }: ThemeToggleProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
      <div className="flex gap-2">
        {THEME_OPTIONS.map(option => {
          const Icon = option.icon === 'Sun' ? Sun : option.icon === 'Moon' ? Moon : Monitor;
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors flex-1 justify-center
                ${isActive
                  ? 'border-glamlink-teal bg-glamlink-teal/10 text-glamlink-teal'
                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
