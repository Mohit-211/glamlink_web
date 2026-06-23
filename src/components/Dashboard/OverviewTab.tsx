'use client';

import { CreditCard, ShoppingBag, Eye, QrCode, MapPin, ArrowUpRight, TrendingUp, ChevronRight } from 'lucide-react';
import { ORDERS, CARDS } from './data';
import { StatusPill } from './StatusPill';
import type { TabId } from './types';

interface OverviewTabProps {
  setTab: (t: TabId) => void;
  openQR: () => void;
}

export function OverviewTab({ setTab, openQR }: OverviewTabProps) {
  const totalSpent = ORDERS.filter(o => o.status === 'completed').reduce((s, o) => s + o.amount, 0);

  return (
    <div className="space-y-10">
      {/* Hero stat row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="sm:col-span-1 relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/25">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
          <div className="absolute -right-2 -bottom-8 h-20 w-20 rounded-full bg-white/8" />
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60">Total invested</p>
          <p className="mt-2 text-4xl font-bold tracking-tight">${totalSpent.toFixed(2)}</p>
          <p className="mt-1 text-xs text-primary-foreground/60">
            across {ORDERS.filter(o => o.status === 'completed').length} orders
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-primary-foreground/80">
            <ArrowUpRight className="h-3.5 w-3.5" /> Active membership
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Active Orders</p>
              <p className="mt-2 text-4xl font-bold text-foreground">1</p>
              <p className="mt-1 text-xs text-muted-foreground">awaiting completion</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 border border-amber-100">
              <ShoppingBag className="h-5 w-5 text-amber-600" />
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Cards on File</p>
              <p className="mt-2 text-4xl font-bold text-foreground">{CARDS.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">payment methods saved</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
              <CreditCard className="h-5 w-5 text-primary" />
            </span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Quick actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: CreditCard, label: 'Manage Cards',  sub: 'Edit payment methods',  action: () => setTab('cards')   },
            { icon: QrCode,     label: 'Show QR Code',  sub: 'Scan to verify access',  action: openQR                  },
            { icon: Eye,        label: 'View Access',   sub: 'Check subscription',     action: () => setTab('access')  },
            { icon: MapPin,     label: 'Addresses',     sub: 'Update locations',       action: () => setTab('address') },
          ].map(({ icon: Icon, label, sub, action }) => (
            <button
              key={label}
              onClick={action}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent transition group-hover:bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/40 self-end group-hover:text-primary transition" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recent orders</p>
          <button onClick={() => setTab('orders')} className="text-xs font-semibold text-primary hover:underline">
            View all
          </button>
        </div>
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-[var(--shadow-soft)]">
          {ORDERS.slice(0, 3).map((o, i) => (
            <div key={o.id} className={`flex items-center gap-4 px-5 py-4 ${i < 2 ? 'border-b border-border' : ''}`}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent">
                <ShoppingBag className="h-4 w-4 text-primary" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{o.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{o.id} · {o.date}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-foreground">${o.amount.toFixed(2)}</p>
                <div className="mt-1">
                  <StatusPill status={o.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
