/** Loading placeholder for the Directory results grid. */
const DirectorySkeleton = ({ count = 9 }: { count?: number }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl overflow-hidden border border-gray-100 p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2 mb-5">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
          </div>
          <div className="h-9 bg-gray-100 rounded-full w-full" />
        </div>
      ))}
    </div>
  );
};

export default DirectorySkeleton;
