'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  LogOut,
  Lock,
  Nfc,
  Sparkles,
} from 'lucide-react';
import { ChangePassword, getMyBusinessCardForDashboard, getPaymenthistory, LogoutUser, userProfile } from '../../api/Api';
import MyAccessCard from './Myaccesscard';
import ShowQRCode from './Showqrcode';
import { AddressTab } from './AddressTab';
import { SubscriptionPaymentModal } from './SubscriptionPay';
import PaymentHistory from './PaymentHistory';
import EditAccessCard from './accessCardEdit';
import ChangePasswordTab from './Changepasswordtab';
import AccessNfcTab from './Accessnfctab';
import SubscriptionPlansTab, { PlanId } from './Subscriptionplanstab';
import { PurchaseType } from './Purchasetypes';

type TabId =
  | 'my-card'
  | 'edit-card'
  | 'payment-history'
  | 'qr-code'
  | 'nfc-access'
  | 'plans'
  | 'addresses'
  | 'change-password';

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
    id: 'nfc-access',
    label: 'NFC Card',
    description: 'Write your card to an NFC tag',
    icon: <Nfc className="h-5 w-5" />,
  },
  {
    id: 'plans',
    label: 'Plans',
    description: 'Subscription & NFC card plans',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    id: 'addresses',
    label: 'Addresses',
    description: 'Manage saved addresses',
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    id: 'change-password',
    label: 'Change Password',
    description: 'Update your account password',
    icon: <Lock className="h-5 w-5" />,
  },
] as const;

// Mirrors the same check used inside MyAccessCard so the sidebar and the
// inline "Edit" button always agree on whether editing is unlocked.
const isSubscriptionActive = (card: any): boolean =>
  ((card?.business_user?.subscription_status || '') as string).toLowerCase() === 'active';

