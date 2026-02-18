"use client";

import React from "react";
import { Copy, Calendar } from "lucide-react";
import { Promotion } from "@/lib/pages/for-professionals/types/professional";

interface SimplePromoCardProps {
  promotion: Promotion;
}

export default function SimplePromoCard({ promotion }: SimplePromoCardProps) {
  const copyPromoCode = () => {
    if (promotion.promoCode) {
      navigator.clipboard.writeText(promotion.promoCode);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {promotion.title}
      </h3>

      {/* Value */}
      {promotion.value && (
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 bg-glamlink-teal text-white text-lg font-semibold rounded-lg">
            {promotion.value}
          </span>
        </div>
      )}

      {/* Promo Code */}
      {promotion.promoCode && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Code:</span>
            <button
              onClick={copyPromoCode}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition-colors group"
              title="Click to copy"
            >
              <span className="font-mono text-sm font-semibold text-gray-900 group-hover:text-glamlink-teal">
                {promotion.promoCode}
              </span>
              <Copy className="w-4 h-4 text-gray-400 group-hover:text-glamlink-teal" />
            </button>
          </div>
        </div>
      )}

      {/* Date Range */}
      {(promotion.startDate || promotion.endDate) && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Calendar className="w-4 h-4" />
          <span>
            {promotion.startDate && formatDate(promotion.startDate)}
            {promotion.startDate && promotion.endDate && ' - '}
            {promotion.endDate && formatDate(promotion.endDate)}
          </span>
        </div>
      )}

      {/* Additional Info */}
      {promotion.isFeatured && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
            ⭐ Featured Promotion
          </span>
        </div>
      )}
    </div>
  );
}