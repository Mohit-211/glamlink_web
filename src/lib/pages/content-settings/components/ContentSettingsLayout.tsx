'use client';

import { ContentSettingsTab } from '../types';

interface ContentSettingsLayoutProps {
  activeTab: ContentSettingsTab;
  onTabChange: (tab: ContentSettingsTab) => void;
  children: React.ReactNode;
}

export default function ContentSettingsLayout({ activeTab, onTabChange, children }: ContentSettingsLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Content Settings</h1>
            <p className="text-gray-600 mb-6">Manage page visibility and content for your website.</p>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mt-6">
              <button 
                onClick={() => onTabChange("visibility")} 
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "visibility" 
                    ? "border-glamlink-teal text-glamlink-teal" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Page Visibility
              </button>
              <button 
                onClick={() => onTabChange("content")} 
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "content" 
                    ? "border-glamlink-teal text-glamlink-teal" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Page Content
              </button>
              <button 
                onClick={() => onTabChange("magazine")} 
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "magazine" 
                    ? "border-glamlink-teal text-glamlink-teal" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Magazine Issues
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {children}
        </div>
      </div>
    </div>
  );
}