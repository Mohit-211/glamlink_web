"use client";

import { useCommunication } from "../hooks";
import { AUTO_REPLY_TRIGGERS } from "../config";

export default function AutoReply() {
  const {
    settings,
    isLoading,
    isSaving,
    error,
    updateAutoReply,
  } = useCommunication();

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>;
  }

  const { autoReply } = settings;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Auto-Reply Settings</h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Enable Auto-Reply */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoReply.enabled}
              onChange={(e) => updateAutoReply({ enabled: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={isSaving}
            />
            <span className="text-sm font-medium text-gray-700">Enable Auto-Reply</span>
          </label>
        </div>

        {autoReply.enabled && (
          <>
            {/* Trigger */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trigger
              </label>
              <select
                value={autoReply.trigger}
                onChange={(e) => updateAutoReply({ trigger: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={isSaving}
              >
                {AUTO_REPLY_TRIGGERS.map((trigger) => (
                  <option key={trigger.value} value={trigger.value}>
                    {trigger.label} - {trigger.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-Reply Message
              </label>
              <textarea
                value={autoReply.message}
                onChange={(e) => updateAutoReply({ message: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your auto-reply message..."
                disabled={isSaving}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use {'{'}{'{'} brand_name {'}'}{'}'}  to insert your brand name
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoReply.includeAvailability}
                  onChange={(e) => updateAutoReply({ includeAvailability: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isSaving}
                />
                <span className="text-sm text-gray-700">Include next available time</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoReply.includeBookingLink}
                  onChange={(e) => updateAutoReply({ includeBookingLink: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isSaving}
                />
                <span className="text-sm text-gray-700">Include booking link</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoReply.excludeExistingClients}
                  onChange={(e) => updateAutoReply({ excludeExistingClients: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isSaving}
                />
                <span className="text-sm text-gray-700">Don't auto-reply to existing clients</span>
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
