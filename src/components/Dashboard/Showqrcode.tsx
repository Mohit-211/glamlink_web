'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  ExternalLink,
  Download,
} from 'lucide-react';
import { AccessCardData } from './types';

interface Props {
  cardData: AccessCardData;
  error?: string;
}

export default function ShowQRCode({ cardData ,error}: Props) {
const [copied, setCopied] = useState(false);

if (error === "Business card not found." || !cardData) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h2 className="text-2xl font-semibold text-gray-900">
        Create Your Business Card
      </h2>

      <p className="mt-2 text-sm text-gray-500 text-center max-w-md">
        You need to create a business card before generating a QR code.
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        cardData.business_card_link
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Copy Error:', error);
    }
  };

  const handleDownloadQR = async () => {
    if (!cardData?.business_card_qr) return;

    try {
      const response = await fetch(
        cardData.business_card_qr
      );

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;
      link.download = `${
        cardData?.name || 'access-card'
      }-qr.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('QR Download Error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          QR Code
        </h2>

        <p className="text-xs text-muted-foreground mt-0.5">
          Share your QR code to let clients view your
          GlamCard instantly.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* QR Card */}
        <div className="card-glamlink !hover:transform-none w-full md:w-auto flex-shrink-0">
          <div className="flex justify-center rounded-xl bg-white p-6 border border-border">
            {cardData?.business_card_qr ? (
              <img
                src={cardData.business_card_qr}
                alt="GlamCard QR Code"
                className="h-52 w-52 object-contain"
              />
            ) : (
              <div className="h-52 w-52 flex items-center justify-center bg-secondary rounded-xl text-muted-foreground text-sm">
                No QR available
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleCopy}
              className="btn-outline flex-1 !text-xs !py-2 flex items-center justify-center gap-1.5"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}

              {copied ? 'Copied!' : 'Copy Link'}
            </button>

            {cardData?.business_card_qr && (
              <button
                onClick={handleDownloadQR}
                className="btn-outline !text-xs !py-2 flex items-center gap-1.5 !px-3"
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
            <h3 className="text-sm font-semibold text-foreground">
              Card Details
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  Name
                </p>

                <p className="text-sm font-medium text-foreground">
                  {cardData?.name || '-'}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  Title
                </p>

                <p className="text-sm text-foreground">
                  {cardData?.professional_title || '-'}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  Card Link
                </p>

                <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2">
                  <span className="flex-1 truncate font-mono text-[11px] text-muted-foreground">
                    {cardData?.business_card_link ||
                      'No Link Available'}
                  </span>

                  <button
                    onClick={handleCopy}
                    className="flex-shrink-0 rounded-md p-1 hover:bg-accent transition-colors"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sharing Tips */}
          <div className="rounded-xl border border-primary/20 bg-accent/40 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-2">
              How to Share
            </p>

            <ul className="space-y-1.5 text-xs text-foreground/70">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                Print your QR code and display it at your
                studio.
              </li>

              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                Add it to your business card, flyers, or
                invoices.
              </li>

              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                Share the link directly on WhatsApp,
                Instagram, Facebook, or other social
                platforms.
              </li>
            </ul>
          </div>

          {/* View Card */}
          {cardData?.business_card_link && (
            <a
              href={cardData.business_card_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full !text-sm flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View My Access Card
            </a>
          )}
        </div>
      </div>
    </div>
  );
}