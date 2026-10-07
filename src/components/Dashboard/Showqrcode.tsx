'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Copy, Check, Download, QrCode, Share2, ExternalLink, Printer, CreditCard, MessageCircle } from 'lucide-react';
import { AccessCardData } from './types';
import { EmptyState, Eyebrow, PageHeader, StatusBadge, btn } from './shell/ui';
import { cn } from '@/lib/utils';

interface Props {
  cardData: AccessCardData | AccessCardData[] | null | undefined;
  error?: string;
  /** Optional: lets the "Unlock now" button jump straight into payment */
  onPayNow?: (card: AccessCardData) => void;
}

function isPaidCard(card?: AccessCardData) {
  const status = (card?.payment_status ?? '').trim().toLowerCase();
  return status === 'paid' || status === 'completed';
}

function initials(name?: string) {
  if (!name) return '??';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

const TIPS = [
  { icon: Printer, text: 'Print your QR code and display it at your studio.' },
  { icon: CreditCard, text: 'Add it to your business card, flyers, or invoices.' },
  { icon: MessageCircle, text: 'Share the link on WhatsApp, Instagram, Facebook, or anywhere else.' },
];

export default function ShowQRCode({ cardData, error, onPayNow }: Props) {
  const [copied, setCopied] = useState(false);

  // Normalize to an array regardless of what the API / parent sends us
  const cards: AccessCardData[] = useMemo(
    () => (Array.isArray(cardData) ? cardData : cardData ? [cardData] : []),
    [cardData]
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedCard =
    cards.find((c) => String(c.id) === String(selectedId)) ?? cards[0] ?? null;

  if (error === 'Business card not found.' || cards.length === 0) {
    return (
      <div>
        <PageHeader title="QR Code" description="Let clients open your Access Card with a single scan." />
        <EmptyState
          bordered
          icon={QrCode}
          title="Create your Glamlink Access Card"
          message="Your QR code is generated from your Access Card. Create one to get a code you can share."
          action={
            <button onClick={() => (window.location.href = '/access')} className={btn.primary}>
              Create Access Card
            </button>
          }
        />
      </div>
    );
  }

  const handleCopy = async (link?: string) => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy Error:', err);
    }
  };

  const handleShare = async (card: AccessCardData) => {
    const link = card?.business_card_link;
    if (!link) return;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: card?.name ? `${card.name} on Glamlink` : 'My Glamlink Access Card', url: link });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }
    await handleCopy(link);
    toast.success('Link copied — paste it anywhere to share');
  };

  const handleDownloadQR = async (card: AccessCardData) => {
    if (!card?.business_card_qr) return;
    try {
      const response = await fetch(card.business_card_qr);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${card?.name || 'access'}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('QR Download Error:', err);
    }
  };

  const paid = isPaidCard(selectedCard || undefined);
  const multi = cards.length > 1;

  return (
    <div className="w-full min-w-0">
      <PageHeader
        title="QR Code"
        description="Clients scan this code with their phone camera to open your Access Card instantly — no app needed."
      />

      {/* Card switcher */}
      {multi && (
        <div className="mb-5 min-w-0">
          <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {cards.map((card) => {
              const active = String(card.id) === String(selectedCard?.id);
              return (
                <button
                  key={card.id}
                  onClick={() => setSelectedId(String(card.id))}
                  aria-pressed={active}
                  className={cn(
                    'flex max-w-[70vw] flex-shrink-0 snap-start items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-left transition-colors',
                    active ? 'border-primary bg-primary/10 text-accent-foreground' : 'border-border bg-card text-foreground hover:border-primary/40'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
                      active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                    )}
                  >
                    {initials(card.name)}
                  </span>
                  <span className="truncate text-sm font-medium">{card.name || 'Untitled card'}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedCard && (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
          {/* QR showcase */}
          <section className="rounded-2xl border border-border bg-card p-5 text-center sm:p-6">
            <div className="flex items-center justify-between gap-3 text-left">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{selectedCard.name || 'Untitled card'}</p>
                {selectedCard.professional_title && (
                  <p className="truncate text-xs text-primary">{selectedCard.professional_title}</p>
                )}
              </div>
              <StatusBadge tone={paid ? 'success' : 'neutral'}>{paid ? 'Paid' : 'Unpaid'}</StatusBadge>
            </div>

            <div className="mx-auto mt-5 w-fit rounded-2xl border border-border bg-white p-4 sm:p-5">
              {selectedCard.business_card_qr ? (
                <img
                  src={selectedCard.business_card_qr}
                  alt={`QR code for ${selectedCard.name || 'your Access Card'}`}
                  className="aspect-square h-auto w-[min(64vw,256px)] object-contain"
                />
              ) : (
                <div className="flex aspect-square w-[min(64vw,256px)] flex-col items-center justify-center gap-2 rounded-xl bg-secondary text-sm text-muted-foreground">
                  <QrCode className="h-8 w-8" />
                  No QR available yet
                </div>
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {paid ? 'Ready to share' : 'Locked until payment is complete'}
            </p>

            {paid && (
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <button onClick={() => handleCopy(selectedCard.business_card_link)} className={btn.chip}>
                  {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy link'}
                </button>
                {selectedCard.business_card_qr && (
                  <button onClick={() => handleDownloadQR(selectedCard)} className={btn.chip}>
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                )}
                <button onClick={() => handleShare(selectedCard)} className={cn(btn.chip, 'col-span-2 sm:col-span-1')}>
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </button>
              </div>
            )}
          </section>

          {/* Link + how to use */}
          <div className="min-w-0 space-y-4">
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <Eyebrow>Your card link</Eyebrow>
              <div className="mt-2 flex min-w-0 items-center gap-1 rounded-xl border border-border bg-secondary/50 py-1 pl-3 pr-1">
                <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
                  {selectedCard.business_card_link}
                </span>
                <button
                  onClick={() => handleCopy(selectedCard.business_card_link)}
                  aria-label="Copy card link"
                  className={btn.icon + ' h-8 w-8'}
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                The QR code and this link open the same page, so you can share whichever is easier.
              </p>
              {selectedCard.business_card_link && (
                <a
                  href={selectedCard.business_card_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={btn.primary + ' mt-4 w-full sm:w-auto'}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open my Access Card
                </a>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <Eyebrow>Ways to share</Eyebrow>
              <ul className="mt-3 space-y-3">
                {TIPS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="pt-1.5 text-sm text-foreground/80">{text}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
