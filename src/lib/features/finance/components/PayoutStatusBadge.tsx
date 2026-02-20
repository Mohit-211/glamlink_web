/**
 * PayoutStatusBadge Component
 *
 * Displays a colored badge for payout status
 */

import { getPayoutStatusConfig } from '../config';
import type { PayoutStatus } from '../types';

interface PayoutStatusBadgeProps {
  status: PayoutStatus;
}

export default function PayoutStatusBadge({ status }: PayoutStatusBadgeProps) {
  const config = getPayoutStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      {config.label}
    </span>
  );
}
