/**
 * Campaign Sidebar Component
 *
 * Sidebar with campaign settings including:
 * - Email colors (background, border, text, link)
 * - Email details (subject, preview text, from)
 * - Recipient targeting
 */

'use client';

import { Campaign } from '@/lib/features/crm/marketing/types';

interface CampaignSidebarProps {
  campaign: Campaign;
  onChange: (updates: Partial<Campaign>) => void;
}

export function CampaignSidebar({ campaign, onChange }: CampaignSidebarProps) {
  // Default colors with all required properties
  const defaultColors = {
    background: '#f9fafb',
    contentBackground: '#ffffff',
    border: '#dbdbdb',
    text: '#333333',
    link: '#ec4899',
  };

  const currentColors = { ...defaultColors, ...campaign.content?.colors };

  const updateColor = (colorKey: keyof typeof defaultColors, value: string) => {
    onChange({
      content: {
        ...campaign.content,
        colors: {
          ...currentColors,
          [colorKey]: value,
        },
      },
    });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-64px)]">
      {/* Email Colors Section */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Email colors</h3>
        <div className="space-y-4">
          <ColorPicker
            label="Content background"
            value={currentColors.contentBackground}
            onChange={(color) => updateColor('contentBackground', color)}
          />
          <ColorPicker
            label="Border"
            value={currentColors.border}
            onChange={(color) => updateColor('border', color)}
          />
          <ColorPicker
            label="Text"
            value={currentColors.text}
            onChange={(color) => updateColor('text', color)}
          />
          <ColorPicker
            label="Link"
            value={currentColors.link}
            onChange={(color) => updateColor('link', color)}
          />
        </div>
      </div>

      {/* Email Details Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-medium text-gray-900 mb-4">Email details</h3>
        <div className="space-y-4">
          {/* To */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">To:</label>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full flex items-center">
                All subscribers
                <button className="ml-1 text-gray-400 hover:text-gray-600">×</button>
              </span>
              <span className="text-sm text-gray-500">
                {campaign.recipientCount || 0}
              </span>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Subject:</label>
            <input
              type="text"
              value={campaign.subject || ''}
              onChange={(e) => onChange({ subject: e.target.value })}
              placeholder="Enter email subject..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Preview text */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Preview text:</label>
            <input
              type="text"
              value={campaign.previewText || ''}
              onChange={(e) => onChange({ previewText: e.target.value })}
              placeholder="Enter preview text..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              This text appears in the inbox after the subject line
            </p>
          </div>

          {/* From */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">From:</label>
            <input
              type="text"
              value={campaign.content?.fromName || ''}
              onChange={(e) => onChange({ content: { ...campaign.content, fromName: e.target.value } })}
              placeholder="Brand name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="email"
              value={campaign.content?.fromEmail || ''}
              onChange={(e) => onChange({ content: { ...campaign.content, fromEmail: e.target.value } })}
              placeholder="email@example.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Color Picker Component
 *
 * Simple color picker using native HTML5 color input
 */
function ColorPicker({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center space-x-3">
      <div
        className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer hover:ring-2 hover:ring-pink-200 transition-all"
        style={{ backgroundColor: value }}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'color';
          input.value = value;
          input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
          input.click();
        }}
      />
      <div>
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500 uppercase">{value}</div>
      </div>
    </div>
  );
}
