'use client';

import { useState, useEffect } from 'react';
import { ForClientsBannerConfig } from '../../sections/for-clients/types';

const inputClassName = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal";

interface BannerEditorProps {
  banner: ForClientsBannerConfig;
  onUpdate: (banner: ForClientsBannerConfig) => void;
}

export default function BannerEditor({ banner, onUpdate }: BannerEditorProps) {
  const [localBanner, setLocalBanner] = useState<ForClientsBannerConfig>(banner);

  useEffect(() => {
    setLocalBanner(banner);
  }, [banner]);

  const handleChange = (field: keyof ForClientsBannerConfig, value: any) => {
    const updated = { ...localBanner, [field]: value };
    setLocalBanner(updated);
    onUpdate(updated);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Page Banner</h3>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={localBanner.enabled}
            onChange={(e) => handleChange('enabled', e.target.checked)}
            className="h-4 w-4 text-glamlink-teal border-gray-300 rounded focus:ring-glamlink-teal"
          />
          <span className="ml-2 text-sm text-gray-700">Enable Banner</span>
        </label>
      </div>

      {localBanner.enabled && (
        <div className="space-y-4">
          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banner Message <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={localBanner.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Check out our latest offers!"
              className={inputClassName}
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link (optional)
            </label>
            <input
              type="text"
              value={localBanner.link || ''}
              onChange={(e) => handleChange('link', e.target.value)}
              placeholder="/promotions"
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty for no link, or enter a URL path
            </p>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localBanner.backgroundColor || '#24bbcb'}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={localBanner.backgroundColor || '#24bbcb'}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className={`flex-1 ${inputClassName}`}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localBanner.textColor || '#ffffff'}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={localBanner.textColor || '#ffffff'}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className={`flex-1 ${inputClassName}`}
                />
              </div>
            </div>
          </div>

          {/* Dismissible */}
          <div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localBanner.dismissible ?? true}
                onChange={(e) => handleChange('dismissible', e.target.checked)}
                className="h-4 w-4 text-glamlink-teal border-gray-300 rounded focus:ring-glamlink-teal"
              />
              <span className="ml-2 text-sm text-gray-700">Allow users to dismiss the banner</span>
            </label>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div
              className="p-3 rounded-md text-center text-sm font-medium"
              style={{
                backgroundColor: localBanner.backgroundColor || '#24bbcb',
                color: localBanner.textColor || '#ffffff'
              }}
            >
              {localBanner.message || 'Banner message preview'}
              {localBanner.link && (
                <span className="ml-2 underline">Learn more</span>
              )}
            </div>
          </div>
        </div>
      )}

      {!localBanner.enabled && (
        <p className="text-sm text-gray-500">
          Enable the banner to configure its message and appearance.
        </p>
      )}
    </div>
  );
}
