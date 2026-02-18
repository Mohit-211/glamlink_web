/**
 * PaymentMethodIcon Component
 *
 * Displays an icon or badge for payment methods
 */

import type { PaymentMethod } from '../types';

interface PaymentMethodIconProps {
  method: PaymentMethod;
  last4?: string;
}

export default function PaymentMethodIcon({ method, last4 }: PaymentMethodIconProps) {
  const getBadgeStyle = () => {
    switch (method) {
      case 'visa':
        return 'bg-blue-600 text-white';
      case 'mastercard':
        return 'bg-red-600 text-white';
      case 'amex':
        return 'bg-blue-700 text-white';
      case 'discover':
        return 'bg-orange-600 text-white';
      case 'shop_pay':
        return 'bg-purple-600 text-white';
      case 'cash':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getLabel = () => {
    switch (method) {
      case 'visa':
        return 'VISA';
      case 'mastercard':
        return 'MC';
      case 'amex':
        return 'AMEX';
      case 'discover':
        return 'DISC';
      case 'shop_pay':
        return 'Shop';
      case 'cash':
        return 'Cash';
      default:
        return 'Other';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${getBadgeStyle()}`}
      >
        {getLabel()}
      </span>
      {last4 && (
        <span className="text-xs text-gray-500">
          ••••{last4}
        </span>
      )}
    </div>
  );
}
