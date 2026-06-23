'use client';

import { useState } from 'react';
import { CreditCard, Star, Plus, Trash2 } from 'lucide-react';
import { CARDS, CARD_GRADIENTS } from './data';

export function CardsTab() {
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Payment Methods</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{CARDS.length} cards saved</p>
        </div>
      </div>

      <div className="space-y-4 mb-5">
        {CARDS.map(card => {
          const grad = CARD_GRADIENTS[card.brand] ?? 'from-slate-700 to-slate-900';
          const isEditing = editing === card.id;

          return (
            <div
              key={card.id}
              className={`rounded-2xl border-2 bg-card shadow-[var(--shadow-soft)] overflow-hidden transition-all ${
                card.isDefault ? 'border-primary' : 'border-border'
              }`}
            >
              {/* Card visual */}
              <div className={`relative bg-gradient-to-br ${grad} p-5 text-white`}>
                <div className="absolute right-4 top-4 opacity-20">
                  <CreditCard className="h-10 w-10" />
                </div>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">Payment Method</p>
                    <p className="text-sm font-bold mt-0.5">{card.brand}</p>
                  </div>
                  {card.isDefault && (
                    <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                      <Star className="h-2.5 w-2.5" /> Default
                    </span>
                  )}
                </div>
                <p className="text-base font-mono tracking-[0.2em] text-white/80">
                  •••• •••• •••• {card.lastFour}
                </p>
                <p className="mt-2 text-xs text-white/50">
                  Expires {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
                </p>
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-between px-5 py-3 bg-secondary/30 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  {card.isDefault ? 'Used for all purchases' : 'Backup card'}
                </p>
                <button
                  onClick={() => setEditing(isEditing ? null : card.id)}
                  className="text-xs font-semibold text-primary hover:underline underline-offset-2 transition"
                >
                  {isEditing ? 'Done' : 'Edit'}
                </button>
              </div>

              {/* Inline edit panel */}
              {isEditing && (
                <div className="px-5 py-4 space-y-3 border-t border-border bg-card">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                        Cardholder name
                      </label>
                      <input
                        placeholder="Full name"
                        className="w-full rounded-xl border border-input bg-secondary/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1 block">Expiry</label>
                      <input
                        placeholder="MM / YY"
                        className="w-full rounded-xl border border-input bg-secondary/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button className="flex-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition">
                      Save changes
                    </button>
                    <button className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-dashed border-border py-3.5 text-sm font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition">
        <Plus className="h-4 w-4" /> Add new card
      </button>
    </div>
  );
}
