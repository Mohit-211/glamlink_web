interface RatingRendererProps {
  row: any;
  column: any;
}

export default function RatingRenderer({ row }: RatingRendererProps) {
  const rating = row.rating || 0;
  const reviewCount = row.reviewCount || 0;

  return (
    <div className="flex items-center">
      <span className="text-sm text-gray-900">
        {rating.toFixed(1)}
      </span>
      <span className="text-xs text-gray-500 ml-1">
        ({reviewCount})
      </span>
    </div>
  );
}