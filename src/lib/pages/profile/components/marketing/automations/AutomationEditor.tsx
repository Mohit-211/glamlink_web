/**
 * AutomationEditor Component
 *
 * Full editor for creating and modifying marketing automations
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/features/auth/useAuth';
import { useAutomation } from '@/lib/features/crm/marketing/hooks';
import { Automation } from '@/lib/features/crm/marketing/types';
import { WorkflowBuilder } from './WorkflowBuilder/WorkflowBuilder';
import { StatusBadge } from '../shared/StatusBadge';

interface AutomationEditorProps {
  automationId: string;
}

export function AutomationEditor({ automationId }: AutomationEditorProps) {
  const router = useRouter();
  const { user } = useAuth();
  const brandId = (user as any)?.brandId || '';

  const { automation, loading, updateAutomation, saveAutomation } = useAutomation(
    brandId,
    automationId
  );

  const [localAutomation, setLocalAutomation] = useState<Automation | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (automation) {
      setLocalAutomation(automation);
    }
  }, [automation]);

  const handleChange = (updates: Partial<Automation>) => {
    if (!localAutomation) return;
    setLocalAutomation({ ...localAutomation, ...updates });
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!localAutomation) return;
    await saveAutomation(localAutomation);
    setHasUnsavedChanges(false);
  };

  const handleToggleStatus = async () => {
    if (!localAutomation) return;
    const newStatus = localAutomation.status === 'active' ? 'inactive' : 'active';
    await updateAutomation({ status: newStatus });
    setLocalAutomation({ ...localAutomation, status: newStatus });
  };

  if (loading || !localAutomation || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/profile/marketing/automations')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <div>
              <input
                type="text"
                value={localAutomation.name}
                onChange={(e) => handleChange({ name: e.target.value })}
                className="text-xl font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-pink-500 rounded px-2 -ml-2"
              />
              <div className="flex items-center space-x-2 mt-1">
                <StatusBadge status={localAutomation.status} />
                {hasUnsavedChanges && (
                  <span className="text-xs text-orange-500">Unsaved changes</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 text-sm rounded-lg ${
                localAutomation.status === 'active'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {localAutomation.status === 'active' ? 'Turn off' : 'Turn on'}
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Builder */}
      <div className="p-6">
        <WorkflowBuilder
          automation={localAutomation}
          onChange={handleChange}
        />
      </div>

      {/* Performance Stats */}
      {localAutomation.status === 'active' && (
        <div className="mx-6 mb-6 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-4">Performance</h3>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {localAutomation.metrics.triggered}
              </div>
              <div className="text-sm text-gray-500">Triggered</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {localAutomation.metrics.emailsSent}
              </div>
              <div className="text-sm text-gray-500">Emails sent</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {localAutomation.metrics.conversions}
              </div>
              <div className="text-sm text-gray-500">Conversions</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                ${localAutomation.metrics.revenue.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">Revenue</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AutomationEditor;
