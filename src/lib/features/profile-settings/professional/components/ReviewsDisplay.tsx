"use client";

/**
 * ReviewsDisplay - Reviews section configuration
 */

import { Star, AlertTriangle } from "lucide-react";
import { useProfessional } from "../hooks/useProfessional";
import { REVIEW_VISIBILITY_OPTIONS } from "../config";
import type { ReviewVisibility, ReviewSettings } from "../types";

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

export default function ReviewsDisplay() {
  const { settings, isSaving, updateReviewSettings } = useProfessional();

  const handleVisibilityChange = async (visibility: ReviewVisibility) => {
    try {
      await updateReviewSettings({ visibility });
    } catch (err) {
      console.error('Failed to update review visibility:', err);
    }
  };

  const handleToggle = async (field: keyof ReviewSettings, value: boolean) => {
    try {
      await updateReviewSettings({ [field]: value });
    } catch (err) {
      console.error('Failed to update review setting:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Star className="w-5 h-5 text-glamlink-teal" />
        <h3 className="text-lg font-semibold text-gray-900">Reviews Display</h3>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Configure your reviews section
      </p>

      {/* Reviews Visibility Selector */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-900 mb-3 block">
          Reviews Visibility
        </label>
        <div className="space-y-2">
          {REVIEW_VISIBILITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleVisibilityChange(option.value)}
              disabled={isSaving}
              className={`w-full flex items-start gap-3 p-4 rounded-lg border-2 transition-colors ${
                settings.reviews.visibility === option.value
                  ? 'border-glamlink-teal bg-glamlink-teal/5'
                  : 'border-gray-200 hover:border-gray-300'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{option.label}</span>
                  {settings.reviews.visibility === option.value && (
                    <span className="text-xs font-medium text-glamlink-teal">Selected</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                {option.warning && (
                  <div className="flex items-center gap-1.5 mt-2 text-amber-600">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs font-medium">{option.warning}</span>
                  </div>
                )}
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
            label="Show star rating"
            description="Display overall star rating"
            checked={settings.reviews.showRating}
            onChange={(checked) => handleToggle('showRating', checked)}
            disabled={isSaving}
          />

          <ToggleField
            label="Show review count"
            description="Display total number of reviews"
            checked={settings.reviews.showReviewCount}
            onChange={(checked) => handleToggle('showReviewCount', checked)}
            disabled={isSaving}
          />

          <ToggleField
            label="Show reviewer name"
            description="Display who wrote each review"
            checked={settings.reviews.showReviewerName}
            onChange={(checked) => handleToggle('showReviewerName', checked)}
            disabled={isSaving}
          />

          <ToggleField
            label="Show review date"
            description="Display when reviews were posted"
            checked={settings.reviews.showReviewDate}
            onChange={(checked) => handleToggle('showReviewDate', checked)}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Review Management */}
      <div className="pt-4 border-t border-gray-200">
        <label className="text-sm font-medium text-gray-900 mb-3 block">
          Review Management
        </label>
        <div className="space-y-1 divide-y divide-gray-100">
          <ToggleField
            label="Allow responding to reviews"
            description="Let you reply to customer reviews"
            checked={settings.reviews.allowResponses}
            onChange={(checked) => handleToggle('allowResponses', checked)}
            disabled={isSaving}
          />

          <ToggleField
            label="Auto-publish reviews"
            description="New reviews appear immediately (off = require approval)"
            checked={settings.reviews.autoPublish}
            onChange={(checked) => handleToggle('autoPublish', checked)}
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
