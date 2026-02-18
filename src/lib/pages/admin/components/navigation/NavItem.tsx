"use client";

import Link from "next/link";

interface NavItemProps {
  /** Navigation item configuration */
  item: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    current: boolean;
  };
  /** Optional badge count to display */
  badge?: number;
  /** Whether the sidebar is in collapsed state */
  isCollapsed: boolean;
  /** Callback when nav item is clicked (e.g., close mobile menu) */
  onClick?: () => void;
}

/**
 * Reusable navigation item component for admin sidebar
 *
 * Handles both expanded and collapsed states, with badge support
 * for notifications and pending items.
 */
export function NavItem({ item, badge, isCollapsed, onClick }: NavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`
        group flex items-center py-2 text-sm font-medium rounded-md transition-colors duration-200
        ${isCollapsed ? "justify-center px-2" : "px-3"}
        ${item.current
          ? "bg-glamlink-teal text-white"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }
      `}
      onClick={onClick}
      title={isCollapsed ? item.name : undefined}
    >
      <div className="relative">
        <Icon
          className={`
            h-5 w-5 flex-shrink-0
            ${!isCollapsed && "mr-3"}
            ${item.current ? "text-white" : "text-gray-400 group-hover:text-gray-500"}
          `}
        />
        {/* Badge for collapsed state - shows as small dot on icon */}
        {isCollapsed && badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      {/* Expanded state - shows full label and badge */}
      {!isCollapsed && (
        <span className="flex-1 flex items-center justify-between">
          {item.name}
          {badge !== undefined && badge > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}

export default NavItem;
