'use client';

interface EmptyStateCardProps {
  onLoadDefaults: () => void;
  onAddSection: () => void;
}

export function EmptyStateCard({ onLoadDefaults, onAddSection }: EmptyStateCardProps) {
  return (
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No sections configured</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by adding sections or loading the default configuration.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={onLoadDefaults}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-glamlink-teal rounded-md hover:bg-glamlink-teal-dark transition-colors"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Load Default Data
        </button>
        <button
          type="button"
          onClick={onAddSection}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-glamlink-teal bg-white border border-glamlink-teal rounded-md hover:bg-glamlink-teal hover:text-white transition-colors"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Section Manually
        </button>
      </div>
    </div>
  );
}
