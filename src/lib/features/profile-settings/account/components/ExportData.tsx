"use client";

import { Download, Info } from "lucide-react";
import type { UseAccountManagementReturn } from "../types";

interface ExportDataProps extends UseAccountManagementReturn {}

export default function ExportData({}: ExportDataProps) {
  return (
    <div className="space-y-6">
      {/* Coming Soon Banner */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900">Coming Soon</h3>
            <p className="text-sm text-blue-700 mt-1">
              Data export functionality is currently in development and requires infrastructure setup.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Preview */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Export Your Data</h3>
        <p className="text-sm text-gray-600">
          Download a complete copy of your brand data including products, services, portfolio images, reviews, and more.
        </p>
      </div>

      {/* What Will Be Available */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Planned Features:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Export data in JSON, CSV, or ZIP format</li>
          <li>• Select which data categories to include</li>
          <li>• Download complete archives with images</li>
          <li>• GDPR-compliant data portability</li>
          <li>• Scheduled automatic exports</li>
        </ul>
      </div>

      {/* Infrastructure Requirements */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h4 className="text-sm font-medium text-amber-900 mb-2">Required Infrastructure:</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Background job processing system (Firebase Cloud Functions or Bull/BullMQ)</li>
          <li>• Large file streaming and signed URL generation</li>
          <li>• Data aggregation and compression services</li>
        </ul>
      </div>

      {/* Placeholder Button */}
      <div className="flex justify-end">
        <button
          disabled
          className="px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-lg cursor-not-allowed flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Data (Coming Soon)
        </button>
      </div>
    </div>
  );
}
