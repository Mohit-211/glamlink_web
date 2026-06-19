'use client';

import { useState } from 'react';
import {
  CreditCard, ShoppingBag, Eye, QrCode, MapPin, X, Check,
  Calendar, DollarSign, AlertCircle, Download, Sparkles,
  ArrowUpRight, TrendingUp, Shield, Star, ChevronRight,
  Plus, Trash2, Home, Briefcase,
} from 'lucide-react';

/* ─── Types ─── */
interface Order {
  id: string; date: string; amount: number;
  status: 'completed' | 'pending' | 'cancelled'; description: string;
}
interface AccessCard {
  id: string; lastFour: string; brand: string;
  expiryMonth: number; expiryYear: number; isDefault: boolean;
}
interface Address {
  id: string; name: string; street: string; city: string;
  state: string; zipCode: string; country: string; isDefault: boolean;
}

/* ─── Mock data ─── */
const ORDERS: Order[] = [
  { id: '#ORD-001', date: '2024-01-15', amount: 299.99, status: 'completed', description: 'Premium Membership (12 months)' },
  { id: '#ORD-002', date: '2024-01-10', amount: 49.99,  status: 'completed', description: 'GlamCard Pro Bundle' },
  { id: '#ORD-003', date: '2024-01-05', amount: 150.00, status: 'pending',   description: 'Professional Photoshoot Package' },
  { id: '#ORD-004', date: '2023-12-28', amount: 79.99,  status: 'completed', description: 'Digital Magazine Subscription' },
];
const CARDS: AccessCard[] = [
  { id: 'card-1', lastFour: '4242', brand: 'Visa',       expiryMonth: 12, expiryYear: 2025, isDefault: true  },
  { id: 'card-2', lastFour: '5555', brand: 'Mastercard', expiryMonth: 8,  expiryYear: 2026, isDefault: false },
];
const ADDRESSES: Address[] = [
  { id: 'addr-1', name: 'Home',   street: '123 Main Street, Apt 4B',      city: 'Hyderabad', state: 'Telangana', zipCode: '500001', country: 'India', isDefault: true  },
  { id: 'addr-2', name: 'Office', street: '456 Business Ave, Suite 200',  city: 'Hyderabad', state: 'Telangana', zipCode: '500032', country: 'India', isDefault: false },
];

/* ─── Helpers ─── */
const STATUS = {
  completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  pending:   { label: 'Pending',   color: 'bg-amber-50  text-amber-700  border-amber-200',     dot: 'bg-amber-500'  },
  cancelled: { label: 'Cancelled', color: 'bg-red-50    text-red-700    border-red-200',        dot: 'bg-red-500'    },
};

