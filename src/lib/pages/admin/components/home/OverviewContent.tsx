"use client";

import { useAuth } from "@/lib/features/auth/useAuth";

export default function OverviewContent() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome to the Admin Panel
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Hello, {user?.displayName || user?.email}!
      </p>

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 mt-2 bg-glamlink-teal rounded-full"></div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Manage Promos</h3>
              <p className="text-sm text-gray-600">Create and manage promotional campaigns</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 mt-2 bg-glamlink-purple rounded-full"></div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Get Featured</h3>
              <p className="text-sm text-gray-600">Review and approve feature requests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
