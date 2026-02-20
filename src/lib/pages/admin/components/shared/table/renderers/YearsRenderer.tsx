interface YearsRendererProps {
  row: any;
  column: any;
}

export default function YearsRenderer({ row, column }: YearsRendererProps) {
  const value = row[column.key] || row.yearsExperience;

  return (
    <span className="text-sm text-gray-900">
      {value} years
    </span>
  );
}