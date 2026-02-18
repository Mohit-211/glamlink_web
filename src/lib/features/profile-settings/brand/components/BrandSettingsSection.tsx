"use client";

import { Store, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { UseBrandSettingsReturn } from "../types";
import BrandUrlSlug from "./BrandUrlSlug";
import BusinessHours from "./BusinessHours";
import LocationSettings from "./LocationSettings";

interface BrandSettingsSectionProps extends UseBrandSettingsReturn {}

export default function BrandSettingsSection({
  settings,
  isLoading,
  isSaving,
  error,
  checkSlugAvailability,
  updateSlug,
  updateDayHours,
  updateAllHours,
  addSpecialHours,
  removeSpecialHours,
  updateLocation,
  updateAddress,
}: BrandSettingsSectionProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'hours' | 'location'>('url');

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-gray-400" />
            Brand Settings
          </h2>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading brand settings...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 text-gray-500">
          <AlertCircle className="w-5 h-5" />
          <span>Unable to load brand settings</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Store className="w-5 h-5 text-gray-400" />
          Brand Settings
        </h2>
        <p className="text-sm text-gray-500 mt-1">Configure your brand's URL, hours, and location</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('url')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'url'
                  ? 'border-glamlink-teal text-glamlink-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Brand URL
            </button>
            <button
              onClick={() => setActiveTab('hours')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'hours'
                  ? 'border-glamlink-teal text-glamlink-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Business Hours
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'location'
                  ? 'border-glamlink-teal text-glamlink-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Service Location
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'url' && (
            <BrandUrlSlug
              urlSettings={settings.url}
              checkSlugAvailability={checkSlugAvailability}
              updateSlug={updateSlug}
              isSaving={isSaving}
            />
          )}

          {activeTab === 'hours' && (
            <BusinessHours
              hours={settings.hours}
              updateDayHours={updateDayHours}
              updateAllHours={updateAllHours}
              addSpecialHours={addSpecialHours}
              removeSpecialHours={removeSpecialHours}
              isSaving={isSaving}
            />
          )}

          {activeTab === 'location' && (
            <LocationSettings
              location={settings.location}
              updateLocation={updateLocation}
              updateAddress={updateAddress}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>
    </div>
  );
}
