'use client';

interface SectionsHeaderProps {
  sectionCount: number;
  onAddSection: () => void;
  onLoadDefaults?: () => void;
  showLoadDefaults?: boolean;
}

export function SectionsHeader({
  sectionCount,
  onAddSection,
  onLoadDefaults,
  showLoadDefaults = false
}: SectionsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Page Sections</h3>
        <p className="text-sm text-gray-500">
          {sectionCount} section{sectionCount !== 1 ? 's' : ''} configured
        </p>
      </div>
      <div className="flex gap-2">
        {showLoadDefaults && onLoadDefaults && (
          <button
            type="button"
            onClick={onLoadDefaults}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-glamlink-teal bg-glamlink-teal/10 border border-glamlink-teal rounded-md hover:bg-glamlink-teal hover:text-white transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Load Default Data
          </button>
        )}
        <button
          type="button"
          onClick={onAddSection}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-glamlink-teal rounded-md hover:bg-glamlink-teal-dark transition-colors"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Section
        </button>
      </div>
    </div>
  );
}
