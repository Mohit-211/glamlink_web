'use client';

import Link from 'next/link';

export default function AccessDenied() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Access Denied</h1>

            <p className="text-center text-gray-600 mb-6">You don't have permission to access this page.</p>

            <p className="text-center text-sm text-gray-500">This page is restricted to authorized administrators only.</p>

            <div className="mt-6 text-center">
              <Link href="/" className="text-glamlink-teal hover:text-glamlink-teal-dark font-medium">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}