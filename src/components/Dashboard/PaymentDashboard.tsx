'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, CreditCard, Lock, RefreshCw } from 'lucide-react';
import { getMyBusinessCardForDashboard, getPaymenthistory, LogoutUser, userProfile } from '../../api/Api';
import MyAccessCard from './Myaccesscard';
import ShowQRCode from './Showqrcode';
import { AddressTab } from './AddressTab';
import { SubscriptionPaymentModal } from './SubscriptionPay';
import PaymentHistory from './PaymentHistory';
import EditAccessCard from './accessCardEdit';
import ChangePasswordTab from './Changepasswordtab';
import { PurchaseType } from './Purchasetypes';
import type { PlanId } from '../Pricing/SubscriptionPlansTab';
import PlansTab from './PlansTab';
import { EmptyState, PageHeader, btn } from './shell/ui';
import AccessCardAnalytics from './analytics/AccessCardAnalytics';
import DashboardOverview, { DashboardOverviewSkeleton } from './DashboardOverview';
import DashboardSidebar, { CONTENT_OFFSET, SIDEBAR_WIDTH, type DashboardUser } from './shell/DashboardSidebar';
import DashboardHeader from './shell/DashboardHeader';
import type { TabId } from './shell/nav';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  ACCESS_CARD_UPGRADE_MESSAGE,
  ensureCanEditAccessCard,
  getAccessCardPermissions,
  showAccessCardUpgradeMessage,
} from '@/lib/accessCardPermissions';

