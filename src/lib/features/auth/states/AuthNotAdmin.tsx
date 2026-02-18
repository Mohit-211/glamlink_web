"use client";

import { useRouter } from "next/navigation";
import { User } from "../config";

export interface AuthNotAdminProps {
  featureName: string;
  user: User | null;
}

export default function AuthNotAdmin({ featureName, user }: AuthNotAdminProps) {
  const router = useRouter();

  const handleGoToProfileClick = () => {
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">
            You don't have permission to access {featureName}.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Current user: {user?.email}
          </p>
          <div className="mt-6">
            <button
              onClick={handleGoToProfileClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-glamlink-teal hover:bg-glamlink-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal transition-colors duration-200"
            >
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}