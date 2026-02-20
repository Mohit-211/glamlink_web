/**
 * Campaign List Component
 *
 * Main campaign management page with:
 * - Tab filtering (All, Email, SMS)
 * - Campaign table with metrics
 * - Create campaign modal
 * - Search functionality
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/features/auth/useAuth';
import { useCampaigns } from '@/lib/features/crm/marketing/hooks';
import { Campaign, CampaignType } from '@/lib/features/crm/marketing/types';
import { StatusBadge } from '../shared/StatusBadge';
import { formatDate } from '@/lib/features/crm/marketing/utils/formatHelpers';
import { CreateCampaignModal } from './CreateCampaignModal';

type TabFilter = 'all' | 'email' | 'sms';

export function CampaignList() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Get brandId from user
  const brandId = (user as any)?.brandId || 'test-brand-123';

  const { campaigns, loading, error } = useCampaigns(brandId);

  // Filter campaigns by tab
  const filteredByTab = campaigns.filter(c => {
    if (activeTab === 'all') return true;
    return c.type === activeTab;
  });

  // Filter by search query
  const filteredCampaigns = filteredByTab.filter(c => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(query) ||
      c.subject?.toLowerCase().includes(query)
    );
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to view campaigns</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Messaging</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {/* TODO: Open automation creator */}}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Create automation
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Create campaign
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error loading campaigns: {error.message}</p>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex space-x-6">
          {(['all', 'email', 'sms'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                pb-3 text-sm font-medium border-b-2 -mb-px transition-colors
                ${activeTab === tab
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }
              `}
            >
              {tab === 'all' ? 'All' : tab.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2 pb-3">
          <input
            type="search"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Channel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Delivery</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Open rate</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Click rate</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sales</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              // Loading skeleton
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4" colSpan={9}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : filteredCampaigns.length === 0 ? (
              // Empty state
              <tr>
                <td className="px-6 py-12 text-center text-gray-500" colSpan={9}>
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="font-medium text-gray-900 mb-1">
                      {searchQuery ? 'No campaigns found' : 'No campaigns yet'}
                    </p>
                    <p className="text-sm">
                      {searchQuery ? 'Try adjusting your search' : 'Create your first campaign to start reaching customers'}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="mt-4 px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                      >
                        Create campaign
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              // Campaign rows
              filteredCampaigns.map((campaign) => (
                <CampaignRow key={campaign.id} campaign={campaign} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <CreateCampaignModal
          brandId={brandId}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}

/**
 * Campaign Row Component
 */
function CampaignRow({ campaign }: { campaign: Campaign }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <Link
          href={`/profile/marketing/campaigns/${campaign.id}`}
          className="flex items-center space-x-3"
        >
          {/* Email thumbnail preview */}
          <div className="w-10 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-400">
            ✉️
          </div>
          <div>
            <div className="font-medium text-gray-900 hover:text-pink-600">
              {campaign.subject || campaign.name}
            </div>
            {campaign.status === 'draft' && (
              <div className="text-xs text-gray-500">Draft</div>
            )}
          </div>
        </Link>
      </td>
      <td className="px-6 py-4 text-gray-500 capitalize">{campaign.type}</td>
      <td className="px-6 py-4">
        <StatusBadge status={campaign.status} />
      </td>
      <td className="px-6 py-4 text-gray-500">
        {campaign.scheduledAt ? formatDate(campaign.scheduledAt) : '—'}
      </td>
      <td className="px-6 py-4 text-right text-gray-900">
        {campaign.metrics.deliveryRate > 0 ? `${campaign.metrics.deliveryRate.toFixed(1)}%` : '—'}
      </td>
      <td className="px-6 py-4 text-right text-gray-900">
        {campaign.metrics.openRate > 0 ? `${campaign.metrics.openRate.toFixed(1)}%` : '—'}
      </td>
      <td className="px-6 py-4 text-right text-gray-900">
        {campaign.metrics.clickRate > 0 ? `${campaign.metrics.clickRate.toFixed(1)}%` : '—'}
      </td>
      <td className="px-6 py-4 text-right text-gray-900">
        {campaign.metrics.revenue > 0 ? `$${campaign.metrics.revenue.toFixed(2)}` : '—'}
      </td>
      <td className="px-6 py-4">
        <button className="p-1 hover:bg-gray-100 rounded">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
