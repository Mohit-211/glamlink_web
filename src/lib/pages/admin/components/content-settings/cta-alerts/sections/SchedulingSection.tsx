'use client';

import { CTAAlertConfig } from '@/lib/pages/admin/types/ctaAlert';

const inputClassName = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal";

interface SchedulingSectionProps {
  localConfig: Partial<CTAAlertConfig>;
  updateField: (field: keyof CTAAlertConfig, value: any) => void;
}

export default function SchedulingSection({
  localConfig,
  updateField,
}: SchedulingSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Scheduling</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={localConfig.startDate || ''}
            onChange={(e) => updateField('startDate', e.target.value)}
            className={inputClassName}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={localConfig.endDate || ''}
            onChange={(e) => updateField('endDate', e.target.value)}
            className={inputClassName}
          />
        </div>

        {/* Dismiss After Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reappear After (hours)</label>
          <input
            type="number"
            min="0"
            value={localConfig.dismissAfterHours || 24}
            onChange={(e) => updateField('dismissAfterHours', parseInt(e.target.value) || 0)}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-gray-500">Hours until alert reappears after user dismisses it</p>
        </div>

        {/* LocalStorage Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Storage Key</label>
          <input
            type="text"
            value={localConfig.localStorageKey || ''}
            onChange={(e) => updateField('localStorageKey', e.target.value)}
            placeholder="cta_alert_dismissed_time"
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-gray-500">Change this to reset all user dismissals</p>
        </div>
      </div>
    </div>
  );
}