function StatusPill({ status }: { status: Order['status'] }) {
  const s = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${s.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

const CARD_GRADIENTS: Record<string, string> = {
  Visa:       'from-[#1a1f71] to-[#2563eb]',
  Mastercard: 'from-[#eb001b] to-[#f79e1b]',
  Amex:       'from-[#007b5e] to-[#00b388]',
};

/* ─── Tab IDs ─── */
type TabId = 'overview' | 'orders' | 'cards' | 'access' | 'address';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview',        icon: TrendingUp  },
  { id: 'orders',   label: 'Orders',          icon: ShoppingBag },
  { id: 'access',   label: 'My Access',       icon: Shield      },
  { id: 'address',  label: 'Addresses',       icon: MapPin      },
];

/* ══════════════════════════════════════════════
   OVERVIEW TAB
══════════════════════════════════════════════ */
function OverviewTab({ setTab, openQR }: { setTab: (t: TabId) => void; openQR: () => void }) {
  const totalSpent = ORDERS.filter(o => o.status === 'completed').reduce((s, o) => s + o.amount, 0);
  return (
    <div className="space-y-10">
      {/* Hero stat row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Primary accent card */}
        <div className="sm:col-span-1 relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/25">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
          <div className="absolute -right-2 -bottom-8 h-20 w-20 rounded-full bg-white/8" />
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60">Total invested</p>
          <p className="mt-2 text-4xl font-bold tracking-tight">${totalSpent.toFixed(2)}</p>
          <p className="mt-1 text-xs text-primary-foreground/60">across {ORDERS.filter(o => o.status === 'completed').length} orders</p>
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
            { icon: CreditCard, label: 'Manage Cards',   sub: 'Edit payment methods', action: () => setTab('cards')   },
            { icon: QrCode,     label: 'Show QR Code',   sub: 'Scan to verify access', action: openQR                  },
            { icon: Eye,        label: 'View Access',    sub: 'Check subscription',    action: () => setTab('access')  },
            { icon: MapPin,     label: 'Addresses',      sub: 'Update locations',       action: () => setTab('address') },
          ].map(({ icon: Icon, label, sub, action }) => (
            <button key={label} onClick={action}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
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
          <button onClick={() => setTab('orders')} className="text-xs font-semibold text-primary hover:underline">View all</button>
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
                <div className="mt-1"><StatusPill status={o.status} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ORDERS TAB
══════════════════════════════════════════════ */
function OrdersTab() {
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Order History</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{ORDERS.length} total orders</p>
        </div>
      </div>
      <div className="space-y-3">
        {ORDERS.map(o => (
          <div key={o.id} className="rounded-2xl border border-border bg-card overflow-hidden shadow-[var(--shadow-soft)]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{o.description}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs text-muted-foreground">{o.id}</span>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />{o.date}
                  </span>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end gap-3">
                <p className="text-lg font-bold text-foreground">${o.amount.toFixed(2)}</p>
                <StatusPill status={o.status} />
                {o.status === 'pending' && (
                  <button onClick={() => setCancelTarget(o.id)}
                    className="text-xs font-medium text-red-600 hover:text-red-700 underline underline-offset-2 transition">
                    Cancel order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-base font-bold text-center text-foreground">Cancel this order?</h3>
            <p className="text-center text-sm text-muted-foreground mt-2 mb-6">
              Order <span className="font-semibold text-foreground">{cancelTarget}</span> will be cancelled. A full refund will be processed within 5–7 days.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setCancelTarget(null)} className="flex-1 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition">Keep order</button>
              <button onClick={() => setCancelTarget(null)} className="flex-1 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition">Yes, cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   CARDS TAB
══════════════════════════════════════════════ */
function CardsTab() {
  const [editing, setEditing] = useState<string | null>(null);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Payment Methods</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{CARDS.length} cards saved</p>
        </div>
      </div>
      <div className="space-y-4 mb-5">
        {CARDS.map(card => {
          const grad = CARD_GRADIENTS[card.brand] ?? 'from-slate-700 to-slate-900';
          const isEditing = editing === card.id;
          return (
            <div key={card.id} className={`rounded-2xl border-2 bg-card shadow-[var(--shadow-soft)] overflow-hidden transition-all ${card.isDefault ? 'border-primary' : 'border-border'}`}>
              {/* Card visual */}
              <div className={`relative bg-gradient-to-br ${grad} p-5 text-white`}>
                <div className="absolute right-4 top-4 opacity-20">
                  <CreditCard className="h-10 w-10" />
                </div>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">Payment Method</p>
                    <p className="text-sm font-bold mt-0.5">{card.brand}</p>
                  </div>
                  {card.isDefault && (
                    <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                      <Star className="h-2.5 w-2.5" /> Default
                    </span>
                  )}
                </div>
                <p className="text-base font-mono tracking-[0.2em] text-white/80">•••• •••• •••• {card.lastFour}</p>
                <p className="mt-2 text-xs text-white/50">Expires {String(card.expiryMonth).padStart(2,'0')}/{card.expiryYear}</p>
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-between px-5 py-3 bg-secondary/30 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  {card.isDefault ? 'Used for all purchases' : 'Backup card'}
                </p>
                <button onClick={() => setEditing(isEditing ? null : card.id)}
                  className="text-xs font-semibold text-primary hover:underline underline-offset-2 transition">
                  {isEditing ? 'Done' : 'Edit'}
                </button>
              </div>

              {isEditing && (
                <div className="px-5 py-4 space-y-3 border-t border-border bg-card">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1 block">Cardholder name</label>
                      <input placeholder="Full name" className="w-full rounded-xl border border-input bg-secondary/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1 block">Expiry</label>
                      <input placeholder="MM / YY" className="w-full rounded-xl border border-input bg-secondary/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button className="flex-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition">Save changes</button>
                    <button className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-dashed border-border py-3.5 text-sm font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition">
        <Plus className="h-4 w-4" /> Add new card
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ACCESS TAB
══════════════════════════════════════════════ */
function AccessTab() {
  const features = [
    'Unlimited GlamCard creation',
    'Premium Magazine access',
    'Analytics dashboard',
    'Priority support 24/7',
    'Advanced customization',
  ];
  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">My Access</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Your current plan and subscription details</p>
      </div>

      {/* Premium card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 p-7 text-primary-foreground shadow-xl shadow-primary/30 mb-5">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/8" />
        <div className="absolute -right-4 -bottom-12 h-32 w-32 rounded-full bg-white/6" />
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/50">Current plan</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">Premium Pro</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <Sparkles className="h-6 w-6 text-white" />
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-white/15 pt-5">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-primary-foreground/40">Status</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Active
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-primary-foreground/40">Active until</p>
            <p className="mt-1 text-sm font-semibold">Mar 15, 2025</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-primary-foreground/40">Member ID</p>
            <p className="mt-1 text-sm font-semibold">GLM-12345</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="rounded-2xl border border-border bg-card p-5 mb-5 shadow-[var(--shadow-soft)]">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">What's included</p>
        <div className="space-y-3">
          {features.map(f => (
            <div key={f} className="flex items-center gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              </span>
              <span className="text-sm text-foreground">{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">Renew subscription</button>
        <button className="flex-1 rounded-full border border-border bg-secondary px-4 py-3 text-sm font-semibold text-foreground hover:bg-accent transition">View all plans</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ADDRESS TAB
══════════════════════════════════════════════ */
function AddressTab() {
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const icon = (name: string) => name === 'Home' ? <Home className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />;

  return (
    <div className="max-w-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Saved Addresses</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{ADDRESSES.length} addresses saved</p>
        </div>
      </div>
      <div className="space-y-4 mb-5">
        {ADDRESSES.map(addr => {
          const isEditing = editing === addr.id;
          return (
            <div key={addr.id} className={`rounded-2xl border-2 bg-card shadow-[var(--shadow-soft)] overflow-hidden transition-all ${addr.isDefault ? 'border-primary' : 'border-border'}`}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-primary">
                      {icon(addr.name)}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-foreground">{addr.name}</p>
                      {addr.isDefault && (
                        <span className="text-[10px] font-semibold text-primary">Default address</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setEditing(isEditing ? null : addr.id)}
                    className="text-xs font-semibold text-primary hover:underline underline-offset-2 transition">
                    {isEditing ? 'Done' : 'Edit'}
                  </button>
                </div>
                <p className="text-sm text-foreground pl-10">{addr.street}</p>
                <p className="text-xs text-muted-foreground mt-0.5 pl-10">{addr.city}, {addr.state} {addr.zipCode}, {addr.country}</p>
              </div>

              {isEditing && (
                <div className="px-5 pb-5 space-y-3 border-t border-border pt-4 bg-secondary/20">
                  <input defaultValue={addr.street} placeholder="Street address"
                    className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
                  <div className="grid grid-cols-2 gap-3">
                    <input defaultValue={addr.city} placeholder="City"
                      className="rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
                    <input defaultValue={addr.state} placeholder="State"
                      className="rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input defaultValue={addr.zipCode} placeholder="ZIP Code"
                      className="rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
                    <input defaultValue={addr.country} placeholder="Country"
                      className="rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked={addr.isDefault} className="h-4 w-4 accent-primary" />
                    <span className="text-xs text-muted-foreground">Set as default address</span>
                  </label>
                  <div className="flex gap-2 pt-1">
                    <button className="flex-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition">Save address</button>
                    <button className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!showForm ? (
        <button onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-dashed border-border py-3.5 text-sm font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition">
          <Plus className="h-4 w-4" /> Add new address
        </button>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <p className="text-sm font-bold text-foreground mb-4">New address</p>
          <div className="space-y-3">
            <input placeholder="Label (Home, Office…)" className="w-full rounded-xl border border-input bg-secondary/60 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
            <input placeholder="Street address" className="w-full rounded-xl border border-input bg-secondary/60 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="City"  className="rounded-xl border border-input bg-secondary/60 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
              <input placeholder="State" className="rounded-xl border border-input bg-secondary/60 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="ZIP"     className="rounded-xl border border-input bg-secondary/60 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
              <input placeholder="Country" className="rounded-xl border border-input bg-secondary/60 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="h-4 w-4 accent-primary" />
              <span className="text-xs text-muted-foreground">Set as default address</span>
            </label>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">Add address</button>
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   QR MODAL
══════════════════════════════════════════════ */
function QRModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/25 backdrop-blur-sm">
      <div className="w-full max-w-xs rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-foreground">Access QR Code</p>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 w-fit rounded-2xl border-2 border-border bg-white p-4 shadow-md">
            <svg viewBox="0 0 110 110" className="h-44 w-44" xmlns="http://www.w3.org/2000/svg">
              <rect x="5"  y="5"  width="30" height="30" rx="3" fill="#18181b"/>
              <rect x="9"  y="9"  width="22" height="22" rx="2" fill="white"/>
              <rect x="13" y="13" width="14" height="14" rx="1" fill="#18181b"/>
              <rect x="75" y="5"  width="30" height="30" rx="3" fill="#18181b"/>
              <rect x="79" y="9"  width="22" height="22" rx="2" fill="white"/>
              <rect x="83" y="13" width="14" height="14" rx="1" fill="#18181b"/>
              <rect x="5"  y="75" width="30" height="30" rx="3" fill="#18181b"/>
              <rect x="9"  y="79" width="22" height="22" rx="2" fill="white"/>
              <rect x="13" y="83" width="14" height="14" rx="1" fill="#18181b"/>
              {[[42,5],[49,5],[56,5],[42,12],[56,12],[42,19],[49,19],[56,19],
                [5,42],[12,42],[19,42],[5,49],[19,49],[5,56],[12,56],[19,56],
                [42,42],[56,42],[49,49],[42,56],[56,56],[63,63],[70,63],[77,63],
                [70,70],[63,77],[77,77],[84,70],[42,70],[49,77],[56,70],[42,84],[56,84]
              ].map(([x,y],i)=><rect key={i} x={x} y={y} width="5" height="5" rx="0.5" fill="#18181b"/>)}
            </svg>
          </div>
          <p className="text-sm font-semibold text-foreground">GLM-2024-12345</p>
          <p className="text-xs text-muted-foreground mt-1">Scan to verify subscription access</p>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition">
            <Download className="h-3.5 w-3.5" /> Download
          </button>
          <button onClick={onClose} className="flex-1 rounded-full border border-border bg-secondary py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition">Close</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ROOT PAGE
══════════════════════════════════════════════ */
export default function PaymentDashboard() {
  const [tab, setTab] = useState<TabId>('overview');
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="min-h-screen page-soft">
      {/* Ambient blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-pulse-slow absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/8 blur-3xl" />
        <div className="animate-pulse-slow animation-delay-700 absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/6 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="container-glamlink py-8 mt-20">
         
          <h1 className="text-2xl font-bold text-foreground mt-3">Payment Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your payments, orders, and access</p>
        </div>
      </div>

      <div className="container-glamlink relative py-8">
        {/* Tab nav */}
        <div className="flex overflow-x-auto gap-1 mb-8 rounded-2xl border border-border bg-card p-1 shadow-[var(--shadow-soft)]" style={{scrollbarWidth:'none'}}>
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}>
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>
          {tab === 'overview' && <OverviewTab setTab={setTab} openQR={() => setShowQR(true)} />}
          {tab === 'orders'   && <OrdersTab />}
          {tab === 'cards'    && <CardsTab />}
          {tab === 'access'   && <AccessTab />}
          {tab === 'address'  && <AddressTab />}
        </div>
      </div>

      {showQR && <QRModal onClose={() => setShowQR(false)} />}
    </div>
  );
}