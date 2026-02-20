/**
 * Section Editor Component
 *
 * Type-specific editors for different email section types.
 * Provides appropriate form fields for each section type.
 */

'use client';

import { EmailSection } from '@/lib/features/crm/marketing/types';

interface SectionEditorProps {
  section: EmailSection;
  onChange: (updates: Partial<EmailSection>) => void;
}

export function SectionEditor({ section, onChange }: SectionEditorProps) {
  const handleContentChange = (key: string, value: any) => {
    onChange({
      content: { ...section.content, [key]: value }
    });
  };

  switch (section.type) {
    case 'header':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Header Text</label>
            <input
              type="text"
              value={section.content?.text || ''}
              onChange={(e) => handleContentChange('text', e.target.value)}
              placeholder="Your Brand Name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-xs text-gray-500 mt-1">Displayed if no logo is provided</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input
              type="url"
              value={section.content?.logoUrl || ''}
              onChange={(e) => handleContentChange('logoUrl', e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: Use logo instead of text</p>
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={section.content?.text || ''}
              onChange={(e) => handleContentChange('text', e.target.value)}
              rows={6}
              placeholder="Enter your text content..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
            <select
              value={section.content?.align || 'left'}
              onChange={(e) => handleContentChange('align', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              value={section.content?.src || ''}
              onChange={(e) => handleContentChange('src', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
            <input
              type="text"
              value={section.content?.alt || ''}
              onChange={(e) => handleContentChange('alt', e.target.value)}
              placeholder="Describe the image"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-xs text-gray-500 mt-1">For accessibility and when image doesn't load</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (Optional)</label>
            <input
              type="url"
              value={section.content?.href || ''}
              onChange={(e) => handleContentChange('href', e.target.value)}
              placeholder="https://example.com/product"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-xs text-gray-500 mt-1">Make the image clickable</p>
          </div>
        </div>
      );

    case 'button':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={section.content?.text || ''}
              onChange={(e) => handleContentChange('text', e.target.value)}
              placeholder="Shop Now"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
            <input
              type="url"
              value={section.content?.href || ''}
              onChange={(e) => handleContentChange('href', e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={section.content?.backgroundColor || '#ec4899'}
                onChange={(e) => handleContentChange('backgroundColor', e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={section.content?.backgroundColor || '#ec4899'}
                onChange={(e) => handleContentChange('backgroundColor', e.target.value)}
                placeholder="#ec4899"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
        </div>
      );

    case 'divider':
      return (
        <div className="py-4 text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
          </svg>
          <p>This section adds a horizontal divider line.</p>
          <p className="text-sm mt-2">No additional settings are needed.</p>
        </div>
      );

    case 'footer':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              value={section.content?.companyName || ''}
              onChange={(e) => handleContentChange('companyName', e.target.value)}
              placeholder="Your Company Name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={section.content?.address || ''}
              onChange={(e) => handleContentChange('address', e.target.value)}
              rows={3}
              placeholder="123 Main St&#10;City, State 12345"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-xs text-gray-500 mt-1">Physical mailing address (required by law)</p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showUnsubscribe"
              checked={section.content?.showUnsubscribe !== false}
              onChange={(e) => handleContentChange('showUnsubscribe', e.target.checked)}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="showUnsubscribe" className="ml-2 text-sm text-gray-700">
              Show unsubscribe link (recommended)
            </label>
          </div>
        </div>
      );

    default:
      return (
        <div className="py-8 text-center text-gray-500">
          <p>No editor available for section type: {section.type}</p>
        </div>
      );
  }
}
