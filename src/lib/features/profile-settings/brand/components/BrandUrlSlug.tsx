"use client";

import { useState, useEffect } from "react";
import { Link2, Check, X, AlertTriangle, Copy } from "lucide-react";
import { validateSlug } from "../config";
import type { BrandUrlSettings } from "../types";

interface BrandUrlSlugProps {
  urlSettings: BrandUrlSettings;
  checkSlugAvailability: (slug: string) => Promise<{ available: boolean; suggestion?: string }>;
  updateSlug: (slug: string) => Promise<void>;
  isSaving: boolean;
}

export default function BrandUrlSlug({
  urlSettings,
  checkSlugAvailability,
  updateSlug,
  isSaving,
}: BrandUrlSlugProps) {
  const [slug, setSlug] = useState(urlSettings.slug);
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{ available: boolean; suggestion?: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://glamlink.com'}/brand/${slug}`;
  const hasChanges = slug !== urlSettings.slug;

  // Debounced availability check
  useEffect(() => {
    if (!slug || slug === urlSettings.slug) {
      setAvailability(null);
      setValidationError(null);
      return;
    }

    const validation = validateSlug(slug);
    if (!validation.valid) {
      setValidationError(validation.error || null);
      setAvailability(null);
      return;
    }

    setValidationError(null);
    const timer = setTimeout(async () => {
      setIsChecking(true);
      const result = await checkSlugAvailability(slug);
      setAvailability(result);
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug, urlSettings.slug, checkSlugAvailability]);

  const handleSave = async () => {
    if (!hasChanges || validationError || (availability && !availability.available)) {
      return;
    }

    await updateSlug(slug);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
  };

  const canSave = hasChanges && !validationError && (!availability || availability.available) && !isSaving;

  return (
    <div className="space-y-6">
      {/* Current URL */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Your Brand URL
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-mono">
            {fullUrl}
          </div>
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Copy URL"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slug Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Customize URL Slug
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">glamlink.com/brand/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            disabled={isSaving}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-glamlink-teal focus:border-glamlink-teal disabled:opacity-50"
            placeholder="my-salon-name"
          />
          {isChecking && (
            <div className="text-gray-400">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
          {!isChecking && hasChanges && !validationError && availability && (
            availability.available ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-red-600" />
            )
          )}
        </div>

        {/* Validation/Availability Feedback */}
        {validationError && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <X className="w-4 h-4" />
            {validationError}
          </p>
        )}
        {!validationError && hasChanges && availability && (
          availability.available ? (
            <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
              <Check className="w-4 h-4" />
              This URL is available
            </p>
          ) : (
            <div className="mt-2 text-sm text-red-600">
              <p className="flex items-center gap-1">
                <X className="w-4 h-4" />
                This URL is already taken
              </p>
              {availability.suggestion && (
                <p className="mt-1 text-gray-600">
                  Try: <span className="font-mono">{availability.suggestion}</span>
                </p>
              )}
            </div>
          )
        )}
      </div>

      {/* Warning */}
      {hasChanges && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Changing your URL may affect search engine rankings</p>
            <p className="mt-1 text-xs">Your old URL will redirect automatically for 90 days</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          <Check className="w-4 h-4" />
          <span>Brand URL updated successfully!</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setSlug(urlSettings.slug)}
          disabled={!hasChanges || isSaving}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="px-4 py-2 text-sm font-medium text-white bg-glamlink-teal rounded-lg hover:bg-glamlink-teal/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
