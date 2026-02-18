interface ToggleRendererProps {
  row: any;
  column: any;
  onToggleFeatured?: (row: any) => void;
  onToggleVisibility?: (row: any) => void;
}

export default function ToggleRenderer({ row, column, onToggleFeatured, onToggleVisibility }: ToggleRendererProps) {
  const {
    trueLabel = 'Active',
    falseLabel = 'Inactive',
    trueColor = 'bg-green-100 text-green-800',
    falseColor = 'bg-gray-100 text-gray-800'
  } = column;

  const isActive = row.featured ?? row.visible ?? false;
  const label = isActive ? trueLabel : falseLabel;
  const colorClass = isActive ? trueColor : falseColor;

  const handleClick = () => {
    if (column.key === 'featured' && onToggleFeatured) {
      onToggleFeatured(row);
    } else if (column.key === 'visible' && onToggleVisibility) {
      onToggleVisibility(row);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {label}
    </button>
  );
}