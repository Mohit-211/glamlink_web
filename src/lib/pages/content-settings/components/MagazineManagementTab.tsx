'use client';

import Link from 'next/link';
import { MagazineManagementTabProps } from '../types';
import MagazineIssueForm from './MagazineIssueForm';

export default function MagazineManagementTab({
  magazineIssues,
  isLoadingMagazine,
  isSavingMagazine,
  editingIssue,
  showAddIssue,
  onToggleFeatured,
  onDeleteIssue,
  onEditIssue,
  onAddIssue,
  onSaveIssue,
  onCancelEdit,
}: MagazineManagementTabProps) {
  return (
    <>
      {/* Magazine Management Tab */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Magazine Issues</h2>
            <p className="text-gray-600 mt-1">Manage your weekly magazine issues</p>
          </div>
          <button 
            onClick={onAddIssue}
            className="px-4 py-2 bg-glamlink-teal text-white font-semibold rounded-lg hover:bg-glamlink-teal-dark transition-colors"
          >
            Add New Issue
          </button>
        </div>

        {isLoadingMagazine ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glamlink-teal mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading magazine issues...</p>
          </div>
        ) : magazineIssues.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No magazine issues found. Click "Add New Issue" to create one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {magazineIssues.map((issue) => (
              <div key={issue.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                      <span className="text-sm text-gray-500">Issue #{issue.issueNumber}</span>
                      {issue.featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-glamlink-teal text-white">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{issue.subtitle}</p>
                    <p className="text-sm text-gray-500 mb-3">{issue.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        Date: {new Date(issue.issueDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <Link 
                        href={`/magazine/${issue.id}`} 
                        target="_blank"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Preview →
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => onToggleFeatured(issue.id)}
                      disabled={isSavingMagazine}
                      className={`px-3 py-1 text-sm font-medium rounded ${
                        issue.featured 
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                          : 'bg-glamlink-teal text-white hover:bg-glamlink-teal-dark'
                      } transition-colors disabled:opacity-50`}
                    >
                      {issue.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button 
                      onClick={() => onEditIssue(issue)}
                      className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDeleteIssue(issue.id)}
                      disabled={isSavingMagazine}
                      className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Magazine Management Instructions</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Create weekly magazine issues with curated content</li>
            <li>Only one issue can be featured at a time</li>
            <li>Featured issues appear prominently on the magazine homepage</li>
            <li>Each issue needs a unique ID (recommended format: YYYY-MM-DD)</li>
            <li>Individual issue content is stored in separate configuration files</li>
          </ul>
        </div>
      </div>

      {/* Add/Edit Issue Modal */}
      {(showAddIssue || editingIssue) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {editingIssue ? 'Edit Magazine Issue' : 'Add New Magazine Issue'}
            </h3>
            
            <MagazineIssueForm
              issue={editingIssue || undefined}
              onSave={onSaveIssue}
              onCancel={onCancelEdit}
              isSaving={isSavingMagazine}
            />
          </div>
        </div>
      )}
    </>
  );
}