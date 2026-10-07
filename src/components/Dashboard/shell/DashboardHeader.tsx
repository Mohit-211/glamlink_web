'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown, ChevronRight, KeyRound, LayoutDashboard, LogOut, MapPin, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import mark from '../../../../public/favicon.png';
import { UserAvatar, type DashboardUser } from './DashboardSidebar';
import { findNavGroupLabel, findNavItem, type TabId } from './nav';

interface Props {
  activeTab: TabId;
  user: DashboardUser;
  onOpenMenu: () => void;
  onSelect: (tab: TabId) => void;
  onSignOut: () => void;
}

export default function DashboardHeader({ activeTab, user, onOpenMenu, onSelect, onSignOut }: Props) {
  const item = findNavItem(activeTab);
  const group = findNavGroupLabel(activeTab);

  return (
    <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center gap-3 border-b border-border bg-white/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Mobile / tablet: drawer trigger + brand mark */}
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open navigation"
        className="-ml-1 rounded-lg p-2 text-foreground transition-colors hover:bg-muted lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Link href="/" aria-label="Glamlink home" className="flex-shrink-0 lg:hidden">
        <Image src={mark} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
      </Link>

      {/* Breadcrumb / title */}
      <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-1.5 text-sm text-muted-foreground">
        <button
          type="button"
          onClick={() => onSelect('overview')}
          className="hidden flex-shrink-0 transition-colors hover:text-foreground sm:inline"
        >
          Dashboard
        </button>
        {group && (
          <>
            <ChevronRight className="hidden h-3.5 w-3.5 flex-shrink-0 sm:block" aria-hidden="true" />
            <span className="hidden flex-shrink-0 md:inline">{group}</span>
            <ChevronRight className="hidden h-3.5 w-3.5 flex-shrink-0 md:block" aria-hidden="true" />
          </>
        )}
        {activeTab !== 'overview' && !group && <ChevronRight className="hidden h-3.5 w-3.5 flex-shrink-0 sm:block" aria-hidden="true" />}
        <span aria-current="page" className={activeTab === 'overview' ? 'truncate font-semibold text-foreground sm:hidden' : 'truncate font-semibold text-foreground'}>
          {activeTab === 'overview' ? 'Dashboard' : item.label}
        </span>
      </nav>

      <Link
        href="/"
        className="hidden items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
      >
        Visit Glamlink
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>

      {/* Account menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-2 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:pr-3"
            aria-label="Account menu"
          >
            <UserAvatar user={user} className="h-8 w-8 text-[11px]" />
            <span className="hidden max-w-[140px] truncate text-sm font-medium text-foreground sm:block">{user.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60 rounded-xl p-1.5">
          <DropdownMenuLabel className="px-2 py-2 font-normal">
            <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email || `${user.planLabel} plan`}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => onSelect('overview')} className="gap-2.5 rounded-lg">
            <LayoutDashboard className="h-4 w-4" /> Overview
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onSelect('addresses')} className="gap-2.5 rounded-lg">
            <MapPin className="h-4 w-4" /> Addresses
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onSelect('change-password')} className="gap-2.5 rounded-lg">
            <KeyRound className="h-4 w-4" /> Change password
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="gap-2.5 rounded-lg">
            <Link href="/">
              <ArrowUpRight className="h-4 w-4" /> Back to Glamlink
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onSignOut} className="gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive">
            <LogOut className="h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
