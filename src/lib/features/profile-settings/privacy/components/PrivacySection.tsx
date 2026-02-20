"use client";

import { Shield, AlertCircle } from "lucide-react";
import { PRIVACY_CATEGORIES } from "../config";
import PrivacyToggle from "./PrivacyToggle";
import VisibilitySelector from "./VisibilitySelector";
import type { UsePrivacyReturn } from "../types";

interface PrivacySectionProps extends UsePrivacyReturn {}

export default function PrivacySection({
  settings,
  isLoading,
  isSaving,
  error,
  updateSetting,
}: PrivacySectionProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" />
            Privacy Settings
          </h2>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading privacy settings...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-gray-400" />
          Privacy Settings
        </h2>
        <p className="text-sm text-gray-500 mt-1">Control who can see your information</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Privacy Categories */}
        {PRIVACY_CATEGORIES.map((category, categoryIndex) => (
          <div key={category.id}>
            {categoryIndex > 0 && <div className="border-t border-gray-200 -mx-6 mb-6" />}

            <div className="mb-4">
              <h3 className="text-base font-medium text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{category.description}</p>
            </div>

            <div className="space-y-1 divide-y divide-gray-100">
              {category.settings.map((setting) => {
                if (setting.type === 'select' && setting.id === 'profileVisibility') {
                  return (
                    <div key={setting.id} className="pt-4 first:pt-0">
                      <label className="text-sm font-medium text-gray-900 block mb-1">
                        {setting.label}
                      </label>
                      <p className="text-sm text-gray-500 mb-3">{setting.description}</p>
                      <VisibilitySelector
                        value={settings.profileVisibility}
                        onChange={(value) => updateSetting('profileVisibility', value)}
                        disabled={isSaving}
                      />
                    </div>
                  );
                }

                if (setting.type === 'toggle') {
                  return (
                    <PrivacyToggle
                      key={setting.id}
                      label={setting.label}
                      description={setting.description}
                      checked={settings[setting.id] as boolean}
                      onChange={(checked) => updateSetting(setting.id, checked as any)}
                      disabled={isSaving}
                      warning={setting.warning}
                    />
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
