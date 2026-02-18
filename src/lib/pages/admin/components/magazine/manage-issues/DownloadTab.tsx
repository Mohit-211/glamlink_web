'use client';

import { useState, useEffect } from 'react';
import { MagazineIssue } from '@/lib/pages/magazine/types/magazine/core';
import magazineEditorService from '@/lib/pages/magazine/services/magazineEditorService';

interface DownloadTabProps {
  issues: MagazineIssue[];
}

export default function DownloadTab({ issues }: DownloadTabProps) {
  const [selectedIssueId, setSelectedIssueId] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [jsonPreview, setJsonPreview] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [includeSections, setIncludeSections] = useState(true);
  const [includeDigitalPages, setIncludeDigitalPages] = useState(true);
  const [transformData, setTransformData] = useState(false);
  const [isLoadingSections, setIsLoadingSections] = useState(false);
  const [sectionCount, setSectionCount] = useState(0);
  const [digitalPageCount, setDigitalPageCount] = useState(0);
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);

  // Transform data for creation (generate new IDs)
  const transformForCreation = (data: any) => {
    const transformed = { ...data };

    // Generate new issue ID (today's date in YYYY-MM-DD format)
    const today = new Date();
    const newIssueId = today.toISOString().split('T')[0];
    transformed.id = newIssueId;
    transformed.urlId = newIssueId;

    // Transform sections with new IDs
    if (transformed.sections && Array.isArray(transformed.sections)) {
      transformed.sections = transformed.sections.map((section: any, index: number) => ({
        ...section,
        id: `section-${Date.now()}-${index}`,
        issueId: newIssueId
      }));
    }

    // Transform digitalPages with new IDs
    if (transformed.digitalPages && Array.isArray(transformed.digitalPages)) {
      transformed.digitalPages = transformed.digitalPages.map((page: any, index: number) => ({
        ...page,
        id: `page-${Date.now()}-${index}`,
        issueId: newIssueId
      }));
    }

    return transformed;
  };

  // Fetch section and digital page counts when issue is selected
  useEffect(() => {
    const fetchCounts = async () => {
      if (!selectedIssueId) {
        setSectionCount(0);
        setDigitalPageCount(0);
        return;
      }

      setIsLoadingCounts(true);
      try {
        // Fetch sections count
        const sectionsResponse = await fetch(`/api/magazine/sections?issueId=${selectedIssueId}&skipLockChecks=true`, {
          credentials: 'include'
        });
        if (sectionsResponse.ok) {
          const sectionsData = await sectionsResponse.json();
          setSectionCount(sectionsData.sections?.length || 0);
        }

        // Fetch digital pages count
        const pagesResponse = await fetch(`/api/magazine/digital-pages?issueId=${selectedIssueId}`, {
          credentials: 'include'
        });
        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json();
          setDigitalPageCount(pagesData.pages?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setIsLoadingCounts(false);
      }
    };

    fetchCounts();
  }, [selectedIssueId]);

  const handlePreview = async () => {
    if (!selectedIssueId) return;

    setIsDownloading(true);
    setIsLoadingSections(includeSections);
    try {
      const issue = issues.find(i => i.id === selectedIssueId);
      if (issue) {
        let previewData: any = { ...issue };
        
        // If including sections, fetch them
        if (includeSections) {
          const response = await fetch(`/api/magazine/sections?issueId=${issue.id}&skipLockChecks=true`, {
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            const sections = data.sections || [];

            // Clean sections - remove lock-related fields
            const cleanSections = sections.map((section: any) => {
              const {
                lockedBy, lockedByEmail, lockedByName, lockedAt,
                lockExpiresAt, lockGroup, lockedTabId,
                isLockedByCurrentUser, canEdit,
                ...cleanSection
              } = section;
              return cleanSection;
            });

            previewData.sections = cleanSections;
          }
        }

        // If including digital pages, fetch them
        if (includeDigitalPages) {
          const response = await fetch(`/api/magazine/digital-pages?issueId=${issue.id}`, {
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            previewData.digitalPages = data.pages || [];
          }
        }
        
        // Remove editor-specific fields
        delete (previewData as any).visible;
        delete (previewData as any).isEmpty;

        // Apply transformation if requested
        if (transformData) {
          previewData = transformForCreation(previewData);
        }

        const jsonString = JSON.stringify(previewData, null, 2);
        setJsonPreview(jsonString);
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setIsDownloading(false);
      setIsLoadingSections(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedIssueId) return;

    const issue = issues.find(i => i.id === selectedIssueId);
    if (!issue) return;

    setIsLoadingSections(true);
    try {
      // Build the complete issue data
      let downloadData: any = { ...issue };
      delete downloadData.visible;
      delete downloadData.isEmpty;

      // Fetch sections if requested
      if (includeSections) {
        const response = await fetch(`/api/magazine/sections?issueId=${issue.id}&skipLockChecks=true`, {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          const sections = data.sections || [];

          // Clean sections - remove lock-related fields
          const cleanSections = sections.map((section: any) => {
            const {
              lockedBy,
              lockedByEmail,
              lockedByName,
              lockedAt,
              lockExpiresAt,
              lockGroup,
              lockedTabId,
              isLockedByCurrentUser,
              canEdit,
              ...cleanSection
            } = section;
            return cleanSection;
          });

          downloadData.sections = cleanSections;
        }
      }

      // Fetch digital pages if requested
      if (includeDigitalPages) {
        const response = await fetch(`/api/magazine/digital-pages?issueId=${issue.id}`, {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          downloadData.digitalPages = data.pages || [];
        }
      }

      // Apply transformation if requested
      if (transformData) {
        downloadData = transformForCreation(downloadData);
      }

      // Download the JSON file
      const jsonString = JSON.stringify(downloadData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = transformData
        ? `${downloadData.id}-new.json`
        : `${issue.id}-complete.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading issue:', error);
    } finally {
      setIsLoadingSections(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (jsonPreview) {
      navigator.clipboard.writeText(jsonPreview).then(() => {
        // Could add a toast notification here
        // Copied to clipboard
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    }
  };

  const selectedIssue = issues.find(i => i.id === selectedIssueId);

  return (
    <div className="space-y-6">
      {/* Issue Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Issue to Download
        </label>
        <select
          value={selectedIssueId}
          onChange={(e) => {
            setSelectedIssueId(e.target.value);
            setShowPreview(false);
            setJsonPreview('');
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
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Issue Details</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>ID:</strong> {selectedIssue.id}</p>
            <p><strong>Title:</strong> {selectedIssue.title}</p>
            <p><strong>Subtitle:</strong> {selectedIssue.subtitle}</p>
            <p><strong>Date:</strong> {selectedIssue.issueDate}</p>
            <p><strong>Issue Number:</strong> {selectedIssue.issueNumber}</p>
            <p><strong>Sections:</strong> {isLoadingCounts ? 'Loading...' : sectionCount}</p>
            <p><strong>Digital Pages:</strong> {isLoadingCounts ? 'Loading...' : digitalPageCount}</p>
            <p><strong>Status:</strong> 
              {selectedIssue.featured && <span className="ml-1 text-yellow-600">Featured</span>}
              {!selectedIssue.visible && <span className="ml-1 text-gray-500">(Hidden)</span>}
              {selectedIssue.isEmpty && <span className="ml-1 text-gray-500">(Empty)</span>}
              {selectedIssue.visible && !selectedIssue.isEmpty && <span className="ml-1 text-green-600">Published</span>}
            </p>
          </div>
        </div>
      )}

      {/* Download Options */}
      {selectedIssue && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md relative">
          {isLoadingCounts && (
            <div className="absolute inset-0 bg-blue-50 bg-opacity-75 flex items-center justify-center rounded-md">
              <div className="flex items-center space-x-2 text-blue-600">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-medium">Loading counts...</span>
              </div>
            </div>
          )}
          <h3 className="text-sm font-medium text-blue-900 mb-3">Download Options</h3>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeSections}
                onChange={(e) => setIncludeSections(e.target.checked)}
                className="mr-3 rounded border-gray-300 text-glamlink-teal focus:ring-glamlink-teal"
              />
              <span className="text-sm text-blue-700">
                Include sections in download
                <span className="ml-1 text-blue-600">
                  ({isLoadingCounts ? '...' : sectionCount} sections)
                </span>
              </span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeDigitalPages}
                onChange={(e) => setIncludeDigitalPages(e.target.checked)}
                className="mr-3 rounded border-gray-300 text-glamlink-teal focus:ring-glamlink-teal"
              />
              <span className="text-sm text-blue-700">
                Include digital pages in download
                <span className="ml-1 text-blue-600">
                  ({isLoadingCounts ? '...' : digitalPageCount} pages)
                </span>
              </span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={transformData}
                onChange={(e) => setTransformData(e.target.checked)}
                className="mr-3 rounded border-gray-300 text-glamlink-teal focus:ring-glamlink-teal"
              />
              <span className="text-sm text-blue-700">
                Transform data for creation
                {transformData && (
                  <span className="ml-1 text-blue-600">
                    (New IDs will be generated)
                  </span>
                )}
              </span>
            </label>

            {transformData && (
              <p className="text-xs text-blue-600 ml-6">
                All IDs will be regenerated. Issue ID will be today's date ({new Date().toISOString().split('T')[0]}). Ready for Create tab.
              </p>
            )}
            {!transformData && (includeSections || includeDigitalPages) && (
              <p className="text-xs text-blue-600 ml-6">
                The download will include{includeSections && ' sections'}{includeSections && includeDigitalPages && ' and'}{includeDigitalPages && ' digital pages'}. File will be named: {selectedIssue.id}-complete.json
              </p>
            )}
            {!transformData && !includeSections && !includeDigitalPages && (
              <p className="text-xs text-blue-600 ml-6">
                Only issue metadata will be downloaded. File will be named: {selectedIssue.id}.json
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handlePreview}
          disabled={!selectedIssueId || isDownloading || isLoadingCounts}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            !selectedIssueId || isDownloading || isLoadingCounts
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          {isLoadingCounts ? 'Loading...' : isDownloading ? (isLoadingSections ? 'Loading Sections...' : 'Generating...') : 'Preview JSON'}
        </button>
        <button
          onClick={handleDownload}
          disabled={!selectedIssueId || isLoadingSections || isLoadingCounts}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            !selectedIssueId || isLoadingSections || isLoadingCounts
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-glamlink-teal text-white hover:bg-glamlink-teal-dark'
          }`}
        >
          {isLoadingCounts ? 'Loading...' : isLoadingSections ? 'Downloading...' : 'Download as JSON'}
        </button>
      </div>

      {/* JSON Preview */}
      {showPreview && jsonPreview && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">JSON Preview</h3>
            <button
              onClick={handleCopyToClipboard}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
          <div className="relative">
            <pre className="w-full p-4 bg-gray-900 text-gray-100 rounded-md overflow-x-auto max-h-96 text-xs font-mono">
              {jsonPreview}
            </pre>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">How It Works</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Include sections:</strong> Download complete issue with all section content</li>
          <li>• <strong>Include digital pages:</strong> Download complete issue with all digital page configurations</li>
          <li>• <strong>Transform data:</strong> Generate new IDs for creating a duplicate issue (issue ID becomes today's date)</li>
          <li>• <strong>Preview JSON:</strong> View the data before downloading</li>
          <li>• <strong>Download as JSON:</strong> Save the issue to a file</li>
          <li>• <strong>Copy to Clipboard:</strong> Copy JSON for quick sharing</li>
        </ul>
        <p className="mt-2 text-xs text-gray-500">
          Files are named: {selectedIssueId ? (transformData ? `${new Date().toISOString().split('T')[0]}-new.json` : (includeSections || includeDigitalPages) ? `${selectedIssueId}-complete.json` : `${selectedIssueId}.json`) : '[issue-id].json or [issue-id]-complete.json'}
        </p>
      </div>
    </div>
  );
}