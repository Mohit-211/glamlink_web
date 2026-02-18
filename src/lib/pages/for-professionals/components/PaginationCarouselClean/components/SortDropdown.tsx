import { ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { SortBy, SortDirection } from "../types";

interface SortDropdownProps {
  sortBy: SortBy;
  sortDirection: SortDirection;
  setSortBy: (sortBy: SortBy) => void;
  setSortDirection: (direction: SortDirection) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function SortDropdown({
  sortBy,
  sortDirection,
  setSortBy,
  setSortDirection,
  isOpen,
  setIsOpen,
}: SortDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const handleSort = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortBy(newSortBy);
      setSortDirection("asc");
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <ArrowUpDown className="w-4 h-4" />
        <span>
          {sortBy === "none" ? "Sort" : `Sort by ${sortBy}`}
        </span>
        {sortBy !== "none" && (
          sortDirection === "asc" ? (
            <ArrowUp className="w-4 h-4 text-glamlink-teal" />
          ) : (
            <ArrowDown className="w-4 h-4 text-glamlink-teal" />
          )
        )}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 bg-white text-gray-900 border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
          <button
            onClick={() => handleSort("name")}
            className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-50 flex items-center justify-between"
          >
            <span>Name</span>
            {sortBy === "name" && (
              sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => handleSort("location")}
            className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-50 flex items-center justify-between"
          >
            <span>Location</span>
            {sortBy === "location" && (
              sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}