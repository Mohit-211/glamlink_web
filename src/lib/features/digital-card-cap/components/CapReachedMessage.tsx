'use client';

import { MESSAGES } from '../config';
import { WaitlistForm } from './WaitlistForm';

interface CapReachedMessageProps {
  className?: string;
  showWaitlistForm?: boolean;
}

export function CapReachedMessage({ className = '', showWaitlistForm = true }: CapReachedMessageProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      {/* Icon */}
      <div className="w-20 h-20 mb-6 rounded-full bg-glamlink-purple/10 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-glamlink-purple"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        {MESSAGES.capReached.title}
      </h2>

      {/* Subtitle */}
      <p className="text-lg text-gray-600 mb-2">
        {MESSAGES.capReached.subtitle}
      </p>

      {/* Description */}
      <p className="text-gray-500 max-w-lg mb-8">
        {MESSAGES.capReached.description}
      </p>

      {/* Waitlist Form */}
      {showWaitlistForm && (
        <div className="w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Join the Waitlist
          </h3>
          <WaitlistForm />
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-md">
        <h4 className="font-medium text-gray-800 mb-2">What happens next?</h4>
        <ul className="text-sm text-gray-600 space-y-2 text-left">
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-glamlink-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>We&apos;ll notify you as soon as a spot opens up</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-glamlink-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Priority access for waitlist members</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-glamlink-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Exclusive early-bird benefits when you join</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
