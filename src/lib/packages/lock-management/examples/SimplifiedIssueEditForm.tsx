'use client';

/**
 * Example: Simplified IssueEditForm using new Lock Management Package
 * 
 * This shows how the IssueEditForm would look after migration.
 * Goes from 100+ lines of lock logic to just 3 lines!
 */

import React, { useState } from 'react';
import { LockManager, EditableContent } from '../index';

// BEFORE: IssueEditForm had all this lock boilerplate
// ====================================================
// - 5 useEffects for timers and cleanup (lines 275-374)
// - Manual countdown state management
// - Lock acquisition logic
// - Refresh intervals
// - Multi-tab detection
// - Timer cleanup on unmount
// - Lock status calculation
// - Formatted time displays

interface EditorIssue {
  id: string;
  title: string;
  subtitle: string;
  // ... other fields (clean, no lock fields!)
}

interface SimplifiedIssueEditFormProps {
  issue?: EditorIssue;
  onSave: (data: Partial<EditorIssue>) => void;
}

// AFTER: Clean, focused on business logic
// ======================================
export function SimplifiedIssueEditForm({ issue, onSave }: SimplifiedIssueEditFormProps) {
  const [formData, setFormData] = useState<Partial<EditorIssue>>(issue || {});
  const [formSection, setFormSection] = useState<string>('basic-info');

  const handleInputChange = (field: keyof EditorIssue, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="issue-edit-form">
      {/* Section selector */}
      <select 
        value={formSection} 
        onChange={(e) => setFormSection(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="basic-info">Basic Information</option>
        <option value="cover-config">Cover Configuration</option>
        <option value="sections">Sections</option>
      </select>

      {/* Basic Info Section with Lock Management */}
      {formSection === 'basic-info' && (
        <LockManager
          resourceId={issue?.id || 'new'}
          collection="magazine_issues"
          lockGroup="issue-metadata" // Shared with cover-config
        >
          {({ lock, actions, isLoading }) => (
            <div>
              {/* Lock indicator shows automatically when needed */}
              {!lock.canEdit && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p>This section is being edited by {lock.holder?.userName}</p>
                  <p>Lock expires in {lock.formattedTime}</p>
                  {lock.canTransfer && (
                    <button 
                      onClick={() => actions.transfer()}
                      className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded"
                    >
                      Take Control
                    </button>
                  )}
                </div>
              )}
              
              {/* Form fields - disabled when locked */}
              <div className={lock.canEdit ? '' : 'opacity-50 pointer-events-none'}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </LockManager>
      )}

      {/* Cover Config Section - Same lock group, automatic coordination */}
      {formSection === 'cover-config' && (
        <LockManager
          resourceId={issue?.id || 'new'}
          collection="magazine_issues"
          lockGroup="issue-metadata" // Same group = shared lock!
        >
          {({ lock, actions }) => (
            <div>
              {!lock.canEdit ? (
                <div className="p-4 bg-yellow-50 rounded">
                  Cover configuration is locked by {lock.holder?.userName}
                </div>
              ) : (
                <div>
                  <h3>Cover Configuration</h3>
                  {/* Cover editing fields... */}
                </div>
              )}
            </div>
          )}
        </LockManager>
      )}

      {/* Sections - Individual locks per section */}
      {formSection === 'sections' && issue?.id && (
        <div className="space-y-4">
          {/* Example: Each section gets its own lock */}
          <EditableContent
            resourceId={`${issue.id}-section-1`}
            collection="magazine_sections"
            autoAcquire={true}
          >
            <div className="p-4 border rounded">
              <h4>Section 1: Cover Story</h4>
              {/* Section editing fields... */}
            </div>
          </EditableContent>

          <EditableContent
            resourceId={`${issue.id}-section-2`}
            collection="magazine_sections"
            autoAcquire={true}
          >
            <div className="p-4 border rounded">
              <h4>Section 2: Feature Article</h4>
              {/* Section editing fields... */}
            </div>
          </EditableContent>
        </div>
      )}

      {/* Save button */}
      <button
        onClick={() => onSave(formData)}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
}

// COMPARISON:
// ==========
// Before: ~400 lines with complex lock logic
// After:  ~120 lines focused on business logic
// 
// Before: 5 useEffects, manual timers, cleanup logic
// After:  Zero useEffects - all handled by LockManager
//
// Before: Manual lock state calculation and UI
// After:  Automatic lock indicators and state management
//
// Before: Custom countdown formatting and refresh logic  
// After:  Built-in countdown and auto-refresh
//
// REUSABILITY:
// ============
// This same pattern works for ANY editable resource:
// - Magazine downloads: LockManager for download generation
// - User profiles: LockManager for profile editing
// - Settings pages: LockManager for configuration
// - Product editing: LockManager for product management
//
// NO MORE COPY-PASTE LOCK LOGIC! 🎉

export default SimplifiedIssueEditForm;