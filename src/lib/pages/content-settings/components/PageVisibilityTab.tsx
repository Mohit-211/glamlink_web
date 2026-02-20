'use client';

import Link from 'next/link';
import { PageVisibilityTabProps } from '../types';

export default function PageVisibilityTab({
  settings,
  isSaving,
  showSuccess,
  onToggle,
  onSave,
  onReset,
  onExport,
  onImport,
}: PageVisibilityTabProps) {
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <p className="text-gray-600 mb-6">Control which pages are visible to users. Hidden pages will show the 404 page instead.</p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button onClick={onSave} disabled={isSaving} className="px-6 py-2 bg-glamlink-teal text-white font-semibold rounded-lg hover:bg-glamlink-teal-dark transition-colors disabled:opacity-50">
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={onReset} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
            Reset to Default
          </button>
          <button onClick={onExport} className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
            Export Settings
          </button>
          <label className="px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors cursor-pointer">
            Import Settings
            <input type="file" accept=".json" onChange={onImport} className="hidden" />
          </label>
        </div>

        {/* Success Message */}
        {showSuccess && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">Settings saved successfully! Changes will take effect immediately.</div>}
      </div>

      {/* Page Settings */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Page Visibility Settings</h2>
          <div className="space-y-4">
            {settings.map((page) => (
              <div key={page.path} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{page.name}</h3>
                  <p className="text-sm text-gray-600">{page.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{page.path}</code>
                    <Link href={page.path} target="_blank" className="text-xs text-blue-600 hover:text-blue-800">
                      Preview →
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-medium ${page.isVisible ? "text-green-600" : "text-red-600"}`}>{page.isVisible ? "Live" : "Hidden"}</span>
                  <button onClick={() => onToggle(page.path)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${page.isVisible ? "bg-glamlink-teal" : "bg-gray-300"}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${page.isVisible ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Toggle switches to show or hide pages</li>
          <li>Hidden pages will display the custom 404 page</li>
          <li>Changes take effect immediately after saving</li>
          <li>Use Export/Import to backup or share settings</li>
          <li>Navigation links will still appear but redirect to 404 for hidden pages</li>
        </ul>
      </div>
    </>
  );
}