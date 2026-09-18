"use client";

import { Search, X, Loader2 } from "lucide-react";

interface JournalSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isSearching?: boolean;
  resultCount?: number;
  placeholder?: string;
}

/* ─────────────────────────────────────────────────────────────
   JournalSearchBar
   Controlled search input for filtering Journal articles by
   title, category, author, or content. Shows a spinner while a
   search is debouncing and a result-count hint once settled.
───────────────────────────────────────────────────────────── */
const JournalSearchBar = ({
  value,
  onChange,
  isSearching = false,
  resultCount,
  placeholder = "Search articles by title, category, author, or keyword...",
}: JournalSearchBarProps) => {
  return (
    <div className="w-full">
      <div
        className="relative flex items-center rounded-full border border-border/40 bg-background
          shadow-sm transition-colors duration-200 focus-within:border-[#24bbcb]
          focus-within:ring-2 focus-within:ring-[#24bbcb]/20"
      >
        <Search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          role="searchbox"
          aria-label="Search journal articles"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent pl-11 pr-11 py-3 text-sm text-foreground
            placeholder:text-muted-foreground focus:outline-none"
        />
        <div className="absolute right-3 flex items-center">
          {isSearching ? (
            <Loader2
              className="h-4 w-4 text-[#24bbcb] animate-spin"
              aria-label="Searching"
            />
          ) : value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear search"
              className="p-1 rounded-full text-muted-foreground hover:text-[#24bbcb] hover:bg-muted/60
                transition-colors duration-150"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {value && !isSearching && typeof resultCount === "number" && (
        <p
          role="status"
          aria-live="polite"
          className="mt-2 px-1 text-[11px] text-muted-foreground"
        >
          {resultCount === 0
            ? `No results for "${value}"`
            : `${resultCount} ${resultCount === 1 ? "result" : "results"} for "${value}"`}
        </p>
      )}
    </div>
  );
};

export default JournalSearchBar;
