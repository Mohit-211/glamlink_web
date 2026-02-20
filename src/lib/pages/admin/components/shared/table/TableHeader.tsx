import React from 'react';
import { formatElapsedTime } from '@/lib/pages/admin/utils/timestampUtils';
import {
  PlusIcon,
  UploadIcon,
  RefreshIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeOffIcon,
  CalendarIcon
} from '@/lib/pages/admin/components/shared/common';

export type DateFilterOption = 'all' | 'week' | 'month' | 'custom';

export interface DateFilterState {
  option: DateFilterOption;
  startDate?: string;
  endDate?: string;
}

export interface TableHeaderProps {
  title: string;
  onRefresh?: () => void | Promise<void>;
  isRefreshing?: boolean;
  onBatchUpload?: () => void;
  batchUploadText?: string;
  onAdd?: () => void;
  addButtonText?: string;
  lastUpdated?: number | null;  // Unix timestamp for cache display
  onBack?: () => void;
  backButtonText?: string;
  // Filter toggle for showing/hiding inactive items
  showActiveOnly?: boolean;
  onToggleActiveFilter?: (showActiveOnly: boolean) => void;
  activeFilterLabel?: string;
  inactiveCount?: number;
  // Date filter
  dateFilter?: DateFilterState;
  onDateFilterChange?: (filter: DateFilterState) => void;
  dateFilterLabel?: string;
  // Custom action buttons
  onManagePDFs?: () => void;
  managePDFsText?: string;
  onCreatePDFs?: () => void;
  createPDFsText?: string;
}

export default function TableHeader({
  title,
  onRefresh,
  isRefreshing = false,
  onBatchUpload,
  batchUploadText = "Upload Batch",
  onAdd,
  addButtonText,
  lastUpdated,
  onBack,
  backButtonText = "Back",
  showActiveOnly,
  onToggleActiveFilter,
  activeFilterLabel = "Active Only",
  inactiveCount = 0,
  dateFilter,
  onDateFilterChange,
  dateFilterLabel = "Date Range",
  onManagePDFs,
  managePDFsText = "Manage PDFs",
  onCreatePDFs,
  createPDFsText = "Create PDFs"
}: TableHeaderProps) {
  // Calculate ONCE on render (static, not live-updating)
  const timestampText = lastUpdated ? formatElapsedTime(lastUpdated) : null;

  // Check if any filters are present
  const hasFilters = (onToggleActiveFilter && showActiveOnly !== undefined) || (onDateFilterChange && dateFilter);

  return (
    <div className="px-6 py-4 border-b border-gray-200">
      {/* Row 1: Title + Filters (or all buttons if no filters) */}
      <div className={`flex items-center justify-between ${hasFilters ? 'mb-3' : ''}`}>
        <div className="flex items-center space-x-4">
          {/* Back Button (optional) */}
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              {backButtonText}
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {/* Static timestamp display */}
            {timestampText && (
              <p className="text-sm text-gray-500 mt-1">
                {timestampText}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* Show filters if present, otherwise show action buttons */}
          {hasFilters ? (
            <>
              {/* Active Filter Toggle (optional) */}
              {onToggleActiveFilter && showActiveOnly !== undefined && (
            <button
              onClick={() => onToggleActiveFilter(!showActiveOnly)}
              className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal ${
                showActiveOnly
                  ? 'border-glamlink-teal text-glamlink-teal bg-glamlink-teal/10 hover:bg-glamlink-teal/20'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
              title={showActiveOnly ? `Click to show all (${inactiveCount} hidden)` : 'Click to show active only'}
            >
              {showActiveOnly ? (
                <>
                  <EyeIcon className="h-4 w-4 mr-2" />
                  {activeFilterLabel}
                  {inactiveCount > 0 && (
                    <span className="ml-2 bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-xs">
                      +{inactiveCount}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <EyeOffIcon className="h-4 w-4 mr-2" />
                  Show All
                </>
              )}
            </button>
          )}

          {/* Date Filter (optional) */}
          {onDateFilterChange && dateFilter && (
            <div className="flex items-center space-x-2">
              <div className="relative inline-block">
                <select
                  value={dateFilter.option}
                  onChange={(e) => onDateFilterChange({
                    option: e.target.value as DateFilterOption,
                    startDate: dateFilter.startDate,
                    endDate: dateFilter.endDate
                  })}
                  className="inline-flex items-center pl-3 pr-8 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal appearance-none"
                >
                  <option value="all">All Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="custom">Custom Range</option>
                </select>
                <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Custom Date Range Inputs */}
              {dateFilter.option === 'custom' && (
                <>
                  <input
                    type="date"
                    value={dateFilter.startDate || ''}
                    onChange={(e) => onDateFilterChange({
                      ...dateFilter,
                      startDate: e.target.value
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal"
                    placeholder="Start date"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    value={dateFilter.endDate || ''}
                    onChange={(e) => onDateFilterChange({
                      ...dateFilter,
                      endDate: e.target.value
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal"
                    placeholder="End date"
                  />
                </>
              )}
            </div>
              )}
            </>
          ) : (
            <>
              {/* Action buttons when no filters */}
              {/* Refresh Button (optional) */}
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh data"
                >
                  <RefreshIcon className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              )}

              {/* Manage PDFs Button (optional) */}
              {onManagePDFs && (
                <button
                  onClick={onManagePDFs}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal"
                >
                  {managePDFsText}
                </button>
              )}

              {/* Create PDFs Button (optional) */}
              {onCreatePDFs && (
                <button
                  onClick={onCreatePDFs}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  {createPDFsText}
                </button>
              )}

              {/* Batch Upload Button (optional) */}
              {onBatchUpload && (
                <button
                  onClick={onBatchUpload}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal"
                >
                  <UploadIcon className="h-4 w-4 mr-2" />
                  {batchUploadText}
                </button>
              )}

              {/* Add Button (optional) */}
              {onAdd && addButtonText && (
                <button
                  onClick={onAdd}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-glamlink-teal hover:bg-glamlink-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  {addButtonText}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Row 2: Action Buttons (only when filters are present) */}
      {hasFilters && (
        <div className="flex items-center justify-end space-x-3">
        {/* Refresh Button (optional) */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh data"
          >
            <RefreshIcon className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}

        {/* Manage PDFs Button (optional) */}
        {onManagePDFs && (
          <button
            onClick={onManagePDFs}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal"
          >
            {managePDFsText}
          </button>
        )}

        {/* Create PDFs Button (optional) */}
        {onCreatePDFs && (
          <button
            onClick={onCreatePDFs}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {createPDFsText}
          </button>
        )}

        {/* Batch Upload Button (optional) */}
        {onBatchUpload && (
          <button
            onClick={onBatchUpload}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal"
          >
            <UploadIcon className="h-4 w-4 mr-2" />
            {batchUploadText}
          </button>
        )}

          {/* Add Button (optional) */}
          {onAdd && addButtonText && (
            <button
              onClick={onAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-glamlink-teal hover:bg-glamlink-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              {addButtonText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
