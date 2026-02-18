'use client';

import { useState, useEffect } from 'react';
import type { FAQ } from '../types';

interface FAQQuickActionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function FAQQuickActions({ onSelect, disabled = false }: FAQQuickActionsProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch('/api/support/faqs', {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success && data.faqs) {
          setFaqs(data.faqs.slice(0, 5)); // Show max 5 FAQs
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-8 w-32 bg-gray-100 rounded-full animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 font-medium">Quick Questions:</p>
      <div className="flex flex-wrap gap-2">
        {faqs.map((faq) => (
          <button
            key={faq.id}
            onClick={() => onSelect(faq.question)}
            disabled={disabled}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {truncateQuestion(faq.question)}
          </button>
        ))}
      </div>
    </div>
  );
}

function truncateQuestion(question: string): string {
  // Remove question mark and truncate
  const cleaned = question.replace(/\?$/, '');
  if (cleaned.length <= 40) return cleaned;
  return cleaned.substring(0, 37) + '...';
}
