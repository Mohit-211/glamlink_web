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
} from 'lucide-react';
import { ChangePassword, getMyBusinessCardForDashboard, getPaymenthistory, LogoutUser, userProfile } from '../../api/Api';
import MyAccessCard from './Myaccesscard';
import ShowQRCode from './Showqrcode';
import { AddressTab } from './AddressTab';
import OrderHistory from './PaymentHistory';
import { SubscriptionPaymentModal } from './SubscriptionPay';
import PaymentHistory from './PaymentHistory';
import EditAccessCard from './accessCardEdit';
import ChangePasswordTab from './Changepasswordtab';
// import CreateOrEditCard from './CreateOrEditCard'; // adjust path/name to your actual component

type TabId = 'my-card' | 'edit-card' | 'payment-history' | 'qr-code' | 'addresses'|'change-password';

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


{
  id: "change-password",
  label: "Change Password",
  description: "Update your account password",
  icon: <Lock className="h-5 w-5" />,
},
] as const;

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
  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);
  const [createdCardId, setCreatedCardId] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  // Tracks which specific card the user clicked "Pay Now" on.
  // Without it, the payment modal always fell back to the first/only
  // card's id (or nothing), regardless of which card the user clicked.
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // NEW: tracks which specific card the user clicked "Edit" on.
  // This is intentionally SEPARATE from selectedCardId/createdCardId
  // (which drive the payment flow) — otherwise paying for card A would
  // also make card A the one that opens in the Edit tab, and vice versa.
  const [editCardId, setEditCardId] = useState<string | null>(null);

  console.log(businessCard, "businessCard")
  useEffect(() => {
    // Guard: if there's no auth token, bounce straight to /login instead
    // of trying to load dashboard data that will just 401.
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
      console.log(cardRes, "cardRes")
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
    setSelectedCardId(cardId ?? null);
    setShowSuccess(true);
    await fetchDashboardData(); // refresh businessCard with the latest data
    setActiveTab('my-card');    // jump back so the success banner + card are visible together
    // Show success banner for 2s, then open payment modal
    setTimeout(() => setPayOpen(true), 2000);
  };

  const handleSignOut = async () => {
    try {
      setSigningOut(true);

      await LogoutUser(); // Logout API call

      localStorage.removeItem("GlamlinkaccessToken");
      localStorage.removeItem("GlamlinkrefreshToken");
      localStorage.removeItem("postLoginRedirect");

      // Notify auth listeners
      window.dispatchEvent(new Event("auth-change"));

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setSigningOut(false);
    }
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

  // businessCard may come back as either a single card object OR an array
  // of cards (MyAccessCard already supports both). Normalize it here so
  // we can reliably resolve ids no matter which shape the API returns.
  const cardsArray: any[] = Array.isArray(businessCard)
    ? businessCard
    : businessCard
    ? [businessCard]
    : [];

  // ── Payment-flow card id ──
  // Priority: the card the user explicitly clicked "Pay Now" on
  // -> the card that was just created
  // -> fall back to the first card in the list (covers the single-card case)
  console.log(createdCardId, "createdCardId")
  console.log(selectedCardId, "selectedCardId")
  const effectivePaymentCardId = String(
    selectedCardId ?? createdCardId ?? cardsArray[0]?.id ?? ''
  );
  const hasValidPaymentCardId =
    effectivePaymentCardId !== '' && !Number.isNaN(Number(effectivePaymentCardId));

  // ── Edit-flow card id ──
  // Priority: the card the user explicitly clicked "Edit" on
  // -> fall back to the first card (covers the single-card case, e.g.
  //    someone navigating to the Edit tab directly from the sidebar)
  const effectiveEditCardId = String(editCardId ?? cardsArray[0]?.id ?? '');
  const hasValidEditCardId =
    effectiveEditCardId !== '' && !Number.isNaN(Number(effectiveEditCardId));

  // The actual card object being edited — resolved by id from the full
  // list, NOT just "whatever businessCard happens to hold" — otherwise
  // editing card #2 could silently load and normalize card #1's data.
  const editingCard =
    cardsArray.find((c) => String(c?.id) === effectiveEditCardId) ??
    cardsArray[0] ??
    null;

  return (
    <div className="min-h-screen bg-background page-soft mt-18">
      <div className="container-glamlink py-8 md:py-12">

        {/* Header */}
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

          {/* Sign out — also available in the sidebar, kept here too for
              quick access on wide screens */}
          {/* <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="hidden md:inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </button> */}
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
                    onClick={() => {
                      // Navigating to the Edit tab from the sidebar (not via
                      // a per-card Edit button) should not carry over a stale
                      // editCardId from a previous edit session — reset it so
                      // it falls back to the first card.
                      if (item.id === 'edit-card') {
                        setEditCardId(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                      setActiveTab(item.id);
                    }}
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
              {/* Sign out — separated from the tab list with a divider so
                  it doesn't read as another dashboard section */}
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
                  onClick={() => {
                    // Use the created card explicitly, in case the user has
                    // multiple cards and the "first card" fallback would
                    // otherwise pick the wrong one.
                    setSelectedCardId(createdCardId);
                    setPayOpen(true);
                  }}
                  disabled={!hasValidPaymentCardId}
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
                  onPayNow={(card: any) => {
                    // Capture the id of the exact card that was clicked
                    // (MyAccessCard passes it back to us), rather than
                    // always opening the modal with a stale/empty id.
                    setSelectedCardId(String(card?.id ?? ''));
                    setPayOpen(true);
                  }}
                  onEdit={(card: any) => {
                    // Capture the id of the exact card that was clicked
                    // "Edit" on, so EditAccessCard opens with the right
                    // card even when there are multiple.
                    setEditCardId(String(card?.id ?? ''));
                    setActiveTab('edit-card');
                    // The card list can be long, so the Edit button may be
                    // clicked far down the page — jump back to the top so
                    // the user actually sees the edit form open.
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
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
              {activeTab === 'change-password' && <ChangePasswordTab />}

              {activeTab === 'edit-card' && hasValidEditCardId && (
                <EditAccessCard
                  cardId={effectiveEditCardId}
                  cardData={editingCard}
                  onCancel={() => {
                    setEditCardId(null);
                    setActiveTab('my-card');
                  }}
                  onSave={async (updated) => {
                    await fetchDashboardData();
                    setEditCardId(null);
                    setActiveTab('my-card');
                  }}
                />
              )}
              {activeTab === 'edit-card' && !hasValidEditCardId && (
                <div className="p-6 text-sm text-muted-foreground">
                  No business card found to edit yet.
                </div>
              )}

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
          fetchDashboardData();
        } }
        businessCardId={effectivePaymentCardId} onGoToAddresses={function (): void {
          throw new Error('Function not implemented.');
        } }      // onGoToAddresses={() => setActiveTab('addresses')}
      />
    </div>
  );
}