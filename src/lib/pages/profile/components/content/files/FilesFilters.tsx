/**
 * FilesFilters Component
 *
 * Filter and sort controls for files listing
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { FileFilter, FileSortOption } from '@/lib/features/crm/content/types';

interface FilesFiltersProps {
  filter: FileFilter;
  sort: FileSortOption;
  onFilterChange: (filter: FileFilter) => void;
  onSortChange: (sort: FileSortOption) => void;
  onSaveView: () => void;
}

export function FilesFilters({
  filter,
  sort,
  onFilterChange,
  onSortChange,
  onSaveView,
}: FilesFiltersProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  // Close sort menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filter, search: value });
  };

  const handleFileSizeChange = (value: string) => {
    let sizeRange: FileFilter['sizeRange'] = undefined;
    switch (value) {
      case 'small':
        sizeRange = { max: 100 * 1024 }; // < 100KB
        break;
      case 'medium':
        sizeRange = { min: 100 * 1024, max: 1024 * 1024 }; // 100KB - 1MB
        break;
      case 'large':
        sizeRange = { min: 1024 * 1024 }; // > 1MB
        break;
    }
    onFilterChange({ ...filter, sizeRange });
  };

  const handleFileTypeChange = (value: string) => {
    onFilterChange({ ...filter, fileType: value as FileFilter['fileType'] });
  };

  const handleUsedInChange = (value: string) => {
    onFilterChange({ ...filter, usedIn: value as FileFilter['usedIn'] });
  };

  const handleSortSelect = (field: FileSortOption['field'], direction: FileSortOption['direction']) => {
    onSortChange({ field, direction });
    setShowSortMenu(false);
  };

  const hasActiveFilters = filter.search || filter.fileType || filter.sizeRange || filter.usedIn;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* Search */}
        {showSearch ? (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={filter.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Searching in All"
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 w-64"
              />
            </div>
            <button
              onClick={() => {
                setShowSearch(false);
                handleSearchChange('');
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        )}

        {/* File Size Filter */}
        <select
          onChange={(e) => handleFileSizeChange(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">File size</option>
          <option value="small">Small (&lt; 100KB)</option>
          <option value="medium">Medium (100KB - 1MB)</option>
          <option value="large">Large (&gt; 1MB)</option>
        </select>

        {/* File Type Filter */}
        <select
          value={filter.fileType || 'all'}
          onChange={(e) => handleFileTypeChange(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="all">File type</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="document">Documents</option>
          <option value="other">Other</option>
        </select>

        {/* Used In Filter */}
        <select
          value={filter.usedIn || 'all'}
          onChange={(e) => handleUsedInChange(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="all">Used in</option>
          <option value="products">Products</option>
          <option value="blog_posts">Blog posts</option>
          <option value="unused">Unused</option>
        </select>
      </div>

      <div className="flex items-center space-x-3">
        {/* Save View */}
        {hasActiveFilters && (
          <>
            <button onClick={() => onFilterChange({})} className="text-sm text-gray-500 hover:text-gray-700">
              Cancel
            </button>
            <button onClick={onSaveView} className="text-sm text-gray-400 hover:text-gray-600">
              Save as
            </button>
          </>
        )}

        {/* Sort Menu */}
        <div className="relative" ref={sortMenuRef}>
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
              />
            </svg>
          </button>

          {showSortMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Sort by</div>

              <button
                onClick={() => handleSortSelect('date', 'desc')}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between ${
                  sort.field === 'date' ? 'text-pink-600' : 'text-gray-700'
                }`}
              >
                Date
                {sort.field === 'date' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              <button
                onClick={() => handleSortSelect('name', 'asc')}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between ${
                  sort.field === 'name' ? 'text-pink-600' : 'text-gray-700'
                }`}
              >
                File name
                {sort.field === 'name' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              <button
                onClick={() => handleSortSelect('size', 'desc')}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between ${
                  sort.field === 'size' ? 'text-pink-600' : 'text-gray-700'
                }`}
              >
                File size
                {sort.field === 'size' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={() => handleSortSelect(sort.field, 'asc')}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center ${
                    sort.direction === 'asc' ? 'text-pink-600' : 'text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Oldest first
                </button>

                <button
                  onClick={() => handleSortSelect(sort.field, 'desc')}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center ${
                    sort.direction === 'desc' ? 'text-pink-600' : 'text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Newest first
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilesFilters;
