/**
 * Finance Feature Types
 *
 * Type definitions for financial management including payouts, transactions, and tax documents
 */

export type PayoutStatus = 'pending' | 'in_transit' | 'deposited' | 'failed' | 'withdrawn';
export type TransactionType = 'charge' | 'refund' | 'chargeback' | 'sales_tax' | 'fee' | 'adjustment';
export type PaymentMethod = 'visa' | 'mastercard' | 'amex' | 'discover' | 'shop_pay' | 'cash' | 'other';

export interface Payout {
  id: string;
  brandId: string;
  payoutDate: string;                 // YYYY-MM-DD
  transactionStartDate: string;       // YYYY-MM-DD
  transactionEndDate: string;         // YYYY-MM-DD
  status: PayoutStatus;

  // Financial breakdown
  grossAmount: number;                // Total sales
  fees: number;                       // Platform/processing fees
  refunds: number;                    // Total refunds
  chargebacks: number;                // Chargeback amounts
  adjustments: number;                // Manual adjustments
  netAmount: number;                  // Amount deposited

  // Metadata
  transactionCount: number;           // Number of transactions
  orderCount: number;                 // Number of orders
  currency: string;                   // 'USD'

  // Banking
  bankAccount?: {
    last4: string;
    bankName: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  brandId: string;
  payoutId?: string;                  // Associated payout (if paid out)
  orderId?: string;                   // Associated order

  // Transaction details
  date: string;                       // YYYY-MM-DD
  type: TransactionType;
  description: string;                // "Charge", "Refund for order #123"

  // Financial
  amount: number;                     // Transaction amount (can be negative)
  fee: number;                        // Processing fee
  netAmount: number;                  // Amount after fees
  currency: string;                   // 'USD'

  // Payment details
  paymentMethod?: PaymentMethod;
  last4?: string;                     // Last 4 of card

  // Status
  payoutStatus: PayoutStatus;
  payoutDate?: string;                // When it was/will be paid out

  createdAt: string;
}

export interface FinanceSummary {
  toBePaid: number;                   // Pending payout amount
  pendingPayouts: number;             // Count of pending payouts

  thisMonth: {
    grossSales: number;
    fees: number;
    netSales: number;
    transactionCount: number;
  };

  lastPayout?: {
    date: string;
    amount: number;
    status: PayoutStatus;
  };

  nextPayout?: {
    estimatedDate: string;
    estimatedAmount: number;
  };
}

export interface TaxDocument {
  id: string;
  brandId: string;
  year: number;
  quarter?: number;                   // 1-4 for quarterly
  documentType: '1099-K' | 'sales_tax' | 'other';
  fileUrl: string;
  generatedAt: string;
}

export interface UsePayoutsReturn {
  payouts: Payout[];
  summary: FinanceSummary | null;
  isLoading: boolean;
  error: string | null;

  // Filtering
  filterByDateRange: (start: string, end: string) => void;
  filterByStatus: (status: PayoutStatus | 'all') => void;

  // Actions
  refreshPayouts: () => Promise<void>;
  getPayoutById: (id: string) => Promise<Payout | null>;
}

export interface UseTransactionsReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  // Filtering
  filterByDateRange: (start: string, end: string) => void;
  filterByType: (type: TransactionType | 'all') => void;
  filterByPayoutStatus: (status: PayoutStatus | 'all') => void;
  filterByOrder: (orderId: string) => void;

  // Actions
  refreshTransactions: () => Promise<void>;
  getTransactionsByPayout: (payoutId: string) => Promise<Transaction[]>;
}

export interface UseFinanceExportReturn {
  isExporting: boolean;
  exportPayouts: (format: 'csv' | 'pdf', dateRange?: { start: string; end: string }) => Promise<void>;
  exportTransactions: (format: 'csv' | 'pdf', dateRange?: { start: string; end: string }) => Promise<void>;
}
