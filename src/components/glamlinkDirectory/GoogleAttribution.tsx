const GOOGLE_LETTERS = [
  { char: "G", color: "#4285F4" },
  { char: "o", color: "#EA4335" },
  { char: "o", color: "#FBBC05" },
  { char: "g", color: "#4285F4" },
  { char: "l", color: "#34A853" },
  { char: "e", color: "#EA4335" },
];

/**
 * Text wordmark used for the prototype. When Google Places is connected,
 * swap in Google's official "powered by Google" asset per their attribution policy.
 */
export function GoogleWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-semibold tracking-tight ${className}`} aria-label="Google">
      {GOOGLE_LETTERS.map((letter, i) => (
        <span key={i} style={{ color: letter.color }} aria-hidden="true">
          {letter.char}
        </span>
      ))}
    </span>
  );
}

export default function GoogleAttribution({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border bg-white px-3.5 py-1.5 text-xs text-muted-foreground shadow-soft ${className}`}
    >
      Powered by <GoogleWordmark className="text-sm" />
    </span>
  );
}
