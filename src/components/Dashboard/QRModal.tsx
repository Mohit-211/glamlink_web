'use client';

import { X, Download } from 'lucide-react';

interface QRModalProps {
  onClose: () => void;
}

export function QRModal({ onClose }: QRModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/25 backdrop-blur-sm">
      <div className="w-full max-w-xs rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-foreground">Access QR Code</p>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="mx-auto mb-4 w-fit rounded-2xl border-2 border-border bg-white p-4 shadow-md">
            <svg viewBox="0 0 110 110" className="h-44 w-44" xmlns="http://www.w3.org/2000/svg">
              {/* Corner finder patterns */}
              <rect x="5"  y="5"  width="30" height="30" rx="3" fill="#18181b"/>
              <rect x="9"  y="9"  width="22" height="22" rx="2" fill="white"/>
              <rect x="13" y="13" width="14" height="14" rx="1" fill="#18181b"/>
              <rect x="75" y="5"  width="30" height="30" rx="3" fill="#18181b"/>
              <rect x="79" y="9"  width="22" height="22" rx="2" fill="white"/>
              <rect x="83" y="13" width="14" height="14" rx="1" fill="#18181b"/>
              <rect x="5"  y="75" width="30" height="30" rx="3" fill="#18181b"/>
              <rect x="9"  y="79" width="22" height="22" rx="2" fill="white"/>
              <rect x="13" y="83" width="14" height="14" rx="1" fill="#18181b"/>
              {/* Data modules */}
              {[
                [42,5],[49,5],[56,5],[42,12],[56,12],[42,19],[49,19],[56,19],
                [5,42],[12,42],[19,42],[5,49],[19,49],[5,56],[12,56],[19,56],
                [42,42],[56,42],[49,49],[42,56],[56,56],[63,63],[70,63],[77,63],
                [70,70],[63,77],[77,77],[84,70],[42,70],[49,77],[56,70],[42,84],[56,84],
              ].map(([x, y], i) => (
                <rect key={i} x={x} y={y} width="5" height="5" rx="0.5" fill="#18181b" />
              ))}
            </svg>
          </div>
          <p className="text-sm font-semibold text-foreground">GLM-2024-12345</p>
          <p className="text-xs text-muted-foreground mt-1">Scan to verify subscription access</p>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          <button className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition">
            <Download className="h-3.5 w-3.5" /> Download
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-border bg-secondary py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
