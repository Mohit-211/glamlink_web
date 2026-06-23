'use client';
import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Edit3,
  Package,
  QrCode,
  MapPin,
  ChevronRight,
  CheckCircle,
  LayoutDashboard,
  Loader2,
} from 'lucide-react';
import { getMyBusinessCardForDashboard, getPaymenthistory, userProfile } from '../../api/Api';
import MyAccessCard from './Myaccesscard';
import ShowQRCode from './Showqrcode';
import { AddressTab } from './AddressTab';
import OrderHistory from './PaymentHistory';
import { SubscriptionPaymentModal } from './SubscriptionPay';
import PaymentHistory from './PaymentHistory';
// import CreateOrEditCard from './CreateOrEditCard'; // adjust path/name to your actual component

type TabId = 'my-card' | 'edit-card' | 'payment-history' | 'qr-code' | 'addresses';

const NAV_ITEMS = [
  {
    id: 'my-card',
    label: 'My Access Card',
    description: 'View your public card',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: 'edit-card',
    label: 'Edit Access Card',
    description: 'Update card details',
    icon: <Edit3 className="h-5 w-5" />,
  },
  {
    id: 'payment-history',
    label: 'Payment History',
    description: 'View payment history',
    icon: <Package className="h-5 w-5" />,
  },
  {
    id: 'qr-code',
    label: 'QR Code',
    description: 'Share your card link',
    icon: <QrCode className="h-5 w-5" />,
  },
  {
    id: 'addresses',
    label: 'Addresses',
    description: 'Manage saved addresses',
    icon: <MapPin className="h-5 w-5" />,
  },
] as const;

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>('my-card');
  const [businessCard, setBusinessCard] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payOpen, setPayOpen] = useState(false);
  const [userdata, setUserData] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);
  const [createdCardId, setCreatedCardId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const cardRes = await getMyBusinessCardForDashboard();
      setBusinessCard(cardRes?.data || cardRes);

      const paymentRes = await getPaymenthistory();
      setPaymentHistory(paymentRes?.data ?? []);
    } catch (error: any) {
      console.log(error.response?.status);
      console.log(error.response?.data);

      setError(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  // Called by the create/edit card component once the card is successfully created.
  const handleCardCreated = async (cardId?: string) => {
    setCreatedCardId(cardId ?? null);
    setShowSuccess(true);
    await fetchDashboardData(); // refresh businessCard with the latest data
    setActiveTab('my-card');    // jump back so the success banner + card are visible together
    // Show success banner for 2s, then open payment modal
    setTimeout(() => setPayOpen(true), 2000);
  };

  useEffect(() => {
    userProfile()
      .then((res) => {
        console.log(res, "====");
        setUserData(res?.data?.user_profile)
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeItem = NAV_ITEMS.find((n) => n.id === activeTab)!;

  // Prefer the just-created card id; fall back to the existing card's id.
  const effectiveCardId = String(createdCardId ?? businessCard?.id ?? '');
  const hasValidCardId = effectiveCardId !== '' && !Number.isNaN(Number(effectiveCardId));

  return (
    <div className="min-h-screen bg-background page-soft mt-18">
      <div className="container-glamlink py-8 md:py-12">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-accent px-3 py-1 text-[11px] font-medium text-accent-foreground">
              <LayoutDashboard className="h-3 w-3" />
              Dashboard
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your access card, orders, and account settings
          </p>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground ring-2 ring-primary/20">
                    {userdata?.name?.slice(0, 2)?.toUpperCase() || 'GL'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{userdata?.name || 'User'}</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-150 ${activeTab === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                      }`}
                  >
                    {item.icon}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-[11px] opacity-70">{item.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Dashboard</span>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-foreground">{activeItem.label}</span>
            </div>

            {/* Success banner + Pay Now button, shown after a card is created */}
            {showSuccess && (
              <div className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-primary/30 bg-accent px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium text-accent-foreground">
                  <CheckCircle className="h-4 w-4" />
                  Business card created successfully! Complete payment to activate it.
                </div>
                <button
                  onClick={() => setPayOpen(true)}
                  disabled={!hasValidCardId}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay Now
                </button>
              </div>
            )}

            <div className="card-glamlink min-h-[400px]">
              {activeTab === 'my-card' && (
                <MyAccessCard
                  cardData={businessCard}
                  user={userdata}
                  error={error}
                  onPayNow={() => setPayOpen(true)}
                />
              )}
              {/* {activeTab === 'edit-card' && (
                <CreateOrEditCard onSuccess={handleCardCreated} />
              )} */}
              {activeTab === 'payment-history' && <PaymentHistory payments={paymentHistory} />}
              {activeTab === 'qr-code' && (
                <ShowQRCode cardData={businessCard} error={error} />
              )}
              {activeTab === 'addresses' && <AddressTab />}
            </div>
          </main>
        </div>
      </div>

      <SubscriptionPaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        onSuccess={() => {
          setShowSuccess(false);
          setCreatedCardId(null);
          fetchDashboardData();
        }}
        businessCardId={effectiveCardId}
        onGoToAddresses={() => setActiveTab('addresses')}
      />
    </div>
  );
}