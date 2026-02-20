"use client";

import { PlusIcon, DocumentIcon } from '../Icons';

interface NoRecordsProps {
  itemName: string;
  icon?: React.ReactNode;
  onCreate?: () => void;
  className?: string;
  description?: string;
  createButtonText?: string;
}

export default function NoRecords({
  itemName,
  icon,
  onCreate,
  className = "",
  description,
  createButtonText
}: NoRecordsProps) {
  const defaultDescription = `Get started by creating your first ${itemName.toLowerCase()}.`;
  const defaultCreateText = `Add ${itemName.charAt(0).toUpperCase() + itemName.slice(1)}`;

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-gray-400">
        {icon || <DocumentIcon />}
        <h3 className="mt-2 text-sm font-medium text-gray-900">No {itemName} found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {description || defaultDescription}
        </p>
        {onCreate && (
          <div className="mt-6">
            <button
              onClick={onCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-glamlink-teal hover:bg-glamlink-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              {createButtonText || defaultCreateText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
