'use client';

import { useState, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon, CheckIcon, XIcon } from '../../common/Icons';

interface OrderControlRendererProps {
  row: any;
  column: any;
  value: any;
  onMoveUp?: (row: any) => void;
  onMoveDown?: (row: any) => void;
  onOrderChange?: (row: any, newPosition: number) => void;
  // These are passed from SimpleTable to know position in list
  rowIndex?: number;
  totalRows?: number;
}

export default function OrderControlRenderer({
  row,
  column,
  value,
  onMoveUp,
  onMoveDown,
  onOrderChange,
  rowIndex = 0,
  totalRows = 0
}: OrderControlRendererProps) {
  // Display position is 1-based (row index + 1)
  const displayPosition = rowIndex + 1;
  const [inputValue, setInputValue] = useState<string>(String(displayPosition));
  const [isEditing, setIsEditing] = useState(false);

  // Update input value when display position changes
  useEffect(() => {
    if (!isEditing) {
      setInputValue(String(displayPosition));
    }
  }, [displayPosition, isEditing]);

  const isFirst = rowIndex === 0;
  const isLast = rowIndex === totalRows - 1;

  // Check if input value has changed from current position
  const hasChanged = inputValue !== String(displayPosition);

  const handleMoveUp = () => {
    if (!isFirst && onMoveUp) {
      onMoveUp(row);
    }
  };

  const handleMoveDown = () => {
    if (!isLast && onMoveDown) {
      onMoveDown(row);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Only allow numbers
    if (val === '' || /^\d+$/.test(val)) {
      setInputValue(val);
      setIsEditing(true);
    }
  };

  const handleConfirm = () => {
    const newPosition = parseInt(inputValue, 10);

    // Validate range
    if (isNaN(newPosition) || newPosition < 1 || newPosition > totalRows) {
      // Reset to current position
      setInputValue(String(displayPosition));
      setIsEditing(false);
      return;
    }

    // Only trigger change if position actually changed
    if (newPosition !== displayPosition && onOrderChange) {
      onOrderChange(row, newPosition);
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(String(displayPosition));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  return (
    <div className="flex items-center gap-1">
      {/* Up Arrow */}
      <button
        onClick={handleMoveUp}
        disabled={isFirst}
        className={`p-1 rounded transition-colors ${
          isFirst
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }`}
        title={isFirst ? 'Already at top' : 'Move up'}
      >
        <ChevronUpIcon className="h-4 w-4" />
      </button>

      {/* Down Arrow */}
      <button
        onClick={handleMoveDown}
        disabled={isLast}
        className={`p-1 rounded transition-colors ${
          isLast
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }`}
        title={isLast ? 'Already at bottom' : 'Move down'}
      >
        <ChevronDownIcon className="h-4 w-4" />
      </button>

      {/* Order Input */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        className={`w-12 px-2 py-1 text-center text-sm border rounded transition-colors ${
          hasChanged
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 bg-white'
        } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
        title={`Position ${displayPosition} of ${totalRows}`}
      />

      {/* Confirm/Cancel buttons - only show when value changed */}
      {hasChanged && (
        <>
          <button
            onClick={handleConfirm}
            className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
            title="Confirm new position"
          >
            <CheckIcon className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            title="Cancel"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
