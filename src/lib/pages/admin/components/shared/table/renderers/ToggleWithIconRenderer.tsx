import { EyeIcon } from '@/lib/pages/admin/components/shared/common';

interface ToggleWithIconRendererProps {
  row: any;
  column: any;
  onToggleVisibility?: (row: any) => void;
  onToggleEnabled?: (row: any) => void;
  onToggleReviewed?: (row: any) => void;
}

export default function ToggleWithIconRenderer({
  row,
  column,
  onToggleVisibility,
  onToggleEnabled,
  onToggleReviewed
}: ToggleWithIconRendererProps) {
  const {
    key,
    trueLabel = 'Yes',
    falseLabel = 'No',
    trueColor = 'bg-green-100 text-green-800',
    falseColor = 'bg-red-100 text-red-800'
  } = column;

  // Determine which field to check based on column key
  const fieldValue = row[key] ?? false;
  const label = fieldValue ? trueLabel : falseLabel;
  const colorClass = fieldValue ? trueColor : falseColor;

  // Determine which handler to use based on column key
  const getToggleHandler = () => {
    switch (key) {
      case 'visible':
        return onToggleVisibility;
      case 'enabled':
        return onToggleEnabled;
      case 'reviewed':
        return onToggleReviewed;
      default:
        return onToggleVisibility;
    }
  };

  const toggleHandler = getToggleHandler();

  return (
    <button
      onClick={() => toggleHandler?.(row)}
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {fieldValue && key === 'visible' && (
        <EyeIcon className="h-3 w-3 mr-1" />
      )}
      {label}
    </button>
  );
}