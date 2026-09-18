export default function ProviderCardSkeleton() {
  return (
    <div className="card-glamlink flex flex-col animate-pulse">
      {/* IMAGE */}
      <div className="w-full h-56 rounded-xl mb-4 bg-muted" />

      {/* CONTENT */}
      <div className="flex flex-col flex-grow gap-3">
        {/* TITLE + ICON */}
        <div className="flex items-start justify-between gap-3">
          <div className="h-5 w-2/3 rounded bg-muted" />
          <div className="h-5 w-5 rounded-full bg-muted" />
        </div>

        {/* ADDRESS */}
        <div className="h-4 w-4/5 rounded bg-muted" />

        {/* SPECIALTIES */}
        <div className="flex flex-wrap gap-2 mt-1">
          <div className="h-5 w-16 rounded-full bg-muted" />
          <div className="h-5 w-20 rounded-full bg-muted" />
          <div className="h-5 w-14 rounded-full bg-muted" />
        </div>

        {/* VICINITY */}
        <div className="h-3 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}
