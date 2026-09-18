"use client";

import { Search, X, Loader2 } from "lucide-react";

interface DirectorySearchProps {
  value: string;
  onChange: (value: string) => void;
  isSearching?: boolean;
  resultCount?: number;
  placeholder?: string;
}

/** Controlled search input for the Directory — searches professionals and companies by name, specialty, category, or location. */
const DirectorySearch = ({
  value,
  onChange,
  isSearching = false,
  resultCount,
  placeholder = "Search by name, company, specialty, category, or location...",
}: DirectorySearchProps) => {
  return (
    <div className="w-full">
      <div
        className="relative flex items-center rounded-full bg-white border border-gray-200
          shadow-sm transition-colors duration-200 focus-within:border-[#24bbcb]
          focus-within:ring-2 focus-within:ring-[#24bbcb]/15"
      >
        <Search className="absolute left-5 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          role="searchbox"
          aria-label="Search the directory"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent pl-13 pr-12 py-4 text-[15px] text-gray-900
            placeholder:text-gray-400 focus:outline-none rounded-full"
        />
        <div className="absolute right-4 flex items-center">
          {isSearching ? (
            <Loader2 className="h-4 w-4 text-[#24bbcb] animate-spin" aria-label="Searching" />
          ) : value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear search"
              className="p-1 rounded-full text-gray-400 hover:text-[#24bbcb] hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {value && !isSearching && typeof resultCount === "number" && (
        <p role="status" aria-live="polite" className="mt-2 px-1 text-[11px] text-gray-400">
          {resultCount === 0
            ? `No results for "${value}"`
            : `${resultCount} ${resultCount === 1 ? "result" : "results"} for "${value}"`}
        </p>
      )}
    </div>
  );
};

export default DirectorySearch;