class TabErrorBoundary extends React.Component<
  { children: React.ReactNode; onReset: () => void },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode; onReset: () => void }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, message: error?.message || 'Something went wrong' };
  }

  componentDidCatch(error: any, info: any) {
    console.error('Dashboard tab crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-sm">
          <p className="mb-3 font-medium text-destructive">
            Something went wrong loading this section.
          </p>
          <p className="mb-4 text-xs text-muted-foreground break-words">
            {this.state.message}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, message: '' });
              this.props.onReset();
            }}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('my-card');
  const [businessCard, setBusinessCard] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payOpen, setPayOpen] = useState(false);
  const [userdata, setUserData] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdCardId, setCreatedCardId] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [editCardId, setEditCardId] = useState<string | null>(null);

  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  // Drives which purchase type SubscriptionPaymentModal is collecting
  // payment for — it must be an NFC type whenever the chosen plan
  // bundles NFC (that's what makes it ask for a shipping address). This is
  // the ONLY payment modal in the app: every entry point (Edit-card prompt,
  // Plans tab, NFC tab) opens this same modal so the UI never differs.
  const [payModalPurchaseType, setPayModalPurchaseType] = useState<PurchaseType>(
    'SUBSCRIPTION_ONLY'
  );

  useEffect(() => {
    const token = localStorage.getItem('GlamlinkaccessToken');
    if (!token) {
      router.push('/login');
      return;
    }
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
      setError(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await LogoutUser();
      localStorage.removeItem('GlamlinkaccessToken');
      localStorage.removeItem('GlamlinkrefreshToken');
      localStorage.removeItem('postLoginRedirect');
      window.dispatchEvent(new Event('auth-change'));
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setSigningOut(false);
    }
  };

  useEffect(() => {
    userProfile()
      .then((res) => {
        setUserData(res?.data?.user_profile);
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
  const cardsArray: any[] = Array.isArray(businessCard)
    ? businessCard
    : businessCard
    ? [businessCard]
    : [];

  const effectivePaymentCardId = String(
    selectedCardId ?? createdCardId ?? cardsArray[0]?.id ?? ''
  );
  const hasValidPaymentCardId = effectivePaymentCardId !== '';

  const effectiveEditCardId = String(editCardId ?? cardsArray[0]?.id ?? '');
  const hasValidEditCardId = effectiveEditCardId !== '';

  const editingCard =
    cardsArray.find((c) => String(c?.id) === effectiveEditCardId) ??
    cardsArray[0] ??
    null;

  // Sidebar "Edit Access Card" is only enabled once the relevant card's
  // subscription is active. We gate on the card that would actually be
  // edited (falls back to the first card, same as effectiveEditCardId).
  const editCardEnabled = !!editingCard && isSubscriptionActive(editingCard);

  const handleSelectNfcPlan = (type: PurchaseType, businessId: string | number) => {
    setSelectedCardId(String(businessId ?? cardsArray[0]?.id ?? ''));
    setPayModalPurchaseType(type);
    setPayOpen(true);
  };

  return (
    <div className="min-h-screen bg-background page-soft mt-18">
      <div className="container-glamlink py-8 md:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
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
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
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
                {NAV_ITEMS.map((item) => {
                  const isEditCard = item.id === 'edit-card';
                  const isDisabled = isEditCard && !editCardEnabled;

                  return (
                    <button
                      key={item.id}
                      disabled={isDisabled}
                      title={isDisabled ? 'Subscribe to unlock editing' : undefined}
                      onClick={() => {
                        if (isDisabled) return;
                        if (item.id === 'edit-card') {
                          setEditCardId(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                        setActiveTab(item.id);
                      }}
                      className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-150 ${
                        isDisabled
                          ? 'opacity-50 cursor-not-allowed text-muted-foreground'
                          : activeTab === item.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-secondary'
                      }`}
                    >
                      {item.icon}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-[11px] opacity-70">{item.description}</p>
                      </div>
                      {isDisabled ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-border p-2">
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-destructive transition-all duration-150 hover:bg-destructive/10 disabled:opacity-50"
                >
                  <LogOut className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {signingOut ? 'Signing out...' : 'Sign Out'}
                    </p>
                    <p className="text-[11px] opacity-70">End your session</p>
                  </div>
                </button>
              </div>
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Dashboard</span>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-foreground">{activeItem.label}</span>
            </div>

            {showSuccess && (
              <div className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-primary/30 bg-accent px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium text-accent-foreground">
                  <CheckCircle className="h-4 w-4" />
                  Business card created successfully! Complete payment to activate it.
                </div>
                <button
                  onClick={() => {
                    setSelectedCardId(createdCardId);
                    setPayModalPurchaseType('SUBSCRIPTION_ONLY');
                    setPayOpen(true);
                  }}
                  disabled={!hasValidPaymentCardId}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay Now
                </button>
              </div>
            )}

            <div className="card-glamlink min-h-[100dvh]">
              <TabErrorBoundary onReset={() => fetchDashboardData()}>
                {activeTab === 'my-card' && (
                  <MyAccessCard
                    cardData={businessCard}
                    user={userdata}
                    error={error}
                    onPayNow={(card: any, plan?: PlanId | null) => {
                      setSelectedCardId(String(card?.id ?? ''));
                      // "subscription-nfc" bundles a physical NFC card, so it
                      // must go through the shipping/address step; plain
                      // "subscription" never needs an address.
                      setPayModalPurchaseType(
                        plan === 'subscription-nfc'
                          ? 'NFC_WITH_SUBSCRIPTION'
                          : 'SUBSCRIPTION_ONLY'
                      );
                      setPayOpen(true);
                    }}
                    onEdit={(card: any) => {
                      setEditCardId(String(card?.id ?? ''));
                      setActiveTab('edit-card');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}

                {activeTab === 'payment-history' && <PaymentHistory payments={paymentHistory} />}
                {activeTab === 'qr-code' && <ShowQRCode cardData={businessCard} error={error} />}
                {activeTab === 'nfc-access' && (
                  <AccessNfcTab cardData={businessCard} error={error} onSelectPlan={handleSelectNfcPlan} />
                )}
                {activeTab === 'plans' && (
                  <SubscriptionPlansTab
                    selectedPlan={selectedPlan}
                    onSelectPlan={setSelectedPlan}
                    canContinue={!!selectedPlan && hasValidPaymentCardId}
                    onContinue={() => {
                      const cardId = String(cardsArray[0]?.id ?? selectedCardId ?? '');
                      setSelectedCardId(cardId);
                      if (selectedPlan === 'subscription') {
                        setPayModalPurchaseType('SUBSCRIPTION_ONLY');
                      } else if (selectedPlan === 'subscription-nfc') {
                        setPayModalPurchaseType('NFC_WITH_SUBSCRIPTION');
                      }
                      setPayOpen(true);
                    }}
                  />
                )}
                {activeTab === 'addresses' && <AddressTab />}
                {activeTab === 'change-password' && <ChangePasswordTab />}

                {activeTab === 'edit-card' && editCardEnabled && hasValidEditCardId && editingCard && (
                  <EditAccessCard
                    cardId={effectiveEditCardId}
                    cardData={editingCard}
                    onCancel={() => {
                      setEditCardId(null);
                      setActiveTab('my-card');
                    }}
                    onSave={async () => {
                      await fetchDashboardData();
                      setEditCardId(null);
                      setActiveTab('my-card');
                    }}
                  />
                )}
                {activeTab === 'edit-card' &&
                  (!editCardEnabled || !hasValidEditCardId || !editingCard) && (
                    <div className="p-6 text-sm text-muted-foreground">
                      {!hasValidEditCardId || !editingCard
                        ? 'No business card found to edit yet.'
                        : 'Your subscription is inactive. Subscribe to unlock editing.'}
                    </div>
                  )}
              </TabErrorBoundary>
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
          setSelectedCardId(null);
          setSelectedPlan(null);
          fetchDashboardData();
        }}
        businessCardId={effectivePaymentCardId}
        allowedPurchaseType={payModalPurchaseType}
        onGoToAddresses={() => {
          setPayOpen(false);
          setActiveTab('addresses');
        }}
      />
    </div>
  );
}