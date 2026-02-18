'use client';

import Link from 'next/link';

interface SupportLinkProps {
  className?: string;
}

export function SupportLink({ className = '' }: SupportLinkProps) {
  return (
    <Link
      href="/profile/support"
      className={`inline-flex items-center gap-2 text-glamlink-purple hover:text-glamlink-purple-dark transition-colors ${className}`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
      <span>Contact Support</span>
    </Link>
  );
}
