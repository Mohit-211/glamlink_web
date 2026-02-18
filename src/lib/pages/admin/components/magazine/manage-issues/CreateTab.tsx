"use client";

import { useState, useRef } from "react";
import magazineEditorService from "@/lib/pages/magazine/services/magazineEditorService";

interface CreateTabProps {
  onSuccess: () => void;
}

export default function CreateTab({ onSuccess }: CreateTabProps) {
  const [jsonContent, setJsonContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationInfo, setValidationInfo] = useState<string | null>(null);
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

    if (!file.name.endsWith(".json")) {
      setError("Please select a JSON file");
      return;
    }

    try {
      const text = await file.text();
      setJsonContent(text);
      
      // Validate JSON and check for sections
      if (!validateJsonContent(text)) {
        setError("Invalid JSON file format");
      }
    } catch (error) {
      setError("Invalid JSON file format");
      setJsonContent("");
      setValidationInfo(null);
    }
  };

  const handleJsonSubmit = async () => {
    if (!jsonContent.trim()) {
      setError("Please provide JSON content");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const issueData = JSON.parse(jsonContent);

      // Validate required fields
      if (!issueData.id || !issueData.title) {
        throw new Error('JSON must include "id" and "title" fields');
      }

      // Check if sections or digitalPages are included
      const hasSections = issueData.sections && Array.isArray(issueData.sections) && issueData.sections.length > 0;
      const hasDigitalPages = issueData.digitalPages && Array.isArray(issueData.digitalPages) && issueData.digitalPages.length > 0;

      if (hasSections || hasDigitalPages) {
        console.log(`Creating issue with ${issueData.sections?.length || 0} sections and ${issueData.digitalPages?.length || 0} digital pages`);
        // Use the new method that handles sections AND digital pages
        await magazineEditorService.createIssueWithSectionsAndDigitalPages(issueData);
      } else {
        console.log('Creating issue without sections or digital pages');
        // Use the regular method for issue-only creation
        await magazineEditorService.createIssue(issueData);
      }
      
      onSuccess();
    } catch (error: any) {
      setError(error.message || "Failed to create issue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Use the "Add Issue" button in the main table for form-based creation.
          This tab is for JSON-based bulk import with sections and digital pages.
        </p>
      </div>

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

      {/* JSON Method */}
      <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload JSON File</label>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Or Paste JSON Content</label>
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
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal font-mono text-sm"
              placeholder={`{
  "id": "2025-08-11",
  "title": "Issue Title",
  "subtitle": "Issue Subtitle",
  "issueNumber": 5,
  "issueDate": "2025-08-11",
  "coverImage": "/images/cover.jpg",
  "featured": false,
  "sections": [
    {
      "id": "section-1",
      "title": "Section Title",
      "type": "custom-section",
      "order": 0,
      "content": {}
    }
  ],
  "digitalPages": [
    {
      "id": "page-1",
      "order": 0,
      "config": {
        "layoutType": "cover",
        "content": {}
      }
    }
  ]
}`}
            />
          </div>

          <button
            onClick={handleJsonSubmit}
            disabled={isLoading || !jsonContent.trim()}
            className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${isLoading || !jsonContent.trim() ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-glamlink-teal text-white hover:bg-glamlink-teal-dark"}`}
          >
            {isLoading ? "Creating..." : "Create Issue from JSON"}
          </button>
      </div>
    </div>
  );
}
