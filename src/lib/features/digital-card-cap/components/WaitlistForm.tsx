'use client';

import { useState } from 'react';
import { MESSAGES } from '../config';

interface WaitlistFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function WaitlistForm({ onSuccess, className = '' }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'already'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/apply/digital-card/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.alreadyOnWaitlist) {
          setStatus('already');
          setMessage(MESSAGES.waitlist.alreadyOnList);
        } else {
          setStatus('success');
          setMessage(MESSAGES.waitlist.success);
          setEmail('');
          onSuccess?.();
        }
      } else {
        setStatus('error');
        setMessage(data.error || MESSAGES.waitlist.error);
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      setStatus('error');
      setMessage(MESSAGES.waitlist.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full max-w-md ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="waitlist-email" className="sr-only">
            Email address
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="waitlist-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isSubmitting || status === 'success'}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-glamlink-purple focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={isSubmitting || !email.trim() || status === 'success'}
              className="px-6 py-3 bg-glamlink-purple text-white font-medium rounded-lg hover:bg-glamlink-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Joining...
                </span>
              ) : status === 'success' ? (
                'Joined!'
              ) : (
                'Join Waitlist'
              )}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {status !== 'idle' && (
          <div
            className={`p-3 rounded-lg text-sm ${
              status === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : status === 'already'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message}
          </div>
        )}
      </form>

      <p className="mt-3 text-xs text-gray-500 text-center">
        We&apos;ll only email you when spots become available. No spam, ever.
      </p>
    </div>
  );
}
