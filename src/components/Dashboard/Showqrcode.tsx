'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check, Download } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-semibold text-gray-900">
          Create your business card
        </h2>
        <p className="mt-2 text-sm text-gray-500 text-center max-w-md">
          You need to create a business card before generating a QR code.
        </p>
        <button
          onClick={() => (window.location.href = '/apply/digital-card')}
          className="mt-6 rounded-xl bg-primary px-6 py-3 text-white font-medium cursor-pointer"
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
      link.download = `${card?.name || 'access-card'}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('QR Download Error:', err);
    }
  };

  const paid = isPaidCard(selectedCard || undefined);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">QR code</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Share your QR code to let clients view your GlamCard instantly.
        </p>
      </div>

      {/* Card switcher — a labeled row of "tabs", each showing who the card
          belongs to and whether it's paid, so it's never ambiguous which
          card's QR you're viewing */}
      {cards.length > 1 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">
            You have {cards.length} business cards — select one to view its QR code
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {cards.map((card) => {
              const active = String(card.id) === String(selectedCard?.id);
              const cardPaid = isPaidCard(card);
              return (
                <button
                  key={card.id}
                  onClick={() => setSelectedId(String(card.id))}
                  className={`flex-shrink-0 flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all duration-150 cursor-pointer ${
                    active
                      ? 'border-primary bg-accent'
                      : 'border-border bg-card hover:bg-secondary'
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {initials(card.name)}
                  </div>
                  <div>
                    <p
                      className={`text-xs font-medium leading-tight ${
                        active ? 'text-accent-foreground' : 'text-foreground'
                      }`}
                    >
                      {card.name || 'Untitled card'}
                    </p>
                    <p
                      className={`text-[10px] leading-tight flex items-center gap-1 ${
                        cardPaid ? 'text-green-600' : 'text-muted-foreground'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          cardPaid ? 'bg-green-600' : 'bg-muted-foreground'
                        }`}
                      />
                      {cardPaid ? 'Paid' : 'Unpaid'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedCard && (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* QR Card */}
          <div className="card-glamlink !hover:transform-none w-full md:w-auto flex-shrink-0">
            {/* Which card this QR belongs to — always visible, no guessing */}
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-muted-foreground">
                {initials(selectedCard.name)}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground leading-tight">
                  {selectedCard.name || 'Untitled card'}
                </p>
                <p
                  className={`text-[11px] leading-tight ${
                    paid ? 'text-green-600' : 'text-muted-foreground'
                  }`}
                >
                  {paid ? 'QR unlocked and ready to share' : 'Locked until payment is complete'}
                </p>
              </div>
            </div>

            <div className="relative flex justify-center rounded-xl bg-white p-6 border border-border overflow-hidden">
              {selectedCard.business_card_qr ? (
                <>
                  <img
                    src={selectedCard.business_card_qr}
                    alt="GlamCard QR Code"
                    className={`h-52 w-52 object-contain transition-all duration-300 ${
                      paid ? '' : 'blur-md opacity-30 pointer-events-none select-none'
                    }`}
                  />
                  {!paid && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="rounded-xl bg-white p-4 text-center shadow-xl max-w-[200px]">
                        <p className="text-lg">🔒</p>
                        <p className="font-semibold text-gray-900 text-sm">QR code locked</p>
                        <p className="mt-1 text-xs text-gray-600">
                          Complete payment for this card to unlock its QR code.
                        </p>
                        {onPayNow && (
                          <button
                            onClick={() => onPayNow(selectedCard)}
                            className="mt-3 w-full rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 cursor-pointer"
                          >
                            Unlock now
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-52 w-52 flex items-center justify-center bg-secondary rounded-xl text-muted-foreground text-sm">
                  No QR available
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              {paid && (
                <button
                  onClick={() => handleCopy(selectedCard.business_card_link)}
                  className="btn-outline flex-1 !text-xs !py-2 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? 'Copied!' : 'Copy link'}
                </button>
              )}
              {paid && selectedCard.business_card_qr && (
                <button
                  onClick={() => handleDownloadQR(selectedCard)}
                  className="btn-outline !text-xs !py-2 flex items-center gap-1.5 !px-3 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 space-y-4">
            <div className="card-glamlink !hover:transform-none space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Card details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    Name
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {selectedCard.name || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    Title
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedCard.professional_title || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    Card link
                  </p>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2">
                    <span className="flex-1 truncate font-mono text-[11px] text-muted-foreground">
                      {paid
                        ? selectedCard.business_card_link
                        : '••••••••••••••••••••••••••••••'}
                    </span>
                    {paid && (
                      <button
                        onClick={() => handleCopy(selectedCard.business_card_link)}
                        className="flex-shrink-0 rounded-md p-1 hover:bg-accent transition-colors cursor-pointer"
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sharing Tips */}
            <div className="rounded-xl border border-primary/20 bg-accent/40 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-2">
                How to share
              </p>
              <ul className="space-y-1.5 text-xs text-foreground/70">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  Print your QR code and display it at your studio.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  Add it to your business card, flyers, or invoices.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  Share the link directly on WhatsApp, Instagram, Facebook, or other social platforms.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}