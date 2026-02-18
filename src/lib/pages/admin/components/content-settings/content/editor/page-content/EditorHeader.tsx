'use client';

interface EditorHeaderProps {
  title: string;
  description: string;
  ssgEnabled?: boolean;
  onToggleSSG?: () => void;
  onManageBatch?: () => void;
  showSSGToggle?: boolean;
  showBatchButton?: boolean;
}

export function EditorHeader({
  title,
  description,
  ssgEnabled = false,
  onToggleSSG,
  onManageBatch,
  showSSGToggle = true,
  showBatchButton = true
}: EditorHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      <div className="flex gap-3">
        {/* SSG Toggle */}
        {showSSGToggle && onToggleSSG && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-md">
            <label htmlFor="ssg-toggle" className="text-sm font-medium text-gray-700">
              Static Generation
            </label>
            <input
              id="ssg-toggle"
              type="checkbox"
              checked={ssgEnabled}
              onChange={onToggleSSG}
              className="h-4 w-4 text-glamlink-teal focus:ring-glamlink-teal border-gray-300 rounded"
            />
            <span className="text-xs text-gray-500">
              {ssgEnabled ? '(Requires rebuild)' : '(Dynamic)'}
            </span>
          </div>
        )}

        {/* Batch Management Button */}
        {showBatchButton && onManageBatch && (
          <button
            onClick={onManageBatch}
            className="px-4 py-2 text-sm font-medium text-glamlink-teal border border-glamlink-teal rounded-md hover:bg-glamlink-teal hover:text-white transition-colors"
          >
            Manage Batch
          </button>
        )}
      </div>
    </div>
  );
}
