'use client';

import React, { useState } from 'react';
import { FaInstagram } from "react-icons/fa";
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
} from 'lucide-react';
import { AccessCardData } from './types';
import SubscriptionPlansTab, { PlanId } from '../Pricing/SubscriptionPlansTab';

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

// Editing is unlocked only for plans that include an active subscription.
const isCardEditable = (card: AccessCardData): boolean => {
    const planType = getPlanType(card);
    return planType === 'subscription_only' || planType === 'nfc_with_subscription';
};

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

interface Props {
    cardData: AccessCardData | AccessCardData[];
    onPayNow?: (card: AccessCardData, plan?: PlanId | null) => void;
    onEdit?: (card: AccessCardData) => void;
    user: any;
    error?: string;
}

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
console.log(selectedPlan,"selectedPlan")
    const cards: AccessCardData[] = Array.isArray(cardData)
        ? cardData
        : cardData
            ? [cardData]
            : [];

    if (error === "Business card not found." || cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Create Your Business Card
                </h2>
                <p className="mt-2 text-sm text-gray-500 text-center max-w-md">
                    You haven't created a business card yet.
                </p>
                <button
                    onClick={() => (window.location.href = "/apply/digital-card")}
                    className="mt-6 rounded-xl bg-primary px-6 py-3 text-white font-medium"
                >
                    Create Business Card
                </button>
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
            <div className="space-y-6">
                {cards.map((card, index) => {
                    const key = getCardKey(card, index);
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

                    type SocialMedia = {
                        instagram?: string;
                        tiktok?: string;
                        facebook?: string;
                        linkedin?: string;
                        twitter?: string;
                    };

                    const socialMedia: SocialMedia = (() => {
                        try {
                            return typeof card?.social_media === "string"
                                ? JSON.parse(card.social_media)
                                : card?.social_media || {};
                        } catch (err) {
                            console.error("Invalid social_media JSON:", err);
                            return {};
                        }
                    })();
                    const cardIsSubscribed = isCardEditable(card);
                    const showIncludeNfcButton = !cardHasNfcPlan(card);
                    const isRejected = card?.status?.toLowerCase() === "rejected";
                    return (
                        <div
                            key={key}
                            className="space-y-3 rounded-3xl border border-border/60 bg-secondary/10 p-3 sm:p-4"
                        >
                            <div className="flex items-center justify-between gap-2 px-1">
                                <p className="text-xs font-semibold text-muted-foreground">
                                    {card?.business_name || card?.name || ''}
                                </p>
                                <div className="flex items-center gap-2">
                                    {cardIsSubscribed && showIncludeNfcButton && (
                                        <button
                                            onClick={() => setNfcPromptKey(key)}
                                            className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-secondary transition-colors"
                                        >
                                            <Nfc className="h-3 w-3" />
                                            Include NFC
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEditClick(card, key)}
                                        className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-secondary transition-colors"
                                    >
                                        {cardIsSubscribed ? (
                                            <Edit3 className="h-3 w-3" />
                                        ) : (
                                            <Lock className="h-3 w-3" />
                                        )}
                                        Edit
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-medium)]">
                                    <div className="flex flex-col sm:flex-row min-h-[200px]">
                                        <div className="h-1.5 w-full sm:h-auto sm:w-1.5 flex-shrink-0 bg-primary" />
                                        <div className="flex flex-col items-center justify-center gap-3 border-b border-border sm:border-b-0 sm:border-r px-6 py-6 sm:min-w-[160px] sm:px-8">
                                            {card?.profile_image ? (
                                                <img
                                                    src={card?.profile_image}
                                                    alt={card?.name}
                                                    className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
                                                />
                                            ) : (
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-foreground ring-2 ring-primary/20">
                                                    {initials}
                                                </div>
                                            )}
                                            <div className="text-center">
                                                <p className="text-[15px] font-semibold text-foreground leading-tight">{card?.name}</p>
                                                <p className="mt-0.5 text-xs font-medium text-primary">{card?.professional_title}</p>
                                                {card?.business_name && (
                                                    <p className="mt-0.5 text-[11px] text-muted-foreground">{card?.business_name}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-1 flex-col justify-center gap-4 border-b border-border sm:border-b-0 sm:border-r px-6 py-6 sm:px-7">
                                            <div>
                                                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">About</p>
                                                <div
                                                    className="text-[13px] leading-relaxed text-foreground/80"
                                                    dangerouslySetInnerHTML={{ __html: bioSummary || "" }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center gap-4 px-6 py-6 sm:min-w-[200px] sm:px-7">
                                            {card?.website && (
                                                <div>
                                                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Website</p>
                                                    <a href={card?.website} target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline">
                                                        <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                                                        {card?.website.replace(/https?:\/\/(www\.)?/, '')}
                                                    </a>
                                                </div>
                                            )}
                                            {card?.booking_link && (
                                                <div>
                                                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Booking</p>
                                                    <a href={card?.booking_link} target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline">
                                                        <CalendarCheck className="h-3.5 w-3.5 flex-shrink-0" />
                                                        Book now
                                                    </a>
                                                </div>
                                            )}
                                            <div className="h-px w-full bg-border" />
                                            {Object.keys(socialMedia).length > 0 && (
                                                <div>
                                                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                                        Social
                                                    </p>
                                                    <div className="flex flex-wrap gap-3">
                                                        {socialMedia.instagram && (
                                                            <a
                                                                href={socialMedia.instagram}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <FaInstagram className="h-5 w-5 text-pink-500" />
                                                            </a>
                                                        )}
                                                        {socialMedia.tiktok && (
                                                            <a
                                                                href={socialMedia.tiktok}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <TikTokIcon className="h-5 w-5" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 border-t border-border bg-secondary/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
                                            <span className="flex-1 truncate font-mono text-[12px] text-muted-foreground">
                                                {isRejected ? "••••••••••••••••••••••" : card?.business_card_link}
                                            </span>
                                            {isRejected && (
                                                <>
                                                    <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-red-700">
                                                            Your access card has been rejected.
                                                        </p>
                                                        <p className="mt-1 text-xs text-red-600">
                                                            Please update your details and submit your access card again. It will remain unavailable until it is approved.
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                            {!isRejected && (
                                                <button
                                                    onClick={() => handleCopy(card, key)}
                                                    className="flex-shrink-0 rounded-lg p-1 hover:bg-accent transition-colors"
                                                    aria-label="Copy link"
                                                >
                                                    {copiedKey === key ? (
                                                        <Check className="h-3.5 w-3.5 text-green-600" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <a
                                                href={isRejected ? undefined : card?.business_card_link}
                                                target={isRejected ? undefined : "_blank"}
                                                rel={isRejected ? undefined : "noopener noreferrer"}
                                                onClick={(e) => isRejected && e.preventDefault()}
                                                className={`btn-primary !px-4 !py-2 !text-xs !rounded-xl flex items-center gap-1.5 ${isRejected
                                                    ? "pointer-events-none opacity-50 cursor-not-allowed"
                                                    : ""
                                                    }`}
                                                aria-disabled={isRejected}
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                                View my access card
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* QR Modal */}
            {qrCard && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4"
                    onClick={() => setQrKey(null)}
                >
                    <div className="card-glamlink w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">Your GlamCard QR</h3>
                                <p className="text-[11px] text-muted-foreground mt-0.5">Scan to view access card</p>
                            </div>
                            <button onClick={() => setQrKey(null)} className="rounded-lg p-1.5 hover:bg-secondary transition-colors">
                                <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>
                        <div className="flex justify-center rounded-xl bg-white p-5">
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
                        <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2">
                            <span className="flex-1 truncate font-mono text-[11px] text-muted-foreground">{qrCard?.business_card_link}</span>
                            <button
                                onClick={() => handleCopy(qrCard, qrKey as CardKey)}
                                className="flex-shrink-0 rounded-md p-1 hover:bg-accent transition-colors"
                            >
                                {copiedKey === qrKey ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                            </button>
                        </div>
                        <a
                            href={qrCard?.business_card_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary mt-4 w-full !rounded-xl !text-xs flex items-center justify-center gap-2"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View my access card
                        </a>
                    </div>
                </div>
            )}

            {/* Subscribe Prompt Modal */}
            {subscriptionPromptCard && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4"
                    onClick={() => setSubscriptionPromptKey(null)}
                >
                    <div
                        className="card-glamlink w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-2 flex items-start justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">Subscribe to edit this card</h3>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                    {(subscriptionPromptCard?.business_name || subscriptionPromptCard?.name || 'This card')}'s
                                    subscription is inactive. Choose a plan to unlock editing.
                                </p>
                                {disabledPlanIds.length > 0 && (
                                    <p className="text-[11px] text-muted-foreground mt-1">
                                        You've already paid for an NFC card on this card, so NFC plans are unavailable.
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => setSubscriptionPromptKey(null)}
                                className="rounded-lg p-1.5 hover:bg-secondary transition-colors flex-shrink-0"
                            >
                                <X className="h-4 w-4 text-muted-foreground" />
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

            {/* Include NFC Modal — independent of the subscribe-prompt modal */}
            {nfcPromptCard && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4"
                    onClick={() => setNfcPromptKey(null)}
                >
                    <div
                        className="card-glamlink w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-2 flex items-start justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">Add an NFC keychain</h3>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                    Add a physical NFC keychain to {(nfcPromptCard?.business_name || nfcPromptCard?.name || 'this card')}.
                                </p>
                            </div>
                            <button
                                onClick={() => setNfcPromptKey(null)}
                                className="rounded-lg p-1.5 hover:bg-secondary transition-colors flex-shrink-0"
                            >
                                <X className="h-4 w-4 text-muted-foreground" />
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