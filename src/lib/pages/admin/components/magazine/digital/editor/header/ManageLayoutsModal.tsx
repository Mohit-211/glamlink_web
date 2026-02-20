'use client';

/**
 * ManageLayoutsModal Component
 *
 * Modal for managing digital page layout templates with two tabs:
 * - Add Layout: Save current page configuration as a reusable template
 * - Manage Batch: Upload/replace layouts via JSON
 */

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import AddLayoutTab from './AddLayoutTab';
import BatchLayoutTab from './BatchLayoutTab';
import type { CurrentPageData } from '@/lib/pages/admin/types/digitalLayouts';

// =============================================================================
// TYPES
// =============================================================================

interface ManageLayoutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueId: string;
  currentPageData?: CurrentPageData;
}

type TabType = 'add' | 'batch';

// =============================================================================
// COMPONENT
// =============================================================================

export default function ManageLayoutsModal({
  isOpen,
  onClose,
  issueId,
  currentPageData
}: ManageLayoutsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('add');

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Modal container */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="bg-indigo-600 text-white px-6 py-4 rounded-t-xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <Dialog.Title className="text-xl font-semibold">
                    Manage Layouts
                  </Dialog.Title>
                  <p className="text-indigo-100 text-sm mt-1">
                    Save and manage page layout templates
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-white hover:text-indigo-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 flex-shrink-0">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('add')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'add'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Add Layout
                </button>
                <button
                  onClick={() => setActiveTab('batch')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'batch'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Manage Batch
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'add' ? (
                <AddLayoutTab
                  issueId={issueId}
                  currentPageData={currentPageData}
                  onClose={onClose}
                />
              ) : (
                <BatchLayoutTab
                  issueId={issueId}
                  onClose={onClose}
                />
              )}
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
