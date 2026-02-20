"use client";

import { Settings, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { UseAccountManagementReturn } from "../types";
import PauseAccount from "./PauseAccount";
import ExportData from "./ExportData";
import DeleteAccount from "./DeleteAccount";
import TransferBrand from "./TransferBrand";

interface AccountManagementSectionProps extends UseAccountManagementReturn {}

export default function AccountManagementSection(props: AccountManagementSectionProps) {
  const [activeTab, setActiveTab] = useState<'pause' | 'export' | 'transfer' | 'delete'>('pause');

  if (props.isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-400" />
            Account Management
          </h2>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading account settings...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-400" />
          Account Management
        </h2>
        <p className="text-sm text-gray-500 mt-1">Manage your data, account status, and brand</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Error Message */}
        {props.error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{props.error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('pause')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'pause'
                  ? 'border-glamlink-teal text-glamlink-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pause Account
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'export'
                  ? 'border-glamlink-teal text-glamlink-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Export Data
            </button>
            <button
              onClick={() => setActiveTab('transfer')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'transfer'
                  ? 'border-glamlink-teal text-glamlink-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Transfer Brand
            </button>
            <button
              onClick={() => setActiveTab('delete')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'delete'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-red-700 hover:border-red-300'
              }`}
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'pause' && <PauseAccount {...props} />}
          {activeTab === 'export' && <ExportData {...props} />}
          {activeTab === 'transfer' && <TransferBrand {...props} />}
          {activeTab === 'delete' && <DeleteAccount {...props} />}
        </div>
      </div>
    </div>
  );
}
