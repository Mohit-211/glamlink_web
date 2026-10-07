'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import {
    Globe,
    Copy,
    Check,
    ExternalLink,
    CalendarCheck,
    Edit3,
    X,
    Lock,
    Nfc,
    AlertCircle,
    CreditCard,
    QrCode,
    Share2,
    Package,
    Truck,
} from 'lucide-react';
import { AccessCardData } from './types';
import { ACCESS_CARD_UPGRADE_MESSAGE, getAccessCardPermissions } from '@/lib/accessCardPermissions';
import SubscriptionPlansTab, { PlanId } from '../Pricing/SubscriptionPlansTab';
import { PLANS } from '../Pricing/plans';
import logo from '../../../public/header_logo.png';
import { EmptyState, Eyebrow, PageHeader, StatusBadge, btn, formatDate, humanize, toneForStatus } from './shell/ui';

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.84 2.84 0 0 1 2.31-4.64 2.86 2.86 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.44-.05z" />
    </svg>
);

type CardKey = string | number;

const getCardKey = (card: AccessCardData, index: number): CardKey =>
    (card as any)?.id ?? index;

const getPlanType = (card: AccessCardData): string =>
    ((card as any)?.plan_type || '').toLowerCase();

// plan_type already bundles NFC (nfc_only / nfc_with_subscription) — hide the
// "Include NFC" upsell button once the card is on one of those plans.
const cardHasNfcPlan = (card: AccessCardData): boolean => {
    const planType = getPlanType(card);
    return planType === 'nfc_only' || planType === 'nfc_with_subscription';
};

// Edit permission is decided centrally from plan_type — see lib/accessCardPermissions.
const isCardEditable = (card: AccessCardData): boolean =>
    getAccessCardPermissions(card).canEditAccessCard;

// nfc_status assumed to live alongside subscription_status on business_user.
// Move this lookup if your API actually returns it elsewhere on the card.
const getNfcStatus = (card: AccessCardData): string =>
    ((card as any)?.business_user?.nfc_status || (card as any)?.nfc_status || '').toLowerCase();

const isNfcAlreadyPaid = (card: AccessCardData): boolean =>
    cardHasNfcPlan(card) || getNfcStatus(card) === 'paid';

// Plan ids that ship / include an NFC card — these should be disabled once
// nfc_status is already "paid" so the user can't buy a second NFC card.
// Update these to match your actual PlanId values if they differ.
const NFC_PLAN_IDS: PlanId[] = ['nfc_only', 'nfc_with_subscription'] as PlanId[];

// Same accent the public card uses: the card's own color_code, else Glamlink teal.
const DEFAULT_ACCENT = '#24bbcb';
const getAccent = (card: AccessCardData): string => {
    const value = ((card as any)?.color_code || '').trim();
    return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value) ? value : DEFAULT_ACCENT;
};

const getPlanName = (card: AccessCardData): string =>
    PLANS.find((p) => p.planType === getPlanType(card))?.name ?? 'Free access';

const parseSocialMedia = (card: AccessCardData): Record<string, string | undefined> => {
    try {
        return typeof card?.social_media === "string"
            ? JSON.parse(card.social_media)
            : card?.social_media || {};
    } catch (err) {
        console.error("Invalid social_media JSON:", err);
        return {};
    }
};

const SOCIAL_ICONS: { key: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'instagram', label: 'Instagram', icon: FaInstagram },
    { key: 'tiktok', label: 'TikTok', icon: TikTokIcon },
    { key: 'facebook', label: 'Facebook', icon: FaFacebookF },
    { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedinIn },
];

interface Props {
    cardData: AccessCardData | AccessCardData[];
    onPayNow?: (card: AccessCardData, plan?: PlanId | null) => void;
    onEdit?: (card: AccessCardData) => void;
    user: any;
    error?: string;
}

/* ───────────────────────── the card itself ───────────────────────── */

