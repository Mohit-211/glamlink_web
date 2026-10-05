import { SearchX, SlidersHorizontal } from "lucide-react";

export default function DirectoryEmptyState({ onModifySearch }: { onModifySearch: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed bg-background px-6 py-14 sm:py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-medium">
        <SearchX className="w-7 h-7" aria-hidden="true" />
      </span>
      <h3 className="font-display mt-6 text-2xl sm:text-3xl font-semibold">No professionals found</h3>
      <p className="mt-3 max-w-md text-muted-foreground">
        Try changing your location or professional type to discover more beauty and wellness
        businesses.
      </p>
      <button type="button" onClick={onModifySearch} className="btn-primary mt-8">
        <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
        Modify Search
      </button>
    </div>
  );
}
