'use client';

import { useState } from 'react';
import CreateTab from './CreateTab';
import UpdateTab from './UpdateTab';
import DownloadTab from './DownloadTab';
import { MagazineIssue } from '@/lib/pages/magazine/types/magazine/core';

interface ManageIssuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: MagazineIssue[];
  onIssueCreated: () => void;
  onIssueUpdated: () => void;
}

type TabType = 'create' | 'update' | 'download';

export default function ManageIssuesModal({
  isOpen,
  onClose,
  issues,
  onIssueCreated,
  onIssueUpdated
}: ManageIssuesModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('create');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Manage Magazine Issues</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 pt-4 border-b">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('create')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'create'
                    ? 'border-glamlink-teal text-glamlink-teal'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Create
              </button>
              <button
                onClick={() => setActiveTab('update')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'update'
                    ? 'border-glamlink-teal text-glamlink-teal'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Update
              </button>
              <button
                onClick={() => setActiveTab('download')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'download'
                    ? 'border-glamlink-teal text-glamlink-teal'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Download
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'create' && (
              <CreateTab 
                onSuccess={() => {
                  onIssueCreated();
                  onClose();
                }}
              />
            )}
            {activeTab === 'update' && (
              <UpdateTab 
                issues={issues}
                onSuccess={() => {
                  onIssueUpdated();
                  onClose();
                }}
              />
            )}
            {activeTab === 'download' && (
              <DownloadTab issues={issues} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}