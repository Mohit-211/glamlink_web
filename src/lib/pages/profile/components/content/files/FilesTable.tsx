/**
 * FilesTable Component
 *
 * Table displaying files with thumbnails, metadata, and actions
 */

'use client';

import Link from 'next/link';
import { ContentFile, FileSortOption } from '@/lib/features/crm/content/types';
import { formatDate } from '@/lib/utils/format';

interface FilesTableProps {
  files: ContentFile[];
  loading: boolean;
  selectedFiles: string[];
  onSelectionChange: (ids: string[]) => void;
  sort: FileSortOption;
  onSortChange: (sort: FileSortOption) => void;
}

export function FilesTable({
  files,
  loading,
  selectedFiles,
  onSelectionChange,
  sort,
  onSortChange,
}: FilesTableProps) {
  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(files.map((f) => f.id));
    }
  };

  const handleSelectFile = (id: string) => {
    if (selectedFiles.includes(id)) {
      onSelectionChange(selectedFiles.filter((fid) => fid !== id));
    } else {
      onSelectionChange([...selectedFiles, id]);
    }
  };

  const toggleSort = (field: 'date' | 'name' | 'size') => {
    if (sort.field === field) {
      onSortChange({ field, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      onSortChange({ field, direction: 'desc' });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 py-3">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="w-12 h-12 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return null;
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="w-10 px-4 py-3">
            <input
              type="checkbox"
              checked={selectedFiles.length === files.length && files.length > 0}
              onChange={handleSelectAll}
              className="rounded border-gray-300"
            />
          </th>
          <th
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
            onClick={() => toggleSort('name')}
          >
            <div className="flex items-center">
              File name
              {sort.field === 'name' && (
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d={
                      sort.direction === 'asc'
                        ? 'M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z'
                        : 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                    }
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alt text</th>
          <th
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
            onClick={() => toggleSort('date')}
          >
            <div className="flex items-center">
              Date added
              {sort.field === 'date' && (
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d={
                      sort.direction === 'asc'
                        ? 'M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z'
                        : 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                    }
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </th>
          <th
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
            onClick={() => toggleSort('size')}
          >
            <div className="flex items-center">
              Size
              {sort.field === 'size' && (
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d={
                      sort.direction === 'asc'
                        ? 'M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z'
                        : 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                    }
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            References
          </th>
          <th className="w-16 px-4 py-3"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {files.map((file) => (
          <tr key={file.id} className="hover:bg-gray-50 group">
            <td className="px-4 py-3">
              <input
                type="checkbox"
                checked={selectedFiles.includes(file.id)}
                onChange={() => handleSelectFile(file.id)}
                className="rounded border-gray-300"
              />
            </td>
            <td className="px-4 py-3">
              <Link
                href={`/profile/content/files/${file.id}`}
                className="flex items-center space-x-3 hover:text-pink-600"
              >
                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {file.type === 'image' ? (
                    <img
                      src={file.thumbnailUrl || file.url}
                      alt={file.altText || file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                  <p className="text-xs text-gray-500 uppercase">{file.format}</p>
                </div>
              </Link>
            </td>
            <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">
              {file.altText || '—'}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">{formatDate(file.createdAt)}</td>
            <td className="px-4 py-3 text-sm text-gray-500">{formatFileSize(file.size)}</td>
            <td className="px-4 py-3 text-sm text-gray-500">
              {file.references.length > 0 ? (
                <span className="text-pink-600">
                  {file.references.length} {file.references.length === 1 ? 'product' : 'products'}
                </span>
              ) : (
                '—'
              )}
            </td>
            <td className="px-4 py-3">
              <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-2">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default FilesTable;
