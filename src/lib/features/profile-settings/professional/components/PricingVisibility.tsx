"use client";

/**
 * PricingVisibility - Service pricing display settings
 */

import { useState } from "react";
import { DollarSign } from "lucide-react";
import { useProfessional } from "../hooks/useProfessional";
import { PRICING_DISPLAY_OPTIONS } from "../config";
import type { PricingDisplay, PricingSettings } from "../types";

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

export default function PricingVisibility() {
  const { settings, isSaving, updatePricingSettings } = useProfessional();
  const [customMessage, setCustomMessage] = useState(
    settings.pricing.customPriceMessage || 'Contact for custom pricing'
  );

  const handleDisplayChange = async (display: PricingDisplay) => {
    try {
      await updatePricingSettings({ display });
    } catch (err) {
      console.error('Failed to update pricing display:', err);
    }
  };

  const handleToggle = async (field: keyof PricingSettings, value: boolean) => {
    try {
      await updatePricingSettings({ [field]: value });
    } catch (err) {
      console.error('Failed to update pricing setting:', err);
    }
  };

  const handleMessageBlur = async () => {
    if (customMessage !== settings.pricing.customPriceMessage) {
      try {
        await updatePricingSettings({ customPriceMessage: customMessage });
      } catch (err) {
        console.error('Failed to update custom message:', err);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="w-5 h-5 text-glamlink-teal" />
        <h3 className="text-lg font-semibold text-gray-900">Pricing Visibility</h3>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Control how pricing appears on your profile
      </p>

      {/* Pricing Display Mode Selector */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-900 mb-3 block">
          Pricing Display Mode
        </label>
        <div className="space-y-2">
          {PRICING_DISPLAY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleDisplayChange(option.value)}
              disabled={isSaving}
              className={`w-full flex items-start gap-3 p-4 rounded-lg border-2 transition-colors ${
                settings.pricing.display === option.value
                  ? 'border-glamlink-teal bg-glamlink-teal/5'
                  : 'border-gray-200 hover:border-gray-300'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{option.label}</span>
                  {settings.pricing.display === option.value && (
                    <span className="text-xs font-medium text-glamlink-teal">Selected</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Display Options */}
      <div className="pt-4 border-t border-gray-200 mb-6">
        <label className="text-sm font-medium text-gray-900 mb-3 block">
          Display Options
        </label>
        <div className="space-y-1 divide-y divide-gray-100">
          <ToggleField
            label='Show "Starting at" prices'
            description="Display lowest price with starting at prefix"
            checked={settings.pricing.showStartingAt}
            onChange={(checked) => handleToggle('showStartingAt', checked)}
            disabled={isSaving}
          />

          <ToggleField
            label="Show price range"
            description="Display price ranges for services"
            checked={settings.pricing.showPriceRange}
            onChange={(checked) => handleToggle('showPriceRange', checked)}
            disabled={isSaving}
          />

          <ToggleField
            label="Show service duration"
            description="Display how long services take"
            checked={settings.pricing.showDuration}
            onChange={(checked) => handleToggle('showDuration', checked)}
            disabled={isSaving}
          />

          <ToggleField
            label="Show add-on pricing"
            description="Display optional add-ons and their prices"
            checked={settings.pricing.showAddOns}
            onChange={(checked) => handleToggle('showAddOns', checked)}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Custom Price Message */}
      <div className="pt-4 border-t border-gray-200">
        <label className="text-sm font-medium text-gray-900 mb-2 block">
          Custom Price Message
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Shown when prices are hidden or for consultation services
        </p>
        <input
          type="text"
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          onBlur={handleMessageBlur}
          disabled={isSaving}
          placeholder="Contact for custom pricing"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
