/**
 * Marketing Activities Component
 *
 * Displays summary of marketing app activities.
 */

'use client';

import Link from 'next/link';
import { useCampaigns } from '@/lib/features/crm/marketing/hooks';
import { StatusBadge } from '../shared/StatusBadge';

interface MarketingActivitiesProps {
  brandId: string;
}

export function MarketingActivities({ brandId }: MarketingActivitiesProps) {
  const { campaigns, loading } = useCampaigns(brandId);

  // Group by app type
  const messagingCampaigns = campaigns.filter(c => c.type === 'email' || c.type === 'sms');

  const draftCount = messagingCampaigns.filter(c => c.status === 'draft').length;
  const sendingCount = messagingCampaigns.filter(c => c.status === 'sending').length;
  const activeCount = messagingCampaigns.filter(c => c.status === 'active').length;

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Marketing app activities</h2>
        <Link
          href="/profile/marketing/campaigns"
          className="text-sm text-pink-600 hover:text-pink-700"
        >
          Explore apps
        </Link>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">App</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activities in progress</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last activity</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td className="px-6 py-4" colSpan={3}>
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </td>
            </tr>
          ) : (
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Messaging</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  {draftCount > 0 && (
                    <StatusBadge status="draft" count={draftCount} />
                  )}
                  {sendingCount > 0 && (
                    <StatusBadge status="sending" count={sendingCount} />
                  )}
                  {activeCount > 0 && (
                    <StatusBadge status="active" count={activeCount} />
                  )}
                  {draftCount === 0 && sendingCount === 0 && activeCount === 0 && (
                    <span className="text-gray-500">No activities</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-gray-500">
                {messagingCampaigns[0]?.updatedAt
                  ? new Date(messagingCampaigns[0].updatedAt).toLocaleDateString()
                  : '—'
                }
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
