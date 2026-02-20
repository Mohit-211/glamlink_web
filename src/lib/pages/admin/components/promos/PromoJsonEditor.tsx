"use client";

import { useState, useEffect } from "react";
import { PromoItem } from "@/lib/features/promos/config";
import { validatePromoData } from "./config";

interface PromoJsonEditorProps {
  data: Partial<PromoItem>;
  onChange: (data: Partial<PromoItem>) => void;
  onValidationError: (errors: string[]) => void;
}

export default function PromoJsonEditor({ data, onChange, onValidationError }: PromoJsonEditorProps) {
  const [jsonText, setJsonText] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showExample, setShowExample] = useState(false);

  // Sync JSON text with data changes
  useEffect(() => {
    try {
      const formattedJson = JSON.stringify(data, null, 2);
      setJsonText(formattedJson);
      setValidationErrors([]);
    } catch (error) {
      setValidationErrors(["Invalid JSON format"]);
    }
  }, [data]);

  // Handle JSON text changes with real-time validation
  const handleJsonChange = (value: string) => {
    setJsonText(value);

    try {
      const parsedData = JSON.parse(value);
      const validation = validatePromoData(parsedData);

      setValidationErrors(validation.errors);
      onValidationError(validation.errors);

      if (validation.isValid) {
        onChange(parsedData);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid JSON";
      setValidationErrors([errorMessage]);
      onValidationError([errorMessage]);
    }
  };

  // Format JSON
  const handleFormatJson = () => {
    try {
      const parsedData = JSON.parse(jsonText);
      const formattedJson = JSON.stringify(parsedData, null, 2);
      setJsonText(formattedJson);
    } catch (error) {
      // Keep current text if invalid
    }
  };

  // Copy JSON to clipboard
  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy JSON:", error);
    }
  };

  // Load example
  const handleLoadExample = (exampleType: 'giftCard' | 'serviceDiscount') => {
    import("./config").then((config) => {
      const example = config.promoExamples[exampleType];
      const formattedJson = JSON.stringify(example, null, 2);
      setJsonText(formattedJson);
      setValidationErrors([]);
    });
  };

  // Clear JSON
  const handleClearJson = () => {
    setJsonText("{}");
    setValidationErrors([]);
    onChange({});
  };

  return (
    <div className="space-y-4">
      {/* JSON Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">JSON Editor</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowExample(!showExample)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            {showExample ? "Hide Examples" : "Show Examples"}
          </button>
          <button
            onClick={handleFormatJson}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            Format JSON
          </button>
          <button
            onClick={handleCopyJson}
            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
          >
            Copy JSON
          </button>
          <button
            onClick={handleClearJson}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Example Templates */}
      {showExample && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Example Templates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => handleLoadExample('giftCard')}
              className="text-left p-3 bg-white rounded border border-gray-300 hover:border-blue-500 transition-colors"
            >
              <div className="font-medium text-gray-900">Gift Card Giveaway</div>
              <div className="text-sm text-gray-600">Amazon gift card promotion</div>
            </button>
            <button
              onClick={() => handleLoadExample('serviceDiscount')}
              className="text-left p-3 bg-white rounded border border-gray-300 hover:border-blue-500 transition-colors"
            >
              <div className="font-medium text-gray-900">Service Discount</div>
              <div className="text-sm text-gray-600">Hair services promotion</div>
            </button>
          </div>
        </div>
      )}

      {/* JSON Editor */}
      <div>
        <label htmlFor="json-editor" className="block text-sm font-medium text-gray-700 mb-2">
          Promo Data (JSON)
        </label>
        <textarea
          id="json-editor"
          value={jsonText}
          onChange={(e) => handleJsonChange(e.target.value)}
          className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-glamlink-teal focus:border-transparent"
          placeholder="Enter promo data as JSON..."
          spellCheck={false}
        />
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <h4 className="text-sm font-medium text-red-800 mb-2">Validation Errors:</h4>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Schema Reference */}
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Schema Reference:</h4>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{`{
  "title": "string (required)",
  "subtitle": "string (optional)",
  "descriptionShort": "string (optional)",
  "description": "string (HTML, optional)",
  "modalContentHeader": "string (optional)",
  "image": "string (required)",
  "link": "string (URL, required)",
  "ctaText": "string (required)",
  "popupDisplay": "string (required)",
  "startDate": "YYYY-MM-DD (required)",
  "endDate": "YYYY-MM-DD (required)",
  "category": "string (optional)",
  "discount": "string | null (optional)",
  "modalStatusBadge": "string (optional)",
  "modalCategoryBadge": "string (optional)",
  "priority": "number (1-10, optional)",
  "visible": "boolean (default: true)",
  "featured": "boolean (default: false)"
}`}
        </pre>
      </div>
    </div>
  );
}