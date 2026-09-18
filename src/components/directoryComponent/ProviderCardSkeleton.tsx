import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderCardSkeleton() {
  return (
    <div className="card-glamlink flex flex-col">
      <Skeleton className="w-full h-56 rounded-xl mb-4" />

      <div className="flex flex-col flex-grow gap-3">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>

        <Skeleton className="h-4 w-4/5" />

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
