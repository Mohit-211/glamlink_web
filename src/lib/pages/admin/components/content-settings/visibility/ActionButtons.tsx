interface ActionButtonsProps {
  hasChanges: boolean;
  isSaving: boolean;
  onReset: () => void;
  onSave: () => void;
  unsavedMessage?: string;
  resetText?: string;
  saveText?: string;
  savingText?: string;
}

export default function ActionButtons({
  hasChanges,
  isSaving,
  onReset,
  onSave,
  unsavedMessage = 'You have unsaved changes',
  resetText = 'Reset Changes',
  saveText = 'Save Changes',
  savingText = 'Saving...'
}: ActionButtonsProps) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <div>
        {hasChanges && (
          <p className="text-sm text-amber-600 font-medium">
            {unsavedMessage}
          </p>
        )}
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onReset}
          disabled={!hasChanges || isSaving}
          className={`
            px-4 py-2 text-sm font-medium rounded-md border transition-colors
            ${hasChanges && !isSaving
              ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
            }
          `}
        >
          {resetText}
        </button>
        <button
          onClick={onSave}
          disabled={!hasChanges || isSaving}
          className={`
            px-4 py-2 text-sm font-medium rounded-md transition-colors
            ${hasChanges && !isSaving
              ? 'bg-glamlink-teal text-white hover:bg-glamlink-teal-dark'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isSaving ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {savingText}
            </span>
          ) : (
            saveText
          )}
        </button>
      </div>
    </div>
  );
}
