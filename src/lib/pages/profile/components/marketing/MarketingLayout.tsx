/**
 * Marketing Layout
 *
 * Layout component with sub-navigation for marketing pages.
 */

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const MARKETING_NAV_ITEMS = [
  { href: '/profile/marketing', label: 'Overview', exact: true },
  { href: '/profile/marketing/campaigns', label: 'Campaigns' },
  { href: '/profile/marketing/attribution', label: 'Attribution' },
  { href: '/profile/marketing/automations', label: 'Automations' },
];

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Marketing</h1>
      </div>

      {/* Sub Navigation */}
      <nav className="border-b border-gray-200">
        <div className="flex space-x-8">
          {MARKETING_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${isActive(item.href, item.exact)
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
}
