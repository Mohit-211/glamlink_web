"use client";

interface Trend {
  name: string;
  description: string;
  popularity?: 'hot' | 'trending' | 'emerging';
}

interface LocalTrendsProps {
  trends?: Trend[];
  cityName?: string;
  title?: string;
  className?: string;
  backgroundColor?: string;
  gridCols?: 2 | 3;
}

export default function LocalTrends({ 
  trends,
  cityName = "the city",
  title,
  className = "",
  backgroundColor = "bg-white",
  gridCols = 3
}: LocalTrendsProps) {
  if (!trends || trends.length === 0) return null;

  const gridColsClass = gridCols === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";

  const getPopularityBadge = (popularity?: string) => {
    if (!popularity) return null;
    
    const badges = {
      hot: { bg: "bg-red-100", text: "text-red-600", label: "🔥 Hot" },
      trending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "📈 Trending" },
      emerging: { bg: "bg-green-100", text: "text-green-600", label: "✨ Emerging" }
    };
    
    const badge = badges[popularity as keyof typeof badges];
    if (!badge) return null;
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className={className}>
      <h3 className="text-2xl font-bold mb-6">
        {title || `What's Trending in ${cityName}`}
      </h3>
      
      <div className={`grid ${gridColsClass} gap-4`}>
        {trends.map((trend, index) => (
          <div 
            key={index} 
            className={`rounded-lg p-4 border border-gray-200 ${backgroundColor}`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-gray-900">{trend.name}</h4>
              {getPopularityBadge(trend.popularity)}
            </div>
            <p className="text-sm text-gray-600">{trend.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}