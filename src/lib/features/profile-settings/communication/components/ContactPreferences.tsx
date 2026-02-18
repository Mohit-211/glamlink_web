"use client";

import { useCommunication } from "../hooks";

export default function ContactPreferences() {
  const {
    settings,
    isLoading,
    isSaving,
    error,
    updateContactMethod,
    addContactMethod,
    removeContactMethod,
    setPrimaryContact,
  } = useCommunication();

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Methods</h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {settings.contactMethods.map((method) => (
          <div
            key={method.method}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {method.method.replace('_', ' ').toUpperCase()}
                </span>
                {method.isPrimary && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    Primary
                  </span>
                )}
              </div>
              {method.value && (
                <p className="text-sm text-gray-600 mt-1">{method.value}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateContactMethod(method.method, { enabled: !method.enabled })}
                className={`text-xs px-3 py-1 rounded ${
                  method.enabled
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
                disabled={isSaving}
              >
                {method.enabled ? 'Enabled' : 'Disabled'}
              </button>
              {!method.isPrimary && method.method !== 'platform_message' && (
                <button
                  onClick={() => removeContactMethod(method.method)}
                  className="text-xs text-red-600 hover:text-red-700"
                  disabled={isSaving}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
