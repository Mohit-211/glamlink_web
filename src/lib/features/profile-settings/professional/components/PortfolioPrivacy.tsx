"use client";

/**
 * PortfolioPrivacy - Portfolio/gallery privacy settings
 */

import { Image, Lock, Globe, Users } from "lucide-react";
import { useProfessional } from "../hooks/useProfessional";
import { PORTFOLIO_ACCESS_OPTIONS } from "../config";
import type { PortfolioAccess, PortfolioSettings } from "../types";

interface ToggleFieldProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleField({ label, description, checked, onChange, disabled }: ToggleFieldProps) {
  return (
    <div className="flex items-start justify-between py-3">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-900">{label}</label>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:ring-offset-2 ${
          checked ? 'bg-glamlink-teal' : 'bg-gray-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

const ACCESS_ICONS = {
  public: Globe,
  clients_only: Users,
  private: Lock,
};

export default function PortfolioPrivacy() {
  const { settings, isSaving, updatePortfolioSettings } = useProfessional();

  const handleAccessChange = async (access: PortfolioAccess) => {
    try {
      await updatePortfolioSettings({ access });
    } catch (err) {
      console.error('Failed to update portfolio access:', err);
    }
  };

  const handleToggle = async (field: keyof PortfolioSettings, value: boolean) => {
    try {
      await updatePortfolioSettings({ [field]: value });
    } catch (err) {
      console.error('Failed to update portfolio setting:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Image className="w-5 h-5 text-glamlink-teal" />
        <h3 className="text-lg font-semibold text-gray-900">Portfolio Privacy</h3>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Control who can view your work
      </p>

      {/* Access Level Selector */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-900 mb-3 block">
          Who can view your portfolio?
        </label>
        <div className="space-y-2">
          {PORTFOLIO_ACCESS_OPTIONS.map((option) => {
            const Icon = ACCESS_ICONS[option.value];
            return (
              <button
                key={option.value}
                onClick={() => handleAccessChange(option.value)}
                disabled={isSaving}
                className={`w-full flex items-start gap-3 p-4 rounded-lg border-2 transition-colors ${
                  settings.portfolio.access === option.value
                    ? 'border-glamlink-teal bg-glamlink-teal/5'
                    : 'border-gray-200 hover:border-gray-300'
                } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <Icon className={`w-5 h-5 mt-0.5 ${
                  settings.portfolio.access === option.value
                    ? 'text-glamlink-teal'
                    : 'text-gray-400'
                }`} />
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{option.label}</span>
                    {settings.portfolio.access === option.value && (
                      <span className="text-xs font-medium text-glamlink-teal">Selected</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Display Options */}
      <div className="pt-4 border-t border-gray-200">
        <label className="text-sm font-medium text-gray-900 mb-3 block">
          Display Options
        </label>
        <div className="space-y-1 divide-y divide-gray-100">
          <ToggleField
            label="Show before/after comparisons"
            description="Display transformation photos side by side"
            checked={settings.portfolio.showBeforeAfter}
            onChange={(checked) => handleToggle('showBeforeAfter', checked)}
            disabled={isSaving}
          />

          <ToggleField
            label="Add watermark to images"
            description="Protect your work with a watermark"
            checked={settings.portfolio.watermarkImages}
            onChange={(checked) => handleToggle('watermarkImages', checked)}
            disabled={isSaving}
          />

          <ToggleField
            label="Allow image downloads"
            description="Let viewers download portfolio images"
            checked={settings.portfolio.allowDownload}
            onChange={(checked) => handleToggle('allowDownload', checked)}
            disabled={isSaving}
          />

          <ToggleField
            label="Show client testimonials"
            description="Display client feedback on portfolio items"
            checked={settings.portfolio.showClientTestimonials}
            onChange={(checked) => handleToggle('showClientTestimonials', checked)}
            disabled={isSaving}
          />

          <ToggleField
            label="Require client consent for public"
            description="Only show work with explicit client consent"
            checked={settings.portfolio.requireConsentForPublic}
            onChange={(checked) => handleToggle('requireConsentForPublic', checked)}
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
