'use client';
import React, { useState } from 'react';
import { FaInstagram } from "react-icons/fa";
import {
    Globe,
    Instagram,
    Copy,
    Check,
    ExternalLink,
    CalendarCheck,
    X,
    QrCode,
} from 'lucide-react';
import { AccessCardData } from './types';
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.84 2.84 0 0 1 2.31-4.64 2.86 2.86 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.44-.05z" />
    </svg>
);
interface Props {
    cardData: AccessCardData;
    onPayNow?: () => void;
    user: any;
    error?: string;
}
export default function MyAccessCard({
    user,
    cardData,
    onPayNow,
    error,
}: Props) {
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);

    // 👇 PASTE HERE
    if (error === "Business card not found." || !cardData) {
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

    // Existing code
    const initials =
        cardData?.name
            ?.split(" ")
            ?.map((n) => n[0])
            ?.join("")
            ?.toUpperCase()
            ?.slice(0, 2) || "GL";
    const handleCopy = async () => {
        if (!cardData?.business_card_link) return;

        try {
            await navigator.clipboard.writeText(cardData.business_card_link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error(err);
        }
    };
    const bioSummary = (cardData?.bio || '')
        .replace(/\n\n/g, ' · ')
        .replace(/\n/g, ' ')
        .trim();
    console.log(cardData, "cardDatacardData")
    type SocialMedia = {
        instagram?: string;
        tiktok?: string;
        facebook?: string;
        linkedin?: string;
        twitter?: string;
    };

    const socialMedia: SocialMedia = (() => {
        try {
            return typeof cardData?.social_media === "string"
                ? JSON.parse(cardData.social_media)
                : cardData?.social_media || {};
        } catch (error) {
            console.error("Invalid social_media JSON:", error);
            return {};
        }
    })();

    return (
        <>
            <div className="space-y-4">
                {/* ── Horizontal Visiting Card ── */}
                <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-medium)]">
                    <div className="flex flex-col sm:flex-row min-h-[200px]">
                        {/* Accent bar */}
                        <div className="h-1.5 w-full sm:h-auto sm:w-1.5 flex-shrink-0 bg-primary" />
                        {/* Identity */}
                        <div className="flex flex-col items-center justify-center gap-3 border-b border-border sm:border-b-0 sm:border-r px-6 py-6 sm:min-w-[160px] sm:px-8">
                            {cardData?.profile_image ? (
                                <img
                                    src={cardData?.profile_image}
                                    alt={cardData?.name}
                                    className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
                                />
                            ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-foreground ring-2 ring-primary/20">
                                    {initials}
                                </div>
                            )}
                            <div className="text-center">
                                <p className="text-[15px] font-semibold text-foreground leading-tight">{cardData?.name}</p>
                                <p className="mt-0.5 text-xs font-medium text-primary">{cardData?.professional_title}</p>
                                {cardData?.business_name && (
                                    <p className="mt-0.5 text-[11px] text-muted-foreground">{cardData?.business_name}</p>
                                )}
                            </div>
                            {/* Status */}
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide border ${["paid", "completed"].includes(
                                    cardData?.payment_status?.toLowerCase() || ""
                                )
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : cardData?.payment_status?.toLowerCase() === "pending"
                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                        : "bg-red-50 text-red-700 border-red-200"
                                    }`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${["paid", "completed"].includes(
                                        cardData?.payment_status?.toLowerCase() || ""
                                    )
                                        ? "bg-green-500"
                                        : cardData?.payment_status?.toLowerCase() === "pending"
                                            ? "bg-amber-500"
                                            : "bg-red-500"
                                        }`}
                                />
                                {cardData?.payment_status || "Unknown"}
                            </span>
                        </div>
                        {/* Bio + Specialties */}
                        <div className="flex flex-1 flex-col justify-center gap-4 border-b border-border sm:border-b-0 sm:border-r px-6 py-6 sm:px-7">
                            <div>
                                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">About</p>
                                <div
                                    className="text-[13px] leading-relaxed text-foreground/80"
                                    dangerouslySetInnerHTML={{ __html: bioSummary || "" }}
                                />
                            </div>
                            {/* {cardData?.specialties?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {cardData?.specialties.map((s, i) => (
                    <span key={i} className="rounded-full border border-primary/20 bg-accent px-2.5 py-0.5 text-[11px] font-medium text-accent-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              )} */}
                        </div>
                        {/* Links + Social */}
                        <div className="flex flex-col justify-center gap-4 px-6 py-6 sm:min-w-[200px] sm:px-7">
                            {cardData?.website && (
                                <div>
                                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Website</p>
                                    <a href={cardData?.website} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline">
                                        <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                                        {cardData?.website.replace(/https?:\/\/(www\.)?/, '')}
                                    </a>
                                </div>
                            )}
                            {cardData?.booking_link && (
                                <div>
                                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Booking</p>
                                    <a href={cardData?.booking_link} target="_blank" rel="noopener noreferrer"
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
                    {/* Footer */}
                    <div className="flex flex-col gap-3 border-t border-border bg-secondary/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
                            <span className="flex-1 truncate font-mono text-[12px] text-muted-foreground">
                                {cardData?.business_card_link}
                            </span>
                            <button onClick={handleCopy} className="flex-shrink-0 rounded-lg p-1 hover:bg-accent transition-colors" aria-label="Copy link">
                                {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                            </button>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {/* <button
                                onClick={() => setShowQR(true)}
                                className="btn-outline !px-4 !py-2 !text-xs !rounded-xl flex items-center gap-1.5"
                            >
                                <QrCode className="h-3.5 w-3.5" />
                                QR Code
                            </button> */}
                            <a
                                href={cardData?.business_card_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary !px-4 !py-2 !text-xs !rounded-xl flex items-center gap-1.5"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                View my access card
                            </a>
                        </div>
                    </div>
                </div>
                {cardData?.subscription_status !== 'active' && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                            <p className="text-sm text-amber-800 font-medium">
                                Your subscription is <span className="capitalize font-semibold">{cardData?.subscription_status}</span>. Activate to publish your card.
                            </p>
                        </div>
                        {/* ✅ Replace static button with this: */}
                        <button
                            onClick={onPayNow}
                            className="btn-primary !px-4 !py-2 !text-xs !rounded-xl flex-shrink-0"
                        >
                            Pay Now
                        </button>
                    </div>
                )}
            </div>
            {/* QR Modal */}
            {
                showQR && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4"
                        onClick={() => setShowQR(false)}
                    >
                        <div className="card-glamlink w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground">Your GlamCard QR</h3>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">Scan to view access card</p>
                                </div>
                                <button onClick={() => setShowQR(false)} className="rounded-lg p-1.5 hover:bg-secondary transition-colors">
                                    <X className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="flex justify-center rounded-xl bg-white p-5">
                                {cardData?.business_card_qr ? (
                                    <img src={cardData?.business_card_qr} alt="QR Code" className="h-48 w-48 object-contain" />
                                ) : (
                                    <div className="h-48 w-48 flex items-center justify-center bg-secondary rounded-lg text-muted-foreground text-sm">
                                        No QR available
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-sm font-semibold text-foreground">{cardData?.name}</p>
                                <p className="text-[11px] text-muted-foreground">{cardData?.professional_title}</p>
                            </div>
                            <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2">
                                <span className="flex-1 truncate font-mono text-[11px] text-muted-foreground">{cardData?.business_card_link}</span>
                                <button onClick={handleCopy} className="flex-shrink-0 rounded-md p-1 hover:bg-accent transition-colors">
                                    {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                                </button>
                            </div>
                            <a
                                href={cardData?.business_card_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary mt-4 w-full !rounded-xl !text-xs flex items-center justify-center gap-2"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                View my access card
                            </a>
                        </div>
                    </div>
                )
            }
        </>
    );
}