"use client";

import Link from "next/link";

// Card icon
const CardIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
  </svg>
);

// Analytics icon
const ChartIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

// Arrow icon
const ArrowRightIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

interface OverviewContentProps {
  userName: string;
}

export default function OverviewContent({ userName }: OverviewContentProps) {
  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to My Profile
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Hello, {userName}!
        </p>
      </div>

      {/* Getting Started Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Getting Started
        </h2>
        <div className="space-y-4">
          {/* Digital Business Card */}
          <Link
            href="/profile/digital-card"
            className="group flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-glamlink-teal/10 rounded-lg group-hover:bg-glamlink-teal/20 transition-colors">
              <CardIcon className="h-5 w-5 text-glamlink-teal" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 group-hover:text-glamlink-teal transition-colors">
                Digital Business Card
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Edit your professional profile, update your bio, add portfolio items, and customize how your Digital Business Card appears to clients.
              </p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-glamlink-teal group-hover:translate-x-1 transition-all mt-1" />
          </Link>

          {/* Analytics Dashboard */}
          <Link
            href="/profile/analytics"
            className="group flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-glamlink-teal/10 rounded-lg group-hover:bg-glamlink-teal/20 transition-colors">
              <ChartIcon className="h-5 w-5 text-glamlink-teal" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 group-hover:text-glamlink-teal transition-colors">
                Analytics Dashboard
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Track engagement on your Digital Business Card. See how many people view your profile, click your booking link, and discover which traffic sources work best.
              </p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-glamlink-teal group-hover:translate-x-1 transition-all mt-1" />
          </Link>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Need Help?
        </h3>
        <p className="text-gray-600 text-sm">
          If you have questions about managing your profile or understanding your analytics,
          please reach out to our support team. We&apos;re here to help you succeed!
        </p>
        <a
          href="mailto:support@glamlink.net"
          className="mt-3 inline-flex items-center text-glamlink-teal hover:text-glamlink-teal/80 font-medium text-sm"
        >
          Contact Support
          <ArrowRightIcon className="ml-1 h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
