/**
 * TemplatePreviewModal Component
 *
 * Modal for previewing and activating automation templates
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAutomationTemplate, useAutomations } from '@/lib/features/crm/marketing/hooks';
import { WorkflowPreview } from './WorkflowBuilder/WorkflowPreview';

interface TemplatePreviewModalProps {
  templateId: string;
  brandId: string;
  onClose: () => void;
}

export function TemplatePreviewModal({ templateId, brandId, onClose }: TemplatePreviewModalProps) {
  const router = useRouter();
  const { template, loading } = useAutomationTemplate(templateId);
  const { createAutomation } = useAutomations(brandId);
  const [creating, setCreating] = useState(false);

  const handleTurnOn = async () => {
    if (!template) return;

    setCreating(true);
    try {
      const automation = await createAutomation({
        name: template.name,
        description: template.description,
        status: 'active',
        brandId,
        templateId: template.id,
        trigger: template.trigger,
        conditions: template.conditions,
        actions: template.actions,
      });

      router.push(`/profile/marketing/automations/${automation.id}`);
    } catch (error) {
      console.error('Failed to create automation:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async () => {
    if (!template) return;

    setCreating(true);
    try {
      const automation = await createAutomation({
        name: template.name,
        description: template.description,
        status: 'draft',
        brandId,
        templateId: template.id,
        trigger: template.trigger,
        conditions: template.conditions,
        actions: template.actions,
      });

      router.push(`/profile/marketing/automations/${automation.id}`);
    } catch (error) {
      console.error('Failed to create automation:', error);
    } finally {
      setCreating(false);
    }
  };

  if (loading || !template) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{template.name}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Workflow Preview */}
        <div className="p-6 bg-gray-50">
          <WorkflowPreview
            trigger={template.trigger}
            conditions={template.conditions}
            actions={template.actions}
          />
        </div>

        {/* About Section */}
        <div className="px-6 py-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">About this template</h3>
          <p className="text-sm text-gray-500">{template.description}</p>

          {/* Required Apps */}
          {template.requiredApps.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Required apps</h4>
              <div className="flex items-center space-x-2">
                {template.requiredApps.map((app) => (
                  <div
                    key={app}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 capitalize">{app}</span>
                    <button className="text-xs text-pink-600 hover:underline">Open</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-500">
            Created by {template.createdBy === 'system' ? 'Glamlink' : 'You'}
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleEdit}
              disabled={creating}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50"
            >
              Edit
            </button>
            <button
              onClick={handleTurnOn}
              disabled={creating}
              className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Turn on automation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplatePreviewModal;
