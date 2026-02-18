'use client';

import { CTAAlertConfig } from '@/lib/pages/admin/types/ctaAlert';

const inputClassName = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal";

interface AppearanceSectionProps {
  localConfig: Partial<CTAAlertConfig>;
  updateField: (field: keyof CTAAlertConfig, value: any) => void;
}

export default function AppearanceSection({
  localConfig,
  updateField,
}: AppearanceSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Alert Bar Appearance</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Message */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={localConfig.message || ''}
            onChange={(e) => updateField('message', e.target.value)}
            placeholder="Win a Free Glam Makeover! Tap to Learn How to Enter"
            className={inputClassName}
          />
        </div>

        {/* Button Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Button Text <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={localConfig.buttonText || ''}
            onChange={(e) => updateField('buttonText', e.target.value)}
            placeholder="Enter Giveaway"
            className={inputClassName}
          />
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
          <input
            type="text"
            value={localConfig.backgroundColor || ''}
            onChange={(e) => updateField('backgroundColor', e.target.value)}
            placeholder="bg-glamlink-teal"
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-gray-500">Tailwind class or hex color (e.g., bg-glamlink-teal, #4FD1C5)</p>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
          <input
            type="text"
            value={localConfig.textColor || ''}
            onChange={(e) => updateField('textColor', e.target.value)}
            placeholder="text-white"
            className={inputClassName}
          />
        </div>

        {/* Button Background Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Button Background</label>
          <input
            type="text"
            value={localConfig.buttonBackgroundColor || ''}
            onChange={(e) => updateField('buttonBackgroundColor', e.target.value)}
            placeholder="bg-black"
            className={inputClassName}
          />
        </div>

        {/* Button Text Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Button Text Color</label>
          <input
            type="text"
            value={localConfig.buttonTextColor || ''}
            onChange={(e) => updateField('buttonTextColor', e.target.value)}
            placeholder="text-white"
            className={inputClassName}
          />
        </div>
      </div>
    </div>
  );
}
