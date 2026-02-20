/**
 * TemplateGallery Component
 *
 * Browse and search automation templates organized by category
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/features/auth/useAuth';
import { useAutomationTemplates } from '@/lib/features/crm/marketing/hooks';
import { AutomationTemplate } from '@/lib/features/crm/marketing/types';
import { TemplatePreviewModal } from './TemplatePreviewModal';

export function TemplateGallery() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [requiredAppsFilter, setRequiredAppsFilter] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const { templates, loading } = useAutomationTemplates();

  // Get brandId from user
  const brandId = (user as any)?.brandId || '';

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesApp = requiredAppsFilter === 'all' ||
      t.requiredApps.includes(requiredAppsFilter);
    return matchesSearch && matchesApp;
  });

  // Group templates by category
  const templatesByCategory = filteredTemplates.reduce((acc, template) => {
    const category = template.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {} as Record<string, AutomationTemplate[]>);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to view templates</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Automation templates</h1>
        <button
          onClick={() => router.push('/profile/marketing/automations/new')}
          className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          Create custom automation
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <select
          value={requiredAppsFilter}
          onChange={(e) => setRequiredAppsFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="all">All apps</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="webhook">Webhook</option>
        </select>
      </div>

      {/* Templates by Category */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      ) : Object.keys(templatesByCategory).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
            <div key={category}>
              <h2 className="text-lg font-medium text-gray-900 mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => setSelectedTemplate(template.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={() => setSelectedTemplate(template.id)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates found matching your search</p>
        </div>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <TemplatePreviewModal
          templateId={selectedTemplate}
          brandId={brandId}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  );
}

interface TemplateCardProps {
  template: AutomationTemplate;
  onClick: () => void;
}

function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
    >
      <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{template.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Created by {template.createdBy === 'system' ? 'Glamlink' : 'You'}
        </span>

        {template.requiredApps.length > 0 && (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">Required app</span>
            <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateGallery;
