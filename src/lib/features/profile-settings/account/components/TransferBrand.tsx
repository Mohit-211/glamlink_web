"use client";

import { UserPlus, Info } from "lucide-react";
import type { UseAccountManagementReturn } from "../types";

interface TransferBrandProps extends UseAccountManagementReturn {}

export default function TransferBrand({}: TransferBrandProps) {
  return (
    <div className="space-y-6">
      {/* Coming Soon Banner */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900">Coming Soon</h3>
            <p className="text-sm text-blue-700 mt-1">
              Brand transfer functionality is currently in development and requires infrastructure setup.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Preview */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Transfer Brand Ownership</h3>
        <p className="text-sm text-gray-600">
          Transfer your brand to another user while preserving all data, products, and customer relationships.
        </p>
      </div>

      {/* What Will Be Available */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Planned Features:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Transfer brand ownership to another email address</li>
          <li>• Include optional message for the new owner</li>
          <li>• 7-day acceptance window for transfers</li>
          <li>• Automatic email notifications</li>
          <li>• Preserve all brand data during transfer</li>
          <li>• Ability to cancel pending transfers</li>
        </ul>
      </div>

      {/* Transfer Process */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">How It Will Work:</h4>
        <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
          <li>Enter the new owner's email address and optional message</li>
          <li>Transfer request is sent to the new owner via email</li>
          <li>New owner has 7 days to accept or reject the transfer</li>
          <li>Upon acceptance, brand ownership is transferred</li>
          <li>You lose access to the brand, new owner gains full control</li>
        </ol>
      </div>

      {/* Infrastructure Requirements */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h4 className="text-sm font-medium text-amber-900 mb-2">Required Infrastructure:</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Transactional email service (SendGrid or AWS SES)</li>
          <li>• Transfer token generation and validation</li>
          <li>• Atomic ownership change operations</li>
          <li>• Email notification templates</li>
        </ul>
      </div>

      {/* Placeholder Button */}
      <div className="flex justify-end">
        <button
          disabled
          className="px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-lg cursor-not-allowed flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Transfer Brand (Coming Soon)
        </button>
      </div>
    </div>
  );
}
