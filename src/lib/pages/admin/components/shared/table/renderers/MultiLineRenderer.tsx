interface MultiLineRendererProps {
  value: any;
  row: any;
  column: any;
}

export default function MultiLineRenderer({ row, column }: MultiLineRendererProps) {
  const { fields = [], maxLength } = column;

  const truncateText = (text: string, max: number): string => {
    if (!text || text.length <= max) return text;
    return text.substring(0, max) + '...';
  };

  return (
    <div>
      {fields.map((field: string, index: number) => {
        const value = row[field];
        // Apply maxLength to secondary fields, or to all fields if there's only one field
        const shouldTruncate = maxLength && (index > 0 || fields.length === 1);
        const displayValue = shouldTruncate ? truncateText(value, maxLength) : value;

        return (
          <div
            key={field}
            className={
              index === 0
                ? "text-sm font-medium text-gray-900"
                : "text-sm text-gray-500"
            }
            title={shouldTruncate && value?.length > maxLength ? value : undefined}
          >
            {displayValue}
          </div>
        );
      })}
    </div>
  );
}