"use client";

import { useRouter } from "next/navigation";

export interface AuthNotAuthenticatedProps {
  featureName: string;
  redirectTo: string;
}

export default function AuthNotAuthenticated({ featureName, redirectTo }: AuthNotAuthenticatedProps) {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push(redirectTo);
  };

  const handleGoHomeClick = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center">
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Login Required</h2>
          <p className="mt-2 text-gray-600">
            You need to be logged in to access {featureName}.
          </p>
          <div className="mt-6 space-y-3">
            <button
              onClick={handleLoginClick}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-glamlink-teal hover:bg-glamlink-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal transition-colors duration-200"
            >
              Login
            </button>
            <button
              onClick={handleGoHomeClick}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal transition-colors duration-200"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}