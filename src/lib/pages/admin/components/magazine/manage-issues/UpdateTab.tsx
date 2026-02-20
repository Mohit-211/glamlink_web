'use client';

import { useState, useRef } from 'react';
import { MagazineIssue } from '@/lib/pages/magazine/types/magazine/core';
import magazineEditorService from '@/lib/pages/magazine/services/magazineEditorService';

interface UpdateTabProps {
  issues: MagazineIssue[];
  onSuccess: () => void;
}

export default function UpdateTab({ issues, onSuccess }: UpdateTabProps) {
  const [selectedIssueId, setSelectedIssueId] = useState<string>('');
  const [jsonContent, setJsonContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationInfo, setValidationInfo] = useState<string | null>(null);
  const [replaceSections, setReplaceSections] = useState(false);
  const [replaceDigitalPages, setReplaceDigitalPages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateJsonContent = (content: string) => {
    try {
      const data = JSON.parse(content);

      let info = "✓ Valid JSON";
      if (data.sections && Array.isArray(data.sections)) {
        info += ` with ${data.sections.length} section(s)`;
      }
      if (data.digitalPages && Array.isArray(data.digitalPages)) {
        info += ` and ${data.digitalPages.length} digital page(s)`;
      }
      if (!data.sections && !data.digitalPages) {
        info += " (issue metadata only)";
      }

      setValidationInfo(info);
      setError(null);
      return true;
    } catch (e) {
      setValidationInfo(null);
      return false;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setError('Please select a JSON file');
      return;
    }

    try {
      const text = await file.text();
      setJsonContent(text);
      
      // Validate JSON and check for sections
      if (!validateJsonContent(text)) {
        setError('Invalid JSON file format');
      }
    } catch (error) {
      setError('Invalid JSON file format');
      setJsonContent('');
      setValidationInfo(null);
    }
  };

  const handleUpdate = async () => {
    if (!selectedIssueId) {
      setError('Please select an issue to update');
      return;
    }

    if (!jsonContent.trim()) {
      setError('Please provide JSON content');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const issueData = JSON.parse(jsonContent);

      // Check if we should replace sections or digital pages
      if (replaceSections || replaceDigitalPages) {
        console.log(`Replacing issue - Sections: ${replaceSections}, Digital Pages: ${replaceDigitalPages}`);
        // Use the new method that handles sections AND digital pages replacement
        await magazineEditorService.replaceIssueWithSectionsAndDigitalPages(
          selectedIssueId,
          issueData,
          replaceSections,
          replaceDigitalPages
        );
      } else {
        console.log('Updating issue metadata only');
        // Use the regular method that only updates metadata
        await magazineEditorService.replaceIssue(selectedIssueId, issueData);
      }
      
      onSuccess();
    } catch (error: any) {
      setError(error.message || 'Failed to update issue');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedIssue = issues.find(i => i.id === selectedIssueId);

  return (
    <div className="space-y-6">
      {/* Issue Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Issue to Update
        </label>
        <select
          value={selectedIssueId}
          onChange={(e) => {
            setSelectedIssueId(e.target.value);
            setError(null);
            setJsonContent('');
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
        >
          <option value="">Choose an issue...</option>
          {issues.map(issue => (
            <option key={issue.id} value={issue.id}>
              Issue #{issue.issueNumber} - {issue.title}
              {issue.featured && ' ⭐'}
              {!issue.visible && ' (Hidden)'}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Issue Info */}
      {selectedIssue && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Current Issue Information</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>ID:</strong> {selectedIssue.id}</p>
            <p><strong>Title:</strong> {selectedIssue.title}</p>
            <p><strong>Date:</strong> {selectedIssue.issueDate}</p>
            <p><strong>Sections:</strong> {selectedIssue.sections?.length || 0}</p>
          </div>
        </div>
      )}

      {/* Update Options */}
      {selectedIssue && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Update Options</h3>

          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={replaceSections}
                onChange={(e) => setReplaceSections(e.target.checked)}
                className="mr-3 rounded border-gray-300 text-glamlink-teal focus:ring-glamlink-teal"
              />
              <span className="text-sm text-gray-700">
                Replace sections
                {replaceSections && (
                  <span className="ml-1 text-orange-600">
                    (Warning: This will delete all existing sections)
                  </span>
                )}
              </span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={replaceDigitalPages}
                onChange={(e) => setReplaceDigitalPages(e.target.checked)}
                className="mr-3 rounded border-gray-300 text-glamlink-teal focus:ring-glamlink-teal"
              />
              <span className="text-sm text-gray-700">
                Replace digital pages
                {replaceDigitalPages && (
                  <span className="ml-1 text-orange-600">
                    (Warning: This will delete all existing digital pages)
                  </span>
                )}
              </span>
            </label>

            {!replaceSections && !replaceDigitalPages && (
              <p className="text-xs text-gray-600 ml-6">
                Only issue metadata will be updated. Sections and digital pages will remain unchanged.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Validation Info */}
      {validationInfo && !error && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{validationInfo}</p>
        </div>
      )}

      {/* File Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Replacement JSON File
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          disabled={!selectedIssueId}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {!selectedIssueId && (
          <p className="mt-1 text-xs text-gray-500">Select an issue first</p>
        )}
      </div>

      {/* JSON Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or Paste Replacement JSON Content
        </label>
        <textarea
          value={jsonContent}
          onChange={(e) => {
            const newContent = e.target.value;
            setJsonContent(newContent);
            setError(null);
            
            // Validate on change if content is not empty
            if (newContent.trim()) {
              validateJsonContent(newContent);
            } else {
              setValidationInfo(null);
            }
          }}
          disabled={!selectedIssueId}
          rows={12}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal font-mono text-sm disabled:opacity-50 disabled:bg-gray-50"
          placeholder={selectedIssueId ? `{
  "id": "${selectedIssueId}",
  "title": "Updated Title",
  "subtitle": "Updated Subtitle",
  "sections": [
    {
      "title": "Section Title",
      "type": "custom-section",
      "order": 0,
      "content": {}
    }
  ]
}` : 'Select an issue first'}
        />
      </div>

      {/* Warning Message */}
      {selectedIssueId && jsonContent && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Warning:</strong> 
            {replaceSections 
              ? " This will completely replace all data for the selected issue INCLUDING ALL SECTIONS. All existing sections will be deleted and replaced with the JSON content."
              : " This will replace the issue metadata only. Sections will remain unchanged unless 'Replace sections' is checked."}
          </p>
        </div>
      )}

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        disabled={isLoading || !selectedIssueId || !jsonContent.trim()}
        className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
          isLoading || !selectedIssueId || !jsonContent.trim()
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-glamlink-teal text-white hover:bg-glamlink-teal-dark'
        }`}
      >
        {isLoading ? 'Updating...' : 'Replace Issue Content'}
      </button>
    </div>
  );
}