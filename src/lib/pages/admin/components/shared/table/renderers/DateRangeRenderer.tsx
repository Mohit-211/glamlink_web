interface DateRangeRendererProps {
  row: any;
  column: any;
}

// Simple date formatting utility
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function DateRangeRenderer({ row, column }: DateRangeRendererProps) {
  const { fields = ['startDate', 'endDate'] } = column;
  const startDate = row[fields[0]];
  const endDate = row[fields[1]];

  return (
    <div className="text-sm text-gray-900">
      <div>{formatDate(startDate)}</div>
      {endDate && (
        <div className="text-gray-500">to {formatDate(endDate)}</div>
      )}
    </div>
  );
}