const SIDEBAR_COLLAPSED_KEY = 'glamlink-dashboard-sidebar-collapsed';
const CARD_NOT_FOUND = 'Business card not found.';

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
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-foreground">
            Something went wrong loading this section.
          </p>
          <p className="mt-1 max-w-md break-words text-xs text-muted-foreground">
            {this.state.message}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, message: '' });
              this.props.onReset();
            }}
            className="btn-primary mt-5 !py-2 !text-xs !shadow-none"
          >
            <RefreshCw className="h-3.5 w-3.5" />
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
  const [activeTab, setActiveTab] = useState<TabId>('overview');
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
  const [payModalPurchaseType, setPayModalPurchaseType] = useState<PurchaseType>(

  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Width transitions are switched on only after the saved state is applied,
  // so a remembered "collapsed" rail doesn't animate shut on every page load.
  const [sidebarAnimated, setSidebarAnimated] = useState(false);
  useEffect(() => {
    try {
      setSidebarCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1');
    } catch {
      // storage unavailable — keep the expanded default
    }
    const frame = requestAnimationFrame(() => setSidebarAnimated(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  // The drawer is mobile/tablet only — drop it if the viewport grows to desktop.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const onChange = () => mql.matches && setDrawerOpen(false);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  const toggleSidebar = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0');
    } catch {
      // ignore
    }
  };
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
  // Edit permission comes only from the card's plan_type (see lib/accessCardPermissions).
  // `loading` keeps every edit entry point locked until the card API has answered.
  const editCardEnabled = getAccessCardPermissions(editingCard, { loading }).canEditAccessCard;
  // The sidebar / breadcrumb "Edit Card" entry always opens the first card.
  const defaultCardPermissions = getAccessCardPermissions(cardsArray[0], { loading });
  const handleSelectNfcPlan = (type: PurchaseType, businessId: string | number) => {
    setSelectedCardId(String(businessId ?? cardsArray[0]?.id ?? ''));
    setPayModalPurchaseType(type);
    setPayOpen(true);
  };
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

  const dashboardUser: DashboardUser = {
    name: userdata?.name || 'User',
    email: userdata?.email,
    image: userdata?.profile_image || null,
    planLabel: getActivePlanLabel(cardsArray[0]?.plan_type),
  };

  const editLockReason = loading
    ? 'Checking your plan…'
    : !cardsArray[0]
      ? 'Create an Access Card first'
      : !defaultCardPermissions.canEditAccessCard
        ? 'Upgrade your plan to edit'
        : undefined;
  const lockedTabs: Partial<Record<TabId, string>> = editLockReason ? { 'edit-card': editLockReason } : {};

  function selectTab(tab: TabId) {
    if (lockedTabs[tab]) {
      // Plan-locked: explain and offer the existing Plans page instead of silently ignoring the click.
      if (tab === 'edit-card' && !loading && cardsArray[0]) showAccessCardUpgradeMessage(goToPlans);
      return;
    }
    if (tab === 'edit-card') setEditCardId(null);
    setActiveTab(tab);
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToPlans() {
    selectTab('subscription-plans');
  }

  const openEditor = (card: any) => {
    // Guard first — before switching tabs or preparing any form state.
    if (!ensureCanEditAccessCard(card, { loading, onUpgrade: goToPlans })) return;
    setEditCardId(String(card?.id ?? ''));
    setActiveTab('edit-card');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // A failed card fetch other than "you don't have one yet" deserves a visible retry.
  const loadFailed = !loading && !!error && error !== CARD_NOT_FOUND;

  const sidebarProps = {
    activeTab,
    onSelect: selectTab,
    lockedTabs,
    user: dashboardUser,
    onSignOut: handleSignOut,
    signingOut,
  };

  return (
    <div className="min-h-dvh bg-secondary/40">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden border-r border-border lg:block',
          sidebarAnimated && 'transition-[width] duration-[250ms] ease-out',
          sidebarCollapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded
        )}
      >
        <DashboardSidebar {...sidebarProps} collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
      </aside>

      {/* Mobile / tablet drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-[280px] max-w-[85vw] gap-0 p-0 sm:max-w-[280px]" aria-describedby={undefined}>
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <DashboardSidebar {...sidebarProps} />
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          'flex min-h-dvh min-w-0 flex-col',
          sidebarAnimated && 'transition-[padding] duration-[250ms] ease-out',
          sidebarCollapsed ? CONTENT_OFFSET.collapsed : CONTENT_OFFSET.expanded
        )}
      >
        <DashboardHeader
          activeTab={activeTab}
          user={dashboardUser}
          onOpenMenu={() => setDrawerOpen(true)}
          onSelect={selectTab}
          onSignOut={handleSignOut}
        />

        <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {showSuccess && (
            <div className="mb-6 flex flex-col gap-3 rounded-xl border border-primary/30 bg-accent px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-accent-foreground">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                Business card created successfully! Complete payment to activate it.
              </div>
              <button
                onClick={() => {
                  setSelectedCardId(createdCardId);
                  setPayModalPurchaseType('SUBSCRIPTION_ONLY');
                  setPayOpen(true);
                }}
                disabled={!hasValidPaymentCardId}
                className="btn-primary w-full flex-shrink-0 !py-2 !text-xs !shadow-none disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Pay Now
              </button>
            </div>
          )}

          {loadFailed && (
            <div role="alert" className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>We couldn&apos;t load your dashboard. {error}</span>
              </div>
              <button
                onClick={() => {
                  setError('');
                  fetchDashboardData();
                }}
                className="inline-flex flex-shrink-0 items-center justify-center gap-1.5 rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            </div>
          )}

          <TabErrorBoundary onReset={() => fetchDashboardData()}>
            {loading ? (
              activeTab === 'overview' ? (
                <DashboardOverviewSkeleton />
              ) : (
                <div className="rounded-2xl border border-border bg-card p-4 sm:p-6" aria-busy="true">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="mt-2 h-4 w-72 max-w-full" />
                  <Skeleton className="mt-6 h-48 w-full rounded-xl" />
                </div>
              )
            ) : activeTab === 'overview' ? (
              <DashboardOverview
                userName={userdata?.name || ''}
                cards={cardsArray}
                payments={paymentHistory}
                cardError={error}
                canEdit={defaultCardPermissions.canEditAccessCard}
                onNavigate={selectTab}
                onEditCard={openEditor}
              />
            ) : (
              <div className="min-w-0">
                {activeTab === 'my-card' && (
                  <MyAccessCard
                    cardData={businessCard}
                    user={userdata}
                    error={error}
                    onPayNow={(card: any, plan?: PlanId | null) => {
                      setSelectedCardId(String(card?.id ?? ''));
                      setPayModalPurchaseType(
                        plan === 'nfc_with_subscription'
                          ? 'NFC_WITH_SUBSCRIPTION'
                          : plan === 'nfc_only'
                            ? 'NFC_ONLY'
                            : 'SUBSCRIPTION_ONLY'
                      );
                      setPayOpen(true);
                    }}
                    onEdit={openEditor}
                  />
                )}
                {activeTab === 'analytics' && <AccessCardAnalytics cards={cardsArray} />}
                {activeTab === 'payment-history' && <PaymentHistory payments={paymentHistory} />}
                {activeTab === 'qr-code' && <ShowQRCode cardData={businessCard} error={error} />}
                {activeTab === 'subscription-plans' && (
                  <PlansTab
                    card={cardsArray[0]}
                    planLabel={getActivePlanLabel(cardsArray[0]?.plan_type)}
                    selectedPlan={selectedPlan}
                    onSelectPlan={setSelectedPlan}
                    canContinue={!!selectedPlan}
                    businessCard={cardsArray[0]}
                    businessCardId={cardsArray[0]?.id}
                    onContinue={(effectivePlanType: string) => {
                      setSelectedCardId(String(cardsArray[0]?.id ?? ''));
                      setPayModalPurchaseType(effectivePlanType.toUpperCase() as PurchaseType);
                      setPayOpen(true);
                    }}
                  />
                )}
                {activeTab === 'addresses' && <AddressTab />}
                {activeTab === 'change-password' && <ChangePasswordTab />}
                {activeTab === 'edit-card' && (
                  <PageHeader
                    title="Edit Access Card"
                    description="Changes are reflected on your public card as soon as you save."
                  />
                )}
                {activeTab === 'edit-card' && editCardEnabled && hasValidEditCardId && editingCard && (
                  <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
                  <EditAccessCard
                    cardId={effectiveEditCardId}
                    cardData={editingCard}
                    onCancel={() => {
                      setEditCardId(null);
                      setActiveTab('my-card');
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
                      setActiveTab('my-card');
                      fetchDashboardData();
                    }}
                  />
                  </div>
                )}
                {activeTab === 'edit-card' &&
                  (!editCardEnabled || !hasValidEditCardId || !editingCard) && (
                    <EmptyState
                      bordered
                      icon={!hasValidEditCardId || !editingCard ? CreditCard : Lock}
                      title={!hasValidEditCardId || !editingCard ? 'No Access Card to edit yet' : 'Editing is locked on your plan'}
                      message={
                        !hasValidEditCardId || !editingCard
                          ? 'Create your Glamlink Access Card first, then come back here to update it.'
                          : ACCESS_CARD_UPGRADE_MESSAGE
                      }
                      action={
                        <button
                          onClick={() =>
                            !hasValidEditCardId || !editingCard
                              ? router.push('/access')
                              : goToPlans()
                          }
                          className={btn.primary}
                        >
                          {!hasValidEditCardId || !editingCard ? 'Create Access Card' : 'Upgrade plan'}
                        </button>
                      }
                    />
                  )}
              </div>
            )}
          </TabErrorBoundary>
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
