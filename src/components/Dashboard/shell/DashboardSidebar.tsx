'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronsLeft, Loader2, Lock, LogOut } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import logo from '../../../../public/header_logo.png';
import mark from '../../../../public/favicon.png';
import { NAV_GROUPS, getInitials, type TabId } from './nav';

/** Rail widths, shared with PaymentDashboard so content padding always matches. */
export const SIDEBAR_WIDTH = { expanded: 'w-[260px]', collapsed: 'w-[72px]' } as const;
export const CONTENT_OFFSET = { expanded: 'lg:pl-[260px]', collapsed: 'lg:pl-[72px]' } as const;

export interface DashboardUser {
  name: string;
  email?: string;
  image?: string | null;
  planLabel: string;
}

interface Props {
  activeTab: TabId;
  onSelect: (tab: TabId) => void;
  /** Tabs that can't be opened yet, with the reason shown as a tooltip. */
  lockedTabs?: Partial<Record<TabId, string>>;
  user: DashboardUser;
  onSignOut: () => void;
  signingOut: boolean;
  /** Icon-only rail (desktop only). */
  collapsed?: boolean;
  /** When provided, renders the expand / collapse toggle (desktop only). */
  onToggleCollapse?: () => void;
}

export function UserAvatar({ user, className }: { user: Pick<DashboardUser, 'name' | 'image'>; className?: string }) {
  return user.image ? (
    <img src={user.image} alt="" className={cn('flex-shrink-0 rounded-full object-cover', className)} />
  ) : (
    <span
      aria-hidden="true"
      className={cn(
        'flex flex-shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground',
        className
      )}
    >
      {getInitials(user.name)}
    </span>
  );
}

/** Shows `label` to the right of the rail, only while collapsed. */
function RailTooltip({ show, label, children }: { show: boolean; label: string; children: React.ReactElement }) {
  if (!show) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={10}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

// Labels stay mounted and fade, so icons never shift while the width animates.
const labelClass = (collapsed: boolean) =>
  cn(
    'min-w-0 flex-1 truncate text-left transition-opacity duration-200',
    collapsed ? 'pointer-events-none opacity-0' : 'opacity-100 delay-75'
  );

// Every row uses the same left padding in both states: 12px nav padding + 15px
// row padding + 18px icon puts the icon's center at 36px, the middle of the 72px rail.
const rowClass = 'flex h-10 w-full items-center gap-3 overflow-hidden whitespace-nowrap rounded-xl pl-[15px] pr-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40';

export default function DashboardSidebar({
  activeTab,
  onSelect,
  lockedTabs = {},
  user,
  onSignOut,
  signingOut,
  collapsed = false,
  onToggleCollapse,
}: Props) {
  return (
    <div className="relative flex h-full flex-col bg-background">
      {/* Brand: both marks stay mounted and cross-fade */}
      <div className="relative h-16 flex-shrink-0 overflow-hidden border-b border-border">
        <Link
          href="/"
          aria-label="Glamlink home"
          className="absolute inset-y-0 left-5 flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Image
            src={logo}
            alt=""
            width={140}
            height={40}
            priority
            className={cn('h-auto w-[116px] max-w-none object-contain transition-opacity duration-200', collapsed ? 'opacity-0' : 'opacity-100')}
          />
          <Image
            src={mark}
            alt=""
            width={32}
            height={32}
            className={cn('absolute left-0 h-8 w-8 object-contain transition-opacity duration-200', collapsed ? 'opacity-100' : 'opacity-0')}
          />
        </Link>
      </div>

      {/* Toggle: pinned to the rail's edge, same spot in both states */}
      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3.5 top-[18px] z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-soft transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <ChevronsLeft className={cn('h-4 w-4 transition-transform duration-300', collapsed && 'rotate-180')} />
        </button>
      )}

      {/* Navigation */}
      <nav aria-label="Dashboard" className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label ?? gi} className={cn(gi > 0 && 'mt-5')}>
            {group.label && (
              // Fixed height so collapsing doesn't make the list jump vertically.
              <div className="relative mb-1 flex h-6 items-center">
                <p
                  className={cn(
                    'whitespace-nowrap px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/80 transition-opacity duration-200',
                    collapsed ? 'opacity-0' : 'opacity-100'
                  )}
                >
                  {group.label}
                </p>
                <span
                  aria-hidden="true"
                  className={cn('absolute left-[15px] h-px w-[18px] bg-border transition-opacity duration-200', collapsed ? 'opacity-100' : 'opacity-0')}
                />
              </div>
            )}
            <ul className="space-y-0.5">
              {group.items.map(({ id, label, icon: Icon }) => {
                const lockReason = lockedTabs[id];
                const active = activeTab === id;
                return (
                  <li key={id}>
                    <RailTooltip show={collapsed} label={lockReason ? `${label} — ${lockReason}` : label}>
                      <button
                        type="button"
                        // Locked tabs still report the click so the parent can explain why (e.g. upgrade prompt).
                        onClick={() => onSelect(id)}
                        aria-disabled={!!lockReason}
                        aria-current={active ? 'page' : undefined}
                        aria-label={collapsed ? label : undefined}
                        title={!collapsed ? lockReason : undefined}
                        className={cn(
                          rowClass,
                          lockReason
                            ? 'cursor-not-allowed text-muted-foreground/60'
                            : active
                              ? 'bg-primary/10 font-semibold text-primary'
                              : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                        <span className={labelClass(collapsed)}>{label}</span>
                        {lockReason && !collapsed && <Lock className="h-3.5 w-3.5 flex-shrink-0" />}
                      </button>
                    </RailTooltip>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Profile + sign out */}
      <div className="flex-shrink-0 space-y-0.5 border-t border-border px-3 py-3">
        <RailTooltip show={collapsed} label={`${user.name} · ${user.planLabel} plan`}>
          <div className="flex h-12 items-center gap-3 overflow-hidden whitespace-nowrap rounded-xl pl-1.5 pr-2">
            <UserAvatar user={user} className="h-9 w-9 text-xs" />
            <div className={labelClass(collapsed)}>
              <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.planLabel} plan</p>
            </div>
          </div>
        </RailTooltip>
        <RailTooltip show={collapsed} label="Sign out">
          <button
            type="button"
            onClick={onSignOut}
            disabled={signingOut}
            aria-label={collapsed ? 'Sign out' : undefined}
            className={cn(rowClass, 'font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50')}
          >
            {signingOut ? <Loader2 className="h-[18px] w-[18px] flex-shrink-0 animate-spin" /> : <LogOut className="h-[18px] w-[18px] flex-shrink-0" />}
            <span className={labelClass(collapsed)}>{signingOut ? 'Signing out…' : 'Sign out'}</span>
          </button>
        </RailTooltip>
      </div>
    </div>
  );
}
