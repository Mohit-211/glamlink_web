'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, QrCode } from 'lucide-react';
import { AccessCardData } from './types';

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
  'Print your QR code and display it at your studio.',
  'Add it to your business card, flyers, or invoices.',
  'Share the link on WhatsApp, Instagram, Facebook, or anywhere else.',
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
      <div className="flex flex-col items-center justify-center px-4 py-14 sm:py-20">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
          <QrCode className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-center text-lg font-semibold text-foreground sm:text-2xl">
          Create your business card
        </h2>
        <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
          Your QR code is generated from your GlamCard. Create one to get a code you can share.
        </p>
        <button
          onClick={() => (window.location.href = '/access')}
          className="mt-6 w-full max-w-xs rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground cursor-pointer sm:w-auto"
        >
          Create business card
        </button>
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

  const StatusPill = ({ isPaid, large }: { isPaid: boolean; large?: boolean }) => (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 leading-tight ${
        large ? 'text-[11px]' : 'text-[10px]'
      } ${
        isPaid
          ? 'border-green-600/30 bg-green-600/10 text-green-700'
          : 'border-border bg-secondary text-muted-foreground'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
          isPaid ? 'bg-green-600' : 'bg-muted-foreground'
        }`}
      />
      {isPaid ? 'Paid' : 'Unpaid'}
    </span>
  );

  const TipList = () => (
    <ul className="space-y-1.5 text-xs text-foreground/70">
      {TIPS.map((tip) => (
        <li key={tip} className="flex items-start gap-2">
          <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
          {tip}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="w-full min-w-0">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">QR code</h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
            Share your QR code to let clients view your GlamCard instantly.
          </p>
        </div>
        {selectedCard && (
          <div className="hidden sm:block">
            <StatusPill isPaid={paid} large />
          </div>
        )}
      </div>

      {/* ── Card switcher — mobile: horizontal pills that scroll ── */}
      {multi && (
        <div className="mt-4 min-w-0 lg:hidden">
          <div className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2">
            {cards.map((card) => {
              const active = String(card.id) === String(selectedCard?.id);
              return (
                <button
                  key={card.id}
                  onClick={() => setSelectedId(String(card.id))}
                  className={`flex max-w-[70vw] flex-shrink-0 snap-start items-center gap-2 rounded-full border px-3 py-2 text-left transition-colors cursor-pointer ${
                    active
                      ? 'border-primary bg-accent text-accent-foreground'
                      : 'border-border bg-card text-foreground'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {initials(card.name)}
                  </span>
                  <span className="truncate text-xs font-medium">
                    {card.name || 'Untitled card'}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                      isPaidCard(card) ? 'bg-green-600' : 'bg-muted-foreground'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div
        className={`mt-4 sm:mt-6 ${
          multi ? 'lg:grid lg:grid-cols-[236px_minmax(0,1fr)] lg:gap-6' : ''
        }`}
      >
        {/* ── Card switcher — desktop: vertical list in a sidebar ── */}
        {multi && (
          <aside className="hidden lg:block">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Your cards ({cards.length})
            </p>
            <div className="space-y-1.5">
              {cards.map((card) => {
                const active = String(card.id) === String(selectedCard?.id);
                const cardPaid = isPaidCard(card);
                return (
                  <button
                    key={card.id}
                    onClick={() => setSelectedId(String(card.id))}
                    className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors cursor-pointer ${
                      active
                        ? 'border-primary bg-accent'
                        : 'border-border bg-card hover:bg-secondary'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {initials(card.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-xs font-medium leading-tight ${
                          active ? 'text-accent-foreground' : 'text-foreground'
                        }`}
                      >
                        {card.name || 'Untitled card'}
                      </span>
                      <span
                        className={`block truncate text-[10px] leading-tight ${
                          cardPaid ? 'text-green-600' : 'text-muted-foreground'
                        }`}
                      >
                        {cardPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* ── Main ────────────────────────────────────────────── */}
        {selectedCard && (
          <div className="grid min-w-0 gap-4 sm:gap-5 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)] xl:items-start xl:gap-6">
            {/* QR panel */}
            <section className="card-glamlink !hover:transform-none min-w-0">
              <div className="mb-3 flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-muted-foreground">
                  {initials(selectedCard.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-tight text-foreground">
                    {selectedCard.name || 'Untitled card'}
                  </p>
                  <p
                    className={`truncate text-[11px] leading-tight ${
                      paid ? 'text-green-600' : 'text-muted-foreground'
                    }`}
                  >
                    {paid ? 'Ready to share' : 'Locked until payment is complete'}
                  </p>
                </div>
                <span className="sm:hidden">
                  <StatusPill isPaid={paid} />
                </span>
              </div>

              <div className="relative flex justify-center overflow-hidden rounded-xl border border-border bg-white p-4 sm:p-6">
                {selectedCard.business_card_qr ? (
                  <>
                    <img
                      src={selectedCard.business_card_qr}
                      alt="GlamCard QR Code"
                      className="aspect-square h-auto w-[min(58vw,240px)] object-contain sm:w-52"
                    />
                    {/* {!paid && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 p-4">
                        <div className="max-w-[220px] rounded-xl bg-white p-4 text-center shadow-xl">
                          <p className="text-lg">🔒</p>
                          <p className="text-sm font-semibold text-gray-900">QR code locked</p>
                          <p className="mt-1 text-xs text-gray-600">
                            Complete payment for this card to unlock its QR code.
                          </p>
                          {onPayNow && (
                            <button
                              onClick={() => onPayNow(selectedCard)}
                              className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 cursor-pointer"
                            >
                              Unlock now
                            </button>
                          )}
                        </div>
                      </div>
                    )} */}
                  </>
                ) : (
                  <div className="flex aspect-square w-[min(58vw,240px)] items-center justify-center rounded-xl bg-secondary text-sm text-muted-foreground sm:w-52">
                    No QR available
                  </div>
                )}
              </div>

              {paid && (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() => handleCopy(selectedCard.business_card_link)}
                    className="btn-outline flex min-h-11 flex-1 items-center justify-center gap-1.5 !py-2 !text-xs cursor-pointer sm:min-h-0"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? 'Copied' : 'Copy link'}
                  </button>
                  {selectedCard.business_card_qr && (
                    <button
                      onClick={() => handleDownloadQR(selectedCard)}
                      className="btn-outline flex min-h-11 flex-1 items-center justify-center gap-1.5 !px-3 !py-2 !text-xs cursor-pointer sm:min-h-0 sm:flex-none"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* Details + sharing */}
            <div className="min-w-0 space-y-4">
              <section className="card-glamlink !hover:transform-none">
                <h3 className="text-sm font-semibold text-foreground">Card details</h3>

                {/* Mobile: stacked rows. Tablet and up: two columns. */}
                <div className="mt-3 grid gap-3 sm:grid-cols-2 sm:gap-4">
                  <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Name
                    </p>
                    <p className="break-words text-sm font-medium text-foreground">
                      {selectedCard.name || '-'}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Title
                    </p>
                    <p className="break-words text-sm text-foreground">
                      {selectedCard.professional_title || '-'}
                    </p>
                  </div>
                  <div className="min-w-0 sm:col-span-2">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Card link
                    </p>
                    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2">
                      <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">
                        {/* {paid
                          ? selectedCard.business_card_link
                          : '••••••••••••••••••••••••••••••'} */}
                        {selectedCard.business_card_link}
                      </span>
                      {/* {paid && ( */}
                      <button
                        onClick={() => handleCopy(selectedCard.business_card_link)}
                        aria-label="Copy card link"
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent cursor-pointer"
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </button>
                      {/* )} */}
                    </div>
                  </div>
                </div>
              </section>

              {/* Sharing tips — collapsed on mobile, open on desktop */}
              <div className="rounded-xl border border-primary/20 bg-accent/40">
                <details className="group p-3 sm:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-primary">
                    How to share
                    <span className="text-base leading-none transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="mt-2">
                    <TipList />
                  </div>
                </details>

                <div className="hidden p-4 sm:block">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-primary">
                    How to share
                  </p>
                  <TipList />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}