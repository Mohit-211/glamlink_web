import { Star } from "lucide-react";

export default function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <span
      className="relative inline-flex"
      role="img"
      aria-label={`Rated ${value.toFixed(1)} out of ${max}`}
    >
      <span className="flex text-muted-foreground/30" aria-hidden="true">
        {Array.from({ length: max }, (_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
      </span>
      <span
        className="absolute inset-y-0 left-0 flex overflow-hidden text-[#FBBC04]"
        style={{ width: `${percent}%` }}
        aria-hidden="true"
      >
        {Array.from({ length: max }, (_, i) => (
          <Star key={i} className="w-4 h-4 shrink-0 fill-current" />
        ))}
      </span>
    </span>
  );
}
