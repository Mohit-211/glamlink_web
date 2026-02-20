'use client';

import { useState, useRef, useEffect } from 'react';
import { useMessageTemplates } from '../hooks/useMessageTemplates';
import { TEMPLATE_CATEGORY_LABELS, type TemplateCategory, type MessageTemplate } from '../types/template';

interface TemplateSelectorProps {
  /** Callback when a template is selected */
  onSelect: (content: string) => void;
  /** Callback when the selector is closed */
  onClose: () => void;
}

/**
 * Template selector popup for quickly inserting message templates.
 *
 * Features:
 * - Category filtering
 * - Search within templates
 * - Usage count display
 * - Keyboard navigation
 *
 * @example
 * ```tsx
 * {showTemplates && (
 *   <TemplateSelector
 *     onSelect={(content) => {
 *       setMessageContent(prev => prev + content);
 *       setShowTemplates(false);
 *     }}
 *     onClose={() => setShowTemplates(false)}
 *   />
 * )}
 * ```
 */
export function TemplateSelector({ onSelect, onClose }: TemplateSelectorProps) {
  const { templates, isLoading, error, useTemplate, getTemplatesByCategory } = useMessageTemplates();
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Filter templates
  const filteredTemplates = getTemplatesByCategory(selectedCategory).filter((t) => {
    if (!search.trim()) return true;
    const searchLower = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(searchLower) ||
      t.content.toLowerCase().includes(searchLower)
    );
  });

  const handleSelect = (template: MessageTemplate) => {
    // Get template and increment usage count
    useTemplate(template.id);
    onSelect(template.content);
    onClose();
  };

  const categories: (TemplateCategory | 'all')[] = ['all', 'greeting', 'solution', 'followup', 'closure', 'custom'];

  return (
    <div
      ref={containerRef}
      className="absolute bottom-full left-0 mb-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
      role="dialog"
      aria-label="Message templates"
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900">Message Templates</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close templates"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full px-3 py-1.5 pl-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-glamlink-purple focus:border-glamlink-purple"
          />
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 p-2 overflow-x-auto border-b border-gray-100 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-glamlink-purple text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === 'all' ? 'All' : (
              <>
                <span aria-hidden="true">{TEMPLATE_CATEGORY_LABELS[cat].icon}</span>
                {' '}
                {TEMPLATE_CATEGORY_LABELS[cat].label}
              </>
            )}
          </button>
        ))}
      </div>

      {/* Template list */}
      <div className="max-h-64 overflow-y-auto">
        {error ? (
          <div className="p-4 text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No templates available</p>
            <p className="text-xs mt-1 text-gray-400">Templates can be created in admin settings</p>
          </div>
        ) : isLoading ? (
          <div className="p-4 text-center text-gray-500">
            <svg className="w-5 h-5 mx-auto mb-2 animate-spin text-glamlink-purple" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading templates...
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {search.trim() ? (
              <>
                <p>No templates match &quot;{search}&quot;</p>
                <button
                  onClick={() => setSearch('')}
                  className="mt-2 text-sm text-glamlink-purple hover:underline"
                >
                  Clear search
                </button>
              </>
            ) : templates.length === 0 ? (
              <p>No templates yet. Templates will appear here once created.</p>
            ) : (
              <p>No templates in this category</p>
            )}
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelect(template)}
              className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors focus:bg-glamlink-purple/5 focus:outline-none"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-gray-900 flex items-center gap-1.5">
                  <span aria-hidden="true">{TEMPLATE_CATEGORY_LABELS[template.category].icon}</span>
                  {template.name}
                </span>
                <span className="text-xs text-gray-400">
                  {template.usageCount} use{template.usageCount !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{template.content}</p>
            </button>
          ))
        )}
      </div>

      {/* Footer hint */}
      {filteredTemplates.length > 0 && (
        <div className="p-2 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Click a template to insert it
          </p>
        </div>
      )}
    </div>
  );
}
