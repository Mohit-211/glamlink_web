"use client";

/**
 * Preferences Section Component
 * Main UI component for user preferences management
 */

import { Palette } from 'lucide-react';
import { usePreferences } from '../hooks/usePreferences';
import { usePreferencesContext } from '../context/PreferencesContext';
import ThemeToggle from './ThemeToggle';
import {
  LANGUAGES,
  CURRENCIES,
  TIMEZONE_GROUPS,
  DATE_FORMAT_OPTIONS,
  TIME_FORMAT_OPTIONS
} from '../config';

export default function PreferencesSection() {
  const { updateTheme } = usePreferencesContext();
  const {
    preferencesForm,
    isLoading,
    isSaving,
    error,
    success,
    hasChanges,
    handleChange,
    handleSave,
    handleCancel,
    handleReset
  } = usePreferences();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glamlink-teal"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-200">
        <Palette className="w-5 h-5 text-glamlink-teal" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
          <p className="text-sm text-gray-500">Customize your experience</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Success/Error Messages */}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <p className="text-sm text-green-700">Preferences saved successfully</p>
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <span className="text-red-600 font-bold">✕</span>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Appearance Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Appearance</h3>
          <div className="space-y-4">
            <ThemeToggle
              value={preferencesForm.theme}
              onChange={updateTheme}
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preferencesForm.reducedMotion}
                onChange={(e) => handleChange('reducedMotion', e.target.checked)}
                className="w-4 h-4 text-glamlink-teal border-gray-300 rounded focus:ring-glamlink-teal"
              />
              <span className="text-sm text-gray-700">Reduce animations</span>
            </label>
          </div>
        </div>

        {/* Regional Settings Section */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Regional Settings</h3>
          <div className="space-y-4">
            {/* Language Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={preferencesForm.language}
                onChange={(e) => handleChange('language', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-glamlink-teal focus:border-transparent"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Currently English only</p>
            </div>

            {/* Timezone Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                value={preferencesForm.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-glamlink-teal focus:border-transparent"
              >
                {TIMEZONE_GROUPS.map(group => (
                  <optgroup key={group.label} label={group.label}>
                    {group.timezones.map(tz => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label} ({tz.offset})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Currency Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={preferencesForm.currency}
                onChange={(e) => handleChange('currency', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-glamlink-teal focus:border-transparent"
              >
                {CURRENCIES.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.code} - {curr.symbol}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Display only, not conversion</p>
            </div>
          </div>
        </div>

        {/* Display Format Section */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Display Format</h3>
          <div className="space-y-4">
            {/* Date Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date format</label>
              <div className="space-y-2">
                {DATE_FORMAT_OPTIONS.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={preferencesForm.dateFormat === opt.value}
                      onChange={() => handleChange('dateFormat', opt.value)}
                      className="w-4 h-4 text-glamlink-teal border-gray-300 focus:ring-glamlink-teal"
                    />
                    <span className="text-sm text-gray-700">{opt.label} <span className="text-gray-500">({opt.example})</span></span>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time format</label>
              <div className="space-y-2">
                {TIME_FORMAT_OPTIONS.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={preferencesForm.timeFormat === opt.value}
                      onChange={() => handleChange('timeFormat', opt.value)}
                      className="w-4 h-4 text-glamlink-teal border-gray-300 focus:ring-glamlink-teal"
                    />
                    <span className="text-sm text-gray-700">{opt.label} <span className="text-gray-500">({opt.example})</span></span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {hasChanges && (
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-glamlink-teal text-white rounded-lg hover:bg-glamlink-teal/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Reset Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={handleReset}
            disabled={isSaving}
            className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
