'use client';

/**
 * TreatmentFAQs - FAQ accordion section for treatment pages
 *
 * Displays frequently asked questions about the treatment.
 */

import React, { useState } from 'react';
import type { FAQ } from '../types';

// =============================================================================
// TYPES
// =============================================================================

export interface TreatmentFAQsProps {
  faqs: FAQ[];
  treatmentName: string;
}

// =============================================================================
// FAQ ITEM
// =============================================================================

interface FAQItemProps {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left hover:text-glamlink-teal transition-colors"
      >
        <span className="text-base font-medium text-gray-900 pr-4">{faq.question}</span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function TreatmentFAQs({ faqs, treatmentName }: TreatmentFAQsProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Everything you need to know about {treatmentName.toLowerCase()}
          </p>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>

        {/* Additional question CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Have more questions? Reach out to a professional directly through their profile.
          </p>
        </div>
      </div>
    </section>
  );
}

export default TreatmentFAQs;
