'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  BarChart3,
  CreditCard,
  Edit3,
  Package,
  QrCode,
  MapPin,
  ChevronRight,
  LayoutDashboard,
  Loader2,
  LogOut,
  Lock,
  Sparkles,
  Globe,
  GraduationCap,
  Images,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import { getAccessSubscription, getMyBusinessCardForDashboard, getPaymenthistory, LogoutUser, userProfile } from '../../api/Api';
import { useSession } from '@/lib/useSession';
import { loginHref } from '@/lib/auth';
import MyAccessCard from './Myaccesscard';
import ShowQRCode from './Showqrcode';
import { AddressTab } from './AddressTab';
import PaymentHistory from './PaymentHistory';
import EditAccessCard from './accessCardEdit';
import ChangePasswordTab from './Changepasswordtab';
import SubscriptionPlansTab, { isPastDue, type AccessSubscription } from '../Pricing/SubscriptionPlansTab';
import AccessCardAnalytics from './analytics/AccessCardAnalytics';
import PageAnalytics from './analytics/PageAnalytics';
import MyPageTab from './MyPageTab';
import ProductsTab from './ProductsTab';
import MediaTab from './profile/MediaTab';
import EducationTab from './profile/EducationTab';
type TabId =
  | 'my-card'
  | 'edit-card'
  | 'analytics'
  | 'my-page'
  | 'media'
  | 'education'
  | 'products'
  | 'page-analytics'
  | 'payment-history'
  | 'qr-code'
  | 'subscription-plans'
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
    id: 'analytics',
    label: 'Analytics',
    description: 'Views, clicks and visitors',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    id: 'my-page',
    label: 'My Page',
    description: 'Your page on Glamlink',
    icon: <Globe className="h-5 w-5" />,
  },
  {
    id: 'media',
    label: 'Media & Images',
    description: 'Photos and videos on your page',
    icon: <Images className="h-5 w-5" />,
  },
  {
    id: 'education',
    label: 'Education',
    description: 'Your videos and blog posts',
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    id: 'products',
    label: 'Products',
    description: 'Products on your page and in the shop',
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    id: 'page-analytics',
    label: 'Page Analytics',
    description: 'Views and clicks on your page',
    icon: <TrendingUp className="h-5 w-5" />,
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
    id: 'subscription-plans',
    label: 'Subscription Plans',
    description: 'View or upgrade your plan',
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
// A card that is not live yet (draft, waiting for review, rejected) can always be
// edited in full; a live card's photos and video need Access Pro.
const isLiveCard = (card: any): boolean => (card?.status || '').toLowerCase() === 'accepted';
const TAB_IDS = NAV_ITEMS.map((n) => n.id) as readonly string[];
const isTabId = (tab: string | null): tab is TabId => !!tab && TAB_IDS.includes(tab);
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
            className="btn-primary px-4 py-2 text-xs"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
const FullPageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);
// The dashboard reads ?tab= from the URL, which needs a Suspense boundary.
export default function DashboardPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Dashboard />
    </Suspense>
  );
}
function Dashboard() {
  const router = useRouter();
  const session = useSession();
  // Links such as "See plans" open a tab with ?tab=, also while the dashboard is
  // open (a link to the same page keeps it mounted). The URL follows the tab.
  const urlTab = useSearchParams().get('tab');
  const [activeTab, setActiveTab] = useState<TabId>(() => (isTabId(urlTab) ? urlTab : 'my-card'));
  const [seenUrlTab, setSeenUrlTab] = useState(urlTab);
  if (urlTab !== seenUrlTab) {
    setSeenUrlTab(urlTab);
    if (isTabId(urlTab)) setActiveTab(urlTab);
  }
  const openTab = (id: TabId) => {
    setActiveTab(id);
    if (urlTab !== id) window.history.replaceState(null, '', `/dashboard?tab=${id}`);
  };
  const [businessCard, setBusinessCard] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userdata, setUserData] = useState<any>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [editCardId, setEditCardId] = useState<string | null>(null);
  // null: no Access Pro seat (Free). undefined: not known (not loaded, or the call failed).
  const [subscription, setSubscription] = useState<AccessSubscription | null | undefined>(undefined);
  // The card, the payments and the seat load side by side: an owner without a
  // card (deleted, or never made) still sees their payments and plan.
  const fetchDashboardData = async () => {
    setLoading(true);
    const [cardRes, paymentRes, subscriptionRes] = await Promise.allSettled([
      getMyBusinessCardForDashboard(),
      getPaymenthistory(),
      getAccessSubscription(),
    ]);
    if (cardRes.status === 'fulfilled') {
      setBusinessCard(cardRes.value?.data || cardRes.value);
      setError('');
    } else {
      const failure: any = cardRes.reason;
      setError(
        failure?.response?.data?.message ||
        failure?.response?.data?.error ||
        'Something went wrong'
      );
    }
    if (paymentRes.status === 'fulfilled') setPaymentHistory(paymentRes.value?.data ?? []);
    setSubscription(
      subscriptionRes.status === 'fulfilled'
        ? ((subscriptionRes.value?.data ?? null) as AccessSubscription | null)
        : undefined
    );
    setLoading(false);
  };
  // Wait for the session to be restored from the refresh cookie, then load
  // the dashboard, or send a signed-out visitor to sign in and back (to this tab).
  useEffect(() => {
    if (session.status === 'loading') return;
    if (session.status === 'signed-out') {
      router.replace(loginHref());
      return;
    }
    fetchDashboardData();
    userProfile()
      .then((res) => {
        setUserData(res?.data?.user_profile);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [session.status, router]);
  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      // Clears the session locally even if the API call fails.
      await LogoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setSigningOut(false);
      router.push('/login');
    }
  };
  if (loading) return <FullPageSpinner />;
  const activeItem = NAV_ITEMS.find((n) => n.id === activeTab)!;
  const cardsArray: any[] = Array.isArray(businessCard)
    ? businessCard
    : businessCard
      ? [businessCard]
      : [];
  const effectivePaymentCardId = String(cardsArray[0]?.id ?? '');
  // One checkout for every purchase: the pricing page, signed in.
  const goToCheckout = (cardId: string | number, plan?: string | null) =>
    router.push(`/pricing?businessCardId=${cardId}${plan ? `&plan=${plan}` : ''}`);
  const effectiveEditCardId = String(editCardId ?? cardsArray[0]?.id ?? '');
  const hasValidEditCardId = effectiveEditCardId !== '';
  const editingCard =
    cardsArray.find((c) => String(c?.id) === effectiveEditCardId) ??
    cardsArray[0] ??
    null;
  // Every owner can keep their details current; photos and video follow the plan.
  const editCardEnabled = !!editingCard;
  const proAccess = !isLiveCard(editingCard) || Boolean(subscription?.pro);
  // Performance analytics are part of Access Pro: Free owners are offered the subscription.
  const analyticsLocked = subscription !== undefined && !subscription?.pro;
  const PLAN_TYPE_LABELS: Record<string, string> = {
    free: "Free",
    pro: "Pro",
    subscription_only: "Pro",
    nfc_only: "Free + Keychain",
    nfc_with_subscription: "Pro + Keychain",
  };
  function getActivePlanLabel(planType?: string | null): string {
    if (!planType) return "Free";
    return PLAN_TYPE_LABELS[planType.toLowerCase()] || "Free";
  }
  return (
    <div className="min-h-screen bg-background page-soft mt-16 sm:mt-18">
      <div className="container-glamlink py-6 sm:py-8 md:py-12">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              <LayoutDashboard className="h-3 w-3" />
              Dashboard
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your Access card, your page and products, orders and account settings
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sidebar becomes a full-width nav above the content until `lg`
              (1024px) — at `md` there wasn't enough room for a 256px rail
              next to the card, so it now stacks through tablet widths too. */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <nav className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
              <div className="px-4 py-4 border-b border-border bg-muted/30 sm:px-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground ring-2 ring-primary/20">
                    {userdata?.name?.slice(0, 2)?.toUpperCase() || 'GL'}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{userdata?.name || 'User'}</p>
                    <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground mt-0.5">
                      {getActivePlanLabel(cardsArray[0]?.plan_type)} Plan
                    </span>
                  </div>
                </div>
              </div>
              {/* Nav items: horizontally scrollable row on mobile/tablet
                  (no wrapping, no squashed labels), vertical stack from `lg` up. */}
              <div className="flex gap-1 overflow-x-auto p-2 lg:block lg:overflow-visible">
                {NAV_ITEMS.map((item) => {
                  const isEditCard = item.id === 'edit-card';
                  const isDisabled = isEditCard && !editCardEnabled;
                  const isProOnly = analyticsLocked && (item.id === 'analytics' || item.id === 'page-analytics');
                  return (
                    <button
                      key={item.id}
                      disabled={isDisabled}
                      title={isDisabled ? 'Create a card first' : isProOnly ? 'Part of Access Pro' : undefined}
                      onClick={() => {
                        if (isDisabled) return;
                        if (item.id === 'edit-card') {
                          setEditCardId(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                        openTab(item.id);
                      }}
                      aria-current={activeTab === item.id ? 'page' : undefined}
                      className="nav-link flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left lg:w-full disabled:opacity-50 disabled:text-muted-foreground"
                    >
                      {item.icon}
                      <div className="min-w-[110px] flex-1 lg:min-w-0">
                        <p className="whitespace-nowrap text-sm font-medium lg:whitespace-normal">{item.label}</p>
                        <p className="hidden text-xs opacity-70 lg:block">{item.description}</p>
                      </div>
                      {isDisabled || isProOnly ? (
                        <Lock className="hidden h-4 w-4 lg:block" />
                      ) : (
                        <ChevronRight className="hidden h-4 w-4 lg:block" />
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
                    <p className="text-xs opacity-70">End your session</p>
                  </div>
                </button>
              </div>
            </nav>
          </aside>
          <main className="w-full flex-1 min-w-0">
            <div className="mb-4 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
              <span className="flex-shrink-0">Dashboard</span>
              <ChevronRight className="h-3 w-3 flex-shrink-0" />
              <span className="truncate font-medium text-foreground">{activeItem.label}</span>
            </div>
            {/* A renewal failed: Stripe retries it, and the owner can update their card. */}
            {isPastDue(subscription) && activeTab !== 'subscription-plans' && (
              <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
                <p className="flex-1 text-sm text-foreground">
                  <span className="font-semibold text-destructive">Payment failed: update your card.</span>{' '}
                  Your last Access Pro payment didn&apos;t go through.
                </p>
                <button
                  type="button"
                  onClick={() => openTab('subscription-plans')}
                  className="btn-outline px-4 py-2 text-xs"
                >
                  Update card
                </button>
              </div>
            )}
            {/* Content card: min-height scales with viewport instead of
                pinning to 100dvh on every breakpoint from `md` up, which
                added a full extra screen of empty space below short tabs
                (e.g. Change Password) on tablet/desktop. */}
            <div className="card-glamlink min-h-[50vh] sm:min-h-[55vh] lg:min-h-[65vh]">
              <TabErrorBoundary onReset={() => fetchDashboardData()}>
                {activeTab === 'my-card' && (
                  <MyAccessCard
                    cardData={businessCard}
                    user={userdata}
                    error={error}
                    onPayNow={(card: any, plan?: string | null) => goToCheckout(card?.id ?? effectivePaymentCardId, plan)}
                    onEdit={(card: any) => {
                      setEditCardId(String(card?.id ?? ''));
                      openTab('edit-card');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}
                {activeTab === 'analytics' && (
                  <AccessCardAnalytics
                    cards={cardsArray}
                    locked={analyticsLocked}
                    onUpgrade={() => openTab('subscription-plans')}
                  />
                )}
                {activeTab === 'my-page' && <MyPageTab />}
                {activeTab === 'media' && <MediaTab />}
                {activeTab === 'education' && <EducationTab />}
                {activeTab === 'products' && <ProductsTab />}
                {activeTab === 'page-analytics' && (
                  <PageAnalytics locked={analyticsLocked} onUpgrade={() => openTab('subscription-plans')} />
                )}
                {activeTab === 'payment-history' && <PaymentHistory payments={paymentHistory} />}
                {activeTab === 'qr-code' && <ShowQRCode cardData={businessCard} error={error} />}
                {activeTab === 'subscription-plans' && (
                  <SubscriptionPlansTab businessCardId={cardsArray[0]?.id} onChanged={fetchDashboardData} />
                )}
                {activeTab === 'addresses' && <AddressTab />}
                {activeTab === 'change-password' && <ChangePasswordTab />}
                {activeTab === 'edit-card' && editCardEnabled && hasValidEditCardId && editingCard && (
                  <EditAccessCard
                    cardId={effectiveEditCardId}
                    cardData={editingCard}
                    proAccess={proAccess}
                    onCancel={() => {
                      setEditCardId(null);
                      openTab('my-card');
                    }}
                    onSave={(updated) => {
                      setBusinessCard((prev: any) =>
                        Array.isArray(prev)
                          ? prev.map((c) =>
                            String(c?.id) === String(updated?.id ?? effectiveEditCardId)
                              ? { ...c, ...updated }
                              : c
                          )
                          : prev
                            ? { ...prev, ...updated }
                            : updated
                      );
                      setEditCardId(null);
                      openTab('my-card');
                      fetchDashboardData();
                    }}
                  />
                )}
                {activeTab === 'edit-card' &&
                  (!editCardEnabled || !hasValidEditCardId || !editingCard) && (
                    <div className="p-6 text-sm text-muted-foreground">
                      {!hasValidEditCardId || !editingCard
                        ? 'No business card found to edit yet.'
                        : 'This card cannot be edited.'}
                    </div>
                  )}
              </TabErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}