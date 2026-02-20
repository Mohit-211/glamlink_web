"use client";

import StatCard from "./StatCard";
import { useProfileAnalyticsTab, type DateRangeOption } from "./useProfileAnalyticsTab";

export default function ProfileAnalyticsTab() {
  const {
    isLoading,
    dateRange,
    setDateRange,
    hasProfessional,
    displayAnalytics,
  } = useProfileAnalyticsTab();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glamlink-teal"></div>
      </div>
    );
  }

  if (!hasProfessional) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Analytics Available
          </h2>
          <p className="text-gray-600 mb-6">
            Analytics will be available once your Digital Business Card profile is set up and linked to your account.
          </p>
          <a
            href="mailto:support@glamlink.net?subject=Digital Card Setup Request"
            className="inline-flex items-center px-4 py-2 bg-glamlink-teal text-white rounded-lg hover:bg-glamlink-teal-dark transition-colors"
          >
            Contact Support
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with Date Range Selector */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Track engagement on your Digital Business Card</p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === range
                  ? "bg-glamlink-teal text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Views"
          value={displayAnalytics.totalViews.toLocaleString()}
          icon={
            <svg className="h-6 w-6 text-glamlink-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
        <StatCard
          label="Unique Visitors"
          value={displayAnalytics.uniqueVisitors.toLocaleString()}
          icon={
            <svg className="h-6 w-6 text-glamlink-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          label="Total Clicks"
          value={displayAnalytics.totalClicks.toLocaleString()}
          icon={
            <svg className="h-6 w-6 text-glamlink-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          }
        />
        <StatCard
          label="Engagement Rate"
          value={`${displayAnalytics.engagementRate.toFixed(1)}%`}
          icon={
            <svg className="h-6 w-6 text-glamlink-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      {/* Click Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Click Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Book", value: displayAnalytics.clickBreakdown.book, color: "bg-blue-500" },
            { label: "Call", value: displayAnalytics.clickBreakdown.call, color: "bg-green-500" },
            { label: "Text", value: displayAnalytics.clickBreakdown.text, color: "bg-purple-500" },
            { label: "Website", value: displayAnalytics.clickBreakdown.website, color: "bg-orange-500" },
            { label: "Instagram", value: displayAnalytics.clickBreakdown.instagram, color: "bg-pink-500" },
            { label: "TikTok", value: displayAnalytics.clickBreakdown.tiktok, color: "bg-gray-800" },
            { label: "Save", value: displayAnalytics.clickBreakdown.save, color: "bg-yellow-500" },
            { label: "Copy URL", value: displayAnalytics.clickBreakdown.copyUrl, color: "bg-cyan-500" },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{item.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
