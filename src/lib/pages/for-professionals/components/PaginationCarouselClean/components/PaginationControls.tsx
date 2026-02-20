import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageInput: string;
  setCurrentPage: (page: number) => void;
  setPageInput: (input: string) => void;
  handlePageInputChange: (value: string) => void;
  handlePageInputBlur: () => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  pageInput,
  setCurrentPage,
  setPageInput,
  handlePageInputChange,
  handlePageInputBlur,
}: PaginationControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {/* First page button */}
      <button
        onClick={() => {
          setCurrentPage(1);
          setPageInput("1");
        }}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-all ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
        }`}
      >
        <ChevronsLeft className="w-5 h-5" />
      </button>

      {/* Previous button */}
      <button
        onClick={() => {
          const newPage = Math.max(1, currentPage - 1);
          setCurrentPage(newPage);
          setPageInput(newPage.toString());
        }}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-all ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page input */}
      <div className="flex items-center gap-2 text-gray-700">
        <span>Page</span>
        <input
          type="text"
          value={pageInput}
          onChange={(e) => handlePageInputChange(e.target.value)}
          onBlur={handlePageInputBlur}
          className="w-12 px-2 py-1 text-center bg-white border border-gray-300 rounded focus:outline-none focus:border-glamlink-teal focus:ring-1 focus:ring-glamlink-teal text-gray-900"
        />
        <span>of {totalPages}</span>
      </div>

      {/* Next button */}
      <button
        onClick={() => {
          const newPage = Math.min(totalPages, currentPage + 1);
          setCurrentPage(newPage);
          setPageInput(newPage.toString());
        }}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg transition-all ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Last page button */}
      <button
        onClick={() => {
          setCurrentPage(totalPages);
          setPageInput(totalPages.toString());
        }}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg transition-all ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
        }`}
      >
        <ChevronsRight className="w-5 h-5" />
      </button>
    </div>
  );
}