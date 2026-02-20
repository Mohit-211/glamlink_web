"use client";

import { Trash, Info, AlertTriangle } from "lucide-react";
import type { UseAccountManagementReturn } from "../types";

interface DeleteAccountProps extends UseAccountManagementReturn {}

export default function DeleteAccount({}: DeleteAccountProps) {
  return (
    <div className="space-y-6">
      {/* Coming Soon Banner */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900">Coming Soon</h3>
            <p className="text-sm text-blue-700 mt-1">
              Account deletion functionality is currently in development and requires infrastructure setup.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Preview */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Delete Your Account</h3>
        <p className="text-sm text-gray-600">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
      </div>

      {/* What Will Happen */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-red-900 mb-2">When you delete your account:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• All your brand data will be permanently deleted</li>
              <li>• Products, services, and portfolio images will be removed</li>
              <li>• Customer reviews and messages will be deleted</li>
              <li>• You'll have 30 days to cancel the deletion</li>
              <li>• This action cannot be undone after 30 days</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Planned Features */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Planned Features:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 30-day grace period before permanent deletion</li>
          <li>• Email reminders during grace period</li>
          <li>• Ability to cancel deletion request</li>
          <li>• Export data before deletion</li>
          <li>• Feedback collection to improve service</li>
        </ul>
      </div>

      {/* Infrastructure Requirements */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h4 className="text-sm font-medium text-amber-900 mb-2">Required Infrastructure:</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Scheduled task runner (Cloud Scheduler + Cloud Functions)</li>
          <li>• Transactional email service (SendGrid or AWS SES)</li>
          <li>• Grace period management system</li>
          <li>• Automated reminder emails</li>
        </ul>
      </div>

      {/* Placeholder Button */}
      <div className="flex justify-end">
        <button
          disabled
          className="px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-lg cursor-not-allowed flex items-center gap-2"
        >
          <Trash className="w-4 h-4" />
          Delete Account (Coming Soon)
        </button>
      </div>
    </div>
  );
}