function AccessCardVisual({ card, accent }: { card: AccessCardData; accent: string }) {
    const initials =
        card?.name
            ?.split(" ")
            ?.map((n) => n[0])
            ?.join("")
            ?.toUpperCase()
            ?.slice(0, 2) || "GL";

    const bioSummary = (card?.bio || '')
        .replace(/\n\n/g, ' · ')
        .replace(/\n/g, ' ')
        .trim();

    const socialMedia = parseSocialMedia(card);
    const socials = SOCIAL_ICONS.filter((s) => socialMedia[s.key]);
    const specialties = [card?.primary_specialty, ...(Array.isArray(card?.specialties) ? card.specialties : [])]
        .filter((s, i, arr): s is string => !!s && arr.indexOf(s) === i)
        .slice(0, 3);
    const tint = `color-mix(in srgb, ${accent} 12%, white)`;

    return (
        <article
            className="relative overflow-hidden rounded-[28px] border border-border bg-card shadow-medium"
            aria-label={`${card?.name || 'Access'} card preview`}
        >
            {/* Accent band */}
            <div className="relative h-24 sm:h-28" style={{ backgroundColor: tint }}>
                <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: accent }} />
                <div className="absolute right-5 top-4 flex items-center gap-2 sm:right-6 sm:top-5">
                    <Image src={logo} alt="Glamlink" width={140} height={40} className="h-auto w-[84px] object-contain" />
                </div>
                <p
                    className="absolute left-5 top-5 text-[10px] font-semibold uppercase tracking-[0.2em] sm:left-7"
                    style={{ color: accent }}
                >
                    Access Card
                </p>
            </div>

            <div className="relative px-5 pb-5 sm:px-7 sm:pb-6">
                {/* Avatar overlapping the band */}
                <div className="-mt-12 sm:-mt-14">
                    {card?.profile_image ? (
                        <img
                            src={card.profile_image}
                            alt={card?.name}
                            className="h-24 w-24 rounded-full border-4 border-card object-cover sm:h-28 sm:w-28"
                        />
                    ) : (
                        <div
                            className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-card text-2xl font-semibold sm:h-28 sm:w-28"
                            style={{ backgroundColor: tint, color: accent }}
                        >
                            {initials}
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <h2 className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-[28px]">
                        {card?.name}
                    </h2>
                    {card?.professional_title && (
                        <p className="mt-1 text-sm font-semibold" style={{ color: accent }}>
                            {card.professional_title}
                        </p>
                    )}
                    {card?.business_name && (
                        <p className="mt-0.5 text-sm text-muted-foreground">{card.business_name}</p>
                    )}
                </div>

                {specialties.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                        {specialties.map((s) => (
                            <li key={s} className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-foreground/80">
                                {s}
                            </li>
                        ))}
                    </ul>
                )}

                {bioSummary && (
                    <div
                        className="mt-4 line-clamp-3 text-sm leading-relaxed text-foreground/75 break-words"
                        dangerouslySetInnerHTML={{ __html: bioSummary }}
                    />
                )}

                {(card?.website || card?.booking_link || socials.length > 0) && (
                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                        {card?.booking_link && (
                            <a
                                href={card.booking_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                                style={{ backgroundColor: accent }}
                            >
                                <CalendarCheck className="h-3.5 w-3.5" />
                                Book now
                            </a>
                        )}
                        {card?.website && (
                            <a
                                href={card.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-9 min-w-0 max-w-full items-center gap-1.5 rounded-full border border-border px-3.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                            >
                                <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate">{card.website.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
                            </a>
                        )}
                        {socials.map(({ key, label, icon: Icon }) => (
                            <a
                                key={key}
                                href={socialMedia[key]}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/80 transition-colors hover:bg-muted"
                            >
                                <Icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer: link + QR, like the back of a printed card */}
            <div className="flex items-center gap-4 border-t border-border bg-secondary/40 px-5 py-3.5 sm:px-7">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Glamlink profile</p>
                    <p className="mt-0.5 truncate font-mono text-xs text-foreground/80">
                        {(card?.business_card_link || '').replace(/^https?:\/\/(www\.)?/, '')}
                    </p>
                </div>
                {card?.business_card_qr && (
                    <img
                        src={card.business_card_qr}
                        alt=""
                        className="h-12 w-12 flex-shrink-0 rounded-lg border border-border bg-white object-contain p-1"
                    />
                )}
            </div>
        </article>
    );
}

/* ───────────────────────── page ───────────────────────── */

export default function MyAccessCard({
    user,
    cardData,
    onPayNow,
    onEdit,
    error,
}: Props) {
    const [copiedKey, setCopiedKey] = useState<CardKey | null>(null);
    const [qrKey, setQrKey] = useState<CardKey | null>(null);
    const [subscriptionPromptKey, setSubscriptionPromptKey] = useState<CardKey | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
    const [nfcPromptKey, setNfcPromptKey] = useState<CardKey | null>(null);

    const cards: AccessCardData[] = Array.isArray(cardData)
        ? cardData
        : cardData
            ? [cardData]
            : [];

    if (error === "Business card not found." || cards.length === 0) {
        return (
            <div>
                <PageHeader title="My Access Card" description="Your digital card, exactly as clients see it." />
                <EmptyState
                    bordered
                    icon={CreditCard}
                    title="Create your Glamlink Access Card"
                    message="One link for your services, booking, socials and location — ready to share with every client."
                    action={
                        <button onClick={() => (window.location.href = "/access")} className={btn.primary}>
                            Create Access Card
                        </button>
                    }
                />
            </div>
        );
    }

    const handleCopy = async (card: AccessCardData, key: CardKey) => {
        if (!card?.business_card_link) return;
        try {
            await navigator.clipboard.writeText(card.business_card_link);
            setCopiedKey(key);
            setTimeout(() => setCopiedKey((cur) => (cur === key ? null : cur)), 2000);
        } catch (err) {
            console.error(err);
        }
    };

    const handleShare = async (card: AccessCardData, key: CardKey) => {
        if (!card?.business_card_link) return;
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({ title: card?.name ? `${card.name} on Glamlink` : 'My Glamlink Access Card', url: card.business_card_link });
                return;
            } catch (err: any) {
                if (err?.name === 'AbortError') return;
            }
        }
        await handleCopy(card, key);
        toast.success('Link copied — paste it anywhere to share');
    };

    const handleEditClick = (card: AccessCardData, key: CardKey) => {
        if (isCardEditable(card)) {
            onEdit?.(card);
        } else {
            setSelectedPlan(null);
            setSubscriptionPromptKey(key);
        }
    };

    const qrCard = cards.find((c, i) => getCardKey(c, i) === qrKey) ?? null;
    const subscriptionPromptCard =
        cards.find((c, i) => getCardKey(c, i) === subscriptionPromptKey) ?? null;
    const nfcPromptCard = cards.find((c, i) => getCardKey(c, i) === nfcPromptKey) ?? null;

    // Disable NFC-including plans in the prompt once this card's NFC has
    // already been paid for, so the user can only pick a non-NFC plan.
    const disabledPlanIds: PlanId[] = subscriptionPromptCard && isNfcAlreadyPaid(subscriptionPromptCard)
        ? NFC_PLAN_IDS
        : [];

    return (
        <>
            <PageHeader
                title="My Access Card"
                description={
                    cards.length > 1
                        ? `You have ${cards.length} Access Cards. Each one is shown exactly as clients see it.`
                        : 'Your digital card, exactly as clients see it.'
                }
            />

            <div className="space-y-10">
                {cards.map((card, index) => {
                    const key = getCardKey(card, index);
                    const accent = getAccent(card);
                    const cardIsSubscribed = isCardEditable(card);
                    const showIncludeNfcButton = !cardHasNfcPlan(card);
                    const isRejected = card?.status?.toLowerCase() === "rejected";
                    const subscriptionStatus = (card as any)?.business_user?.subscription_status;

                    return (
                        <section key={key} className="min-w-0">
                            {cards.length > 1 && (
                                <Eyebrow className="mb-3">
                                    {card?.business_name || card?.name || `Card ${index + 1}`}
                                </Eyebrow>
                            )}
                            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
                                <div className="min-w-0 max-w-[640px]">
                                    <AccessCardVisual card={card} accent={accent} />
                                </div>

                                {/* Status + actions */}
                                <aside className="min-w-0 space-y-4 lg:sticky lg:top-24">
                                    <div className="rounded-2xl border border-border bg-card p-5">
                                        <Eyebrow>Card status</Eyebrow>
                                        <dl className="mt-3 space-y-2.5 text-sm">
                                            {card?.status && (
                                                <div className="flex items-center justify-between gap-3">
                                                    <dt className="text-muted-foreground">Review</dt>
                                                    <dd><StatusBadge tone={toneForStatus(card.status)}>{humanize(card.status)}</StatusBadge></dd>
                                                </div>
                                            )}
                                            {card?.payment_status && (
                                                <div className="flex items-center justify-between gap-3">
                                                    <dt className="text-muted-foreground">Payment</dt>
                                                    <dd><StatusBadge tone={toneForStatus(card.payment_status)}>{humanize(card.payment_status)}</StatusBadge></dd>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between gap-3">
                                                <dt className="text-muted-foreground">Plan</dt>
                                                <dd className="font-semibold text-foreground">{getPlanName(card)}</dd>
                                            </div>
                                            {subscriptionStatus && (
                                                <div className="flex items-center justify-between gap-3">
                                                    <dt className="text-muted-foreground">Subscription</dt>
                                                    <dd><StatusBadge tone={toneForStatus(subscriptionStatus)}>{humanize(subscriptionStatus)}</StatusBadge></dd>
                                                </div>
                                            )}
                                        </dl>

                                        {isRejected ? (
                                            <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
                                                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-red-700">
                                                        Your access card has been rejected.
                                                    </p>
                                                    <p className="mt-1 text-xs text-red-600">
                                                        Please update your details and submit your access card again. It will remain unavailable until it is approved.
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-4 flex min-w-0 items-center gap-1 rounded-xl border border-border bg-secondary/50 py-1 pl-3 pr-1">
                                                <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-muted-foreground">
                                                    {card?.business_card_link}
                                                </span>
                                                <button
                                                    onClick={() => handleCopy(card, key)}
                                                    className={btn.icon + ' h-8 w-8'}
                                                    aria-label="Copy link"
                                                >
                                                    {copiedKey === key ? (
                                                        <Check className="h-3.5 w-3.5 text-primary" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                        )}

                                        <a
                                            href={isRejected ? undefined : card?.business_card_link}
                                            target={isRejected ? undefined : "_blank"}
                                            rel={isRejected ? undefined : "noopener noreferrer"}
                                            onClick={(e) => isRejected && e.preventDefault()}
                                            className={`${btn.primary} mt-4 w-full ${isRejected ? 'pointer-events-none opacity-50' : ''}`}
                                            aria-disabled={isRejected}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            View my access card
                                        </a>

                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                            <button onClick={() => handleEditClick(card, key)} className={btn.chip}>
                                                {cardIsSubscribed ? <Edit3 className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                                                Edit
                                            </button>
                                            <button onClick={() => setQrKey(key)} className={btn.chip}>
                                                <QrCode className="h-3.5 w-3.5" />
                                                QR code
                                            </button>
                                            <button
                                                onClick={() => handleShare(card, key)}
                                                disabled={isRejected || !card?.business_card_link}
                                                className={btn.chip}
                                            >
                                                <Share2 className="h-3.5 w-3.5" />
                                                Share
                                            </button>
                                            {cardIsSubscribed && showIncludeNfcButton && (
                                                <button onClick={() => setNfcPromptKey(key)} className={btn.chip}>
                                                    <Nfc className="h-3.5 w-3.5" />
                                                    Include NFC
                                                </button>
                                            )}
                                        </div>
                                        {!cardIsSubscribed && (
                                            <p className="mt-3 text-xs text-muted-foreground">
                                                Editing is available on Pro plans.
                                            </p>
                                        )}
                                    </div>

                                    {(card?.access_orders?.length ?? 0) > 0 && (
                                        <div className="rounded-2xl border border-border bg-card p-5">
                                            <Eyebrow>NFC keychain orders</Eyebrow>
                                            <ul className="mt-3 divide-y divide-border">
                                                {card.access_orders!.map((order) => (
                                                    <li key={order.id} className="py-3 first:pt-0 last:pb-0">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
                                                                <Package className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                                <span className="truncate">#{order.order_number}</span>
                                                            </span>
                                                            {order.fulfillment_status && (
                                                                <StatusBadge tone={toneForStatus(order.fulfillment_status)}>
                                                                    {humanize(order.fulfillment_status)}
                                                                </StatusBadge>
                                                            )}
                                                        </div>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            Ordered {formatDate(order.created_at)}
                                                        </p>
                                                        {order.tracking_number && (
                                                            <p className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                                                                <Truck className="h-3.5 w-3.5 flex-shrink-0" />
                                                                {order.tracking_link ? (
                                                                    <a
                                                                        href={order.tracking_link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="truncate font-medium text-primary hover:underline"
                                                                    >
                                                                        {order.tracking_number}
                                                                    </a>
                                                                ) : (
                                                                    <span className="truncate">{order.tracking_number}</span>
                                                                )}
                                                            </p>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </aside>
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* QR Modal */}
            {qrCard && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4"
                    onClick={() => setQrKey(null)}
                >
                    <div className="w-full max-w-xs rounded-2xl border border-border bg-card p-5 shadow-large" onClick={(e) => e.stopPropagation()}>
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">Your GlamCard QR</h3>
                                <p className="text-[11px] text-muted-foreground mt-0.5">Scan to view access card</p>
                            </div>
                            <button onClick={() => setQrKey(null)} className={btn.icon + ' h-8 w-8'} aria-label="Close">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex justify-center rounded-xl border border-border bg-white p-5">
                            {qrCard?.business_card_qr ? (
                                <img src={qrCard?.business_card_qr} alt="QR Code" className="h-48 w-48 object-contain" />
                            ) : (
                                <div className="h-48 w-48 flex items-center justify-center bg-secondary rounded-lg text-muted-foreground text-sm">
                                    No QR available
                                </div>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-sm font-semibold text-foreground">{qrCard?.name}</p>
                            <p className="text-[11px] text-muted-foreground">{qrCard?.professional_title}</p>
                        </div>
                        <div className="mt-4 flex min-w-0 items-center gap-1 rounded-xl border border-border bg-secondary/50 py-1 pl-3 pr-1">
                            <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">{qrCard?.business_card_link}</span>
                            <button
                                onClick={() => handleCopy(qrCard, qrKey as CardKey)}
                                className={btn.icon + ' h-8 w-8'}
                                aria-label="Copy link"
                            >
                                {copiedKey === qrKey ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                        </div>
                        <a
                            href={qrCard?.business_card_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={btn.primary + ' mt-4 w-full'}
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View my access card
                        </a>
                    </div>
                </div>
            )}

            {/* Subscribe Prompt Modal — capped width + safe viewport margins so it
                doesn't stretch edge-to-edge on tablet/desktop or get clipped on
                short mobile screens. */}
            {subscriptionPromptCard && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4"
                    onClick={() => setSubscriptionPromptKey(null)}
                >
                    <div
                        className="w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-large sm:p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h3 className="text-base font-semibold text-foreground">Upgrade to edit this card</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {ACCESS_CARD_UPGRADE_MESSAGE}
                                </p>
                                {disabledPlanIds.length > 0 && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        You've already paid for an NFC card on this card, so NFC plans are unavailable.
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => setSubscriptionPromptKey(null)}
                                className={btn.icon + ' h-8 w-8'}
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <SubscriptionPlansTab
                            selectedPlan={selectedPlan}
                            onSelectPlan={setSelectedPlan}
                            disabledPlanIds={disabledPlanIds}
                            businessCardId={subscriptionPromptCard?.id}
                            canContinue={!!selectedPlan && !disabledPlanIds.includes(selectedPlan)}
                            onContinue={() => {
                                if (!selectedPlan || disabledPlanIds.includes(selectedPlan)) return;
                                onPayNow?.(subscriptionPromptCard, selectedPlan);
                                setSubscriptionPromptKey(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Include NFC Modal — same width cap as the subscribe modal */}
            {nfcPromptCard && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4"
                    onClick={() => setNfcPromptKey(null)}
                >
                    <div
                        className="w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-large sm:p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h3 className="text-base font-semibold text-foreground">Add an NFC keychain</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Add a physical NFC keychain to {(nfcPromptCard?.business_name || nfcPromptCard?.name || 'this card')}.
                                </p>
                            </div>
                            <button
                                onClick={() => setNfcPromptKey(null)}
                                className={btn.icon + ' h-8 w-8'}
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <SubscriptionPlansTab
                            businessCardId={nfcPromptCard.id}
                            selectedPlan={'nfc_only' as PlanId}
                            onSelectPlan={() => { }}
                            disabledPlanIds={['free', 'subscription_only', 'nfc_with_subscription'] as PlanId[]}
                            canContinue={true}
                            onContinue={() => {
                                onPayNow?.(nfcPromptCard, 'nfc_only' as PlanId);
                                setNfcPromptKey(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
