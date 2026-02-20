# Finance Management Feature Plan

## Overview

Implement comprehensive finance management for beauty professionals to track payouts, transactions, fees, and tax information. Based on Shopify's Finance section with adaptations for the Glamlink marketplace.

---

## Directory Structure

```
lib/features/finance/
├── types.ts
├── config.ts
├── components/
│   ├── FinanceOverview.tsx           # Main finance dashboard
│   ├── PayoutsPage.tsx               # Payouts list and summary
│   ├── PayoutDetail.tsx              # Individual payout breakdown
│   ├── TransactionsPage.tsx          # Order transactions list
│   ├── TaxFilingPage.tsx             # Tax filing information
│   ├── PayoutStatusBadge.tsx         # Status indicator component
│   ├── PaymentMethodIcon.tsx         # Credit card/payment icons
│   └── FinanceExport.tsx             # Export functionality
├── hooks/
│   ├── usePayouts.ts                 # Fetch/manage payouts
│   ├── useTransactions.ts            # Fetch/manage transactions
│   └── useFinanceExport.ts           # Export data
└── index.ts

app/profile/finance/
├── page.tsx                          # Finance overview
├── payouts/
│   ├── page.tsx                      # Payouts list
│   └── [payoutId]/
│       └── page.tsx                  # Payout detail
├── transactions/
│   └── page.tsx                      # All transactions
└── tax/
    └── page.tsx                      # Tax filing info
```

---

## Types

```typescript
// types.ts

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
```

---

## Configuration

```typescript
// config.ts

export const PAYOUT_STATUSES: {
  value: PayoutStatus;
  label: string;
  color: string;
  icon: string;
}[] = [
  { value: 'pending', label: 'Pending', color: 'yellow', icon: 'Clock' },
  { value: 'in_transit', label: 'In Transit', color: 'blue', icon: 'TrendingUp' },
  { value: 'deposited', label: 'Deposited', color: 'green', icon: 'CheckCircle' },
  { value: 'failed', label: 'Failed', color: 'red', icon: 'XCircle' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'gray', icon: 'ArrowDownCircle' },
];

export const TRANSACTION_TYPES: {
  value: TransactionType;
  label: string;
  description: string;
}[] = [
  { value: 'charge', label: 'Charge', description: 'Customer payment' },
  { value: 'refund', label: 'Refund', description: 'Order refund' },
  { value: 'chargeback', label: 'Chargeback', description: 'Disputed charge' },
  { value: 'sales_tax', label: 'Sales Tax', description: 'Marketplace sales tax' },
  { value: 'fee', label: 'Fee', description: 'Platform or processing fee' },
  { value: 'adjustment', label: 'Adjustment', description: 'Manual adjustment' },
];

export const PAYMENT_METHODS: {
  value: PaymentMethod;
  label: string;
  icon: string;
}[] = [
  { value: 'visa', label: 'Visa', icon: 'CreditCard' },
  { value: 'mastercard', label: 'Mastercard', icon: 'CreditCard' },
  { value: 'amex', label: 'American Express', icon: 'CreditCard' },
  { value: 'discover', label: 'Discover', icon: 'CreditCard' },
  { value: 'shop_pay', label: 'Shop Pay', icon: 'Wallet' },
  { value: 'cash', label: 'Cash', icon: 'DollarSign' },
  { value: 'other', label: 'Other', icon: 'HelpCircle' },
];

export const FINANCE_DATE_RANGES = [
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'this_week' },
  { label: 'This month', value: 'this_month' },
  { label: 'Last month', value: 'last_month' },
  { label: 'This quarter', value: 'this_quarter' },
  { label: 'This year', value: 'this_year' },
  { label: 'Custom', value: 'custom' },
];

// Platform fee configuration
export const PLATFORM_FEE_PERCENTAGE = 0.10; // 10% platform fee
export const PROCESSING_FEE_PERCENTAGE = 0.029; // 2.9% + $0.30 per transaction
export const PROCESSING_FEE_FIXED = 0.30;

// Payout schedule
export const PAYOUT_SCHEDULE = {
  frequency: 'weekly', // 'daily' | 'weekly' | 'monthly'
  dayOfWeek: 1, // Monday = 1
  minimumAmount: 25.00, // Minimum payout amount
  holdPeriod: 7, // Days to hold funds
};
```

---

## Components

### FinanceOverview.tsx

Main finance dashboard with summary cards:

```
┌─────────────────────────────────────────────────────────────┐
│ Finance Overview                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│ │ To Be Paid   │ │ This Month   │ │ Last Payout  │        │
│ │              │ │              │ │              │        │
│ │  $1,234.56   │ │  $5,678.90   │ │  $2,345.67   │        │
│ │ Available    │ │ Gross sales  │ │ Jan 6, 2026  │        │
│ └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Recent Payouts                      [View All Payouts]│  │
│ ├───────────────────────────────────────────────────────┤  │
│ │ Jan 6, 2026    Deposited                   $112.52    │  │
│ │ Dec 31, 2025   Deposited                    $96.80    │  │
│ │ Sep 9, 2025    Deposited                    $48.25    │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Quick Actions                                         │  │
│ ├───────────────────────────────────────────────────────┤  │
│ │ [View Transactions] [Export Reports] [Tax Documents]  │  │
│ └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### PayoutsPage.tsx

List of all payouts with filtering:

```
┌─────────────────────────────────────────────────────────────┐
│ Payouts                    [Export] [Documents] [View Order │
│                                                 Transactions]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ To be paid                                                  │
│ $1,234.56                                                   │
│                                                             │
│ Payout transactions                                         │
│ [All] [Today] [This week] [This month] [+]     [🔍] [≡]   │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Payout date  Transaction dates  Status        Amount  │  │
│ ├───────────────────────────────────────────────────────┤  │
│ │ Jan 6, 2026  Jan 3, 2026        ● Deposited  $112.52 │  │
│ │ Dec 31, 2025 Dec 29, 2025       ● Deposited   $96.80 │  │
│ │ Sep 9, 2025  Sep 6, 2025        ● Deposited   $48.25 │  │
│ │ May 1, 2025  Apr 28, 2025       ● Deposited   $20.29 │  │
│ │ Apr 30, 2025 Apr 28, 2025       ○ Withdrawn   -$1.20 │  │
│ │ Apr 29, 2025 Apr 27, 2025       ● Deposited   $19.09 │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                             │
│ [< Previous] [1] [2] [3] [Next >]                          │
└─────────────────────────────────────────────────────────────┘
```

### TransactionsPage.tsx

Detailed transaction breakdown:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Order transactions                                              [Export]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ [All] [This Month] [Last Month] [+]                            [🔍] [≡]    │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐│
│ │Date       Payout    Status     Order  Type          Payment  Amount   Fee││
│ ├─────────────────────────────────────────────────────────────────────────┤│
│ │Jan 3,2026 Jan 6    Deposited   #1061  Sales tax     [VISA]  -$1.65  $0││
│ │Jan 3,2026 Jan 6    Deposited   #1061  Charge        [Shop]  $121.65 -$7││
│ │Dec 29,'25 Dec 31   Deposited   #1060  Charge        [VISA]  $100.00 -$3││
│ │Sep 6,2025 Sep 9    Deposited   #1059  Charge        [VISA]  $50.00  -$1││
│ │Apr 28,'25 Apr 30   Withdrawn   #1058  Sales tax              -$1.20  $0││
│ │Apr 28,'25 May 1    Deposited   #1058  Charge        [Disc]   $21.20 -$0││
│ │Apr 27,'25 Apr 29   Deposited   #1057  Sales tax              -$1.20  $0││
│ │Apr 27,'25 Apr 29   Deposited   #1057  Charge        [VISA]   $21.20 -$0││
│ │Apr 22,'25 Apr 24   Withdrawn   #1055  Chargeback    [VISA] -$170.00-$15││
│ └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│ [< Previous] [1] [2] [3] [Next >]                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### TaxFilingPage.tsx

Tax information and automation options:

```
┌─────────────────────────────────────────────────────────────┐
│ Automated filing                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Put your sales tax returns on autopilot      [🗂️ Icon] │ │
│ │                                                         │ │
│ │ Automated filing prepares, files and remits your taxes │ │
│ │ for you.                                                │ │
│ │                                                         │ │
│ │                                      [Get started]      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│ │ ✅ Streamlined│ │ 🔗 Seamless  │ │ 🎛️ Flexible  │        │
│ │ filing       │ │ integration  │ │ controls     │        │
│ │              │ │              │ │              │        │
│ │ Automate tax │ │ Reduce errors│ │ Choose what  │        │
│ │ returns in a │ │ with data    │ │ to file and  │        │
│ │ few easy     │ │ pulled from  │ │ how you want │        │
│ │ steps        │ │ your store   │ │ to review    │        │
│ └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
│ ┌──────────────┐                                           │
│ │ 💰 No hidden │                                           │
│ │ costs        │                                           │
│ │              │                                           │
│ │ Pay a flat   │                                           │
│ │ fee of $75   │                                           │
│ │ per return   │                                           │
│ └──────────────┘                                           │
│                                                             │
│ Frequently asked questions                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ How does automated filing work?                    [+] │ │
│ │ What types of returns are supported?               [+] │ │
│ │ Can I qualify for filing discounts?                [+] │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Hooks

### usePayouts.ts

```typescript
export function usePayouts(): UsePayoutsReturn {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    status: 'all' as PayoutStatus | 'all',
  });

  useEffect(() => {
    fetchPayouts();
    fetchSummary();
  }, [user?.brandId, filters]);

  const fetchPayouts = async () => {
    // GET /api/finance/payouts?dateRange=...&status=...
  };

  const fetchSummary = async () => {
    // GET /api/finance/summary
  };

  const filterByDateRange = (start: string, end: string) => {
    setFilters(prev => ({ ...prev, dateRange: `${start}:${end}` }));
  };

  const filterByStatus = (status: PayoutStatus | 'all') => {
    setFilters(prev => ({ ...prev, status }));
  };

  const refreshPayouts = async () => {
    await fetchPayouts();
    await fetchSummary();
  };

  const getPayoutById = async (id: string): Promise<Payout | null> => {
    // GET /api/finance/payouts/{id}
  };

  return {
    payouts,
    summary,
    isLoading,
    error,
    filterByDateRange,
    filterByStatus,
    refreshPayouts,
    getPayoutById,
  };
}
```

### useTransactions.ts

```typescript
export function useTransactions(): UseTransactionsReturn {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    type: 'all' as TransactionType | 'all',
    payoutStatus: 'all' as PayoutStatus | 'all',
    orderId: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, [user?.brandId, filters]);

  const fetchTransactions = async () => {
    // GET /api/finance/transactions?...filters
  };

  const filterByDateRange = (start: string, end: string) => {
    setFilters(prev => ({ ...prev, dateRange: `${start}:${end}` }));
  };

  const filterByType = (type: TransactionType | 'all') => {
    setFilters(prev => ({ ...prev, type }));
  };

  const filterByPayoutStatus = (payoutStatus: PayoutStatus | 'all') => {
    setFilters(prev => ({ ...prev, payoutStatus }));
  };

  const filterByOrder = (orderId: string) => {
    setFilters(prev => ({ ...prev, orderId }));
  };

  const refreshTransactions = async () => {
    await fetchTransactions();
  };

  const getTransactionsByPayout = async (payoutId: string): Promise<Transaction[]> => {
    // GET /api/finance/transactions?payoutId={payoutId}
  };

  return {
    transactions,
    isLoading,
    error,
    filterByDateRange,
    filterByType,
    filterByPayoutStatus,
    filterByOrder,
    refreshTransactions,
    getTransactionsByPayout,
  };
}
```

---

## API Endpoints

### GET /api/finance/summary
- Returns financial summary for current brand
- Response: `FinanceSummary`

### GET /api/finance/payouts
- List all payouts with optional filters
- Query params: `dateRange`, `status`, `page`, `limit`
- Response: `{ payouts: Payout[], total: number, page: number }`

### GET /api/finance/payouts/{id}
- Get specific payout details
- Response: `Payout`

### GET /api/finance/transactions
- List all transactions with optional filters
- Query params: `dateRange`, `type`, `payoutStatus`, `orderId`, `page`, `limit`
- Response: `{ transactions: Transaction[], total: number, page: number }`

### GET /api/finance/transactions/payout/{payoutId}
- Get all transactions for a specific payout
- Response: `Transaction[]`

### POST /api/finance/export
- Export financial data
- Body: `{ type: 'payouts' | 'transactions', format: 'csv' | 'pdf', filters: {...} }`
- Response: File download

### GET /api/finance/tax/documents
- List tax documents
- Query params: `year`, `quarter`
- Response: `TaxDocument[]`

### POST /api/finance/payout/manual
- Trigger manual payout (admin only)
- Body: `{ brandId: string, amount: number, reason: string }`
- Response: `Payout`

---

## Database Schema

### Firestore Structure

```typescript
// Payouts collection
payouts/{payoutId}
{
  id: 'payout_xxx',
  brandId: 'brand_xxx',
  payoutDate: '2026-01-06',
  transactionStartDate: '2026-01-03',
  transactionEndDate: '2026-01-03',
  status: 'deposited',

  grossAmount: 121.65,
  fees: 7.48,
  refunds: 0,
  chargebacks: 0,
  adjustments: 0,
  netAmount: 114.17,

  transactionCount: 2,
  orderCount: 1,
  currency: 'USD',

  bankAccount: {
    last4: '1234',
    bankName: 'Chase Bank',
  },

  createdAt: Timestamp,
  updatedAt: Timestamp,
}

// Transactions collection
transactions/{transactionId}
{
  id: 'txn_xxx',
  brandId: 'brand_xxx',
  payoutId: 'payout_xxx',
  orderId: 'order_xxx',

  date: '2026-01-03',
  type: 'charge',
  description: 'Order #1061 - Hair styling service',

  amount: 121.65,
  fee: 7.48,
  netAmount: 114.17,
  currency: 'USD',

  paymentMethod: 'shop_pay',
  last4: null,

  payoutStatus: 'deposited',
  payoutDate: '2026-01-06',

  createdAt: Timestamp,
}

// Tax documents collection
taxDocuments/{docId}
{
  id: 'tax_xxx',
  brandId: 'brand_xxx',
  year: 2025,
  quarter: null, // or 1-4
  documentType: '1099-K',
  fileUrl: 'https://storage.../tax-docs/...',
  generatedAt: Timestamp,
}

// Financial summary (embedded in brand document)
brands/{brandId}
{
  // ... existing fields
  financialSummary: {
    toBePaid: 1234.56,
    pendingPayouts: 2,
    thisMonth: {
      grossSales: 5678.90,
      fees: 340.73,
      netSales: 5338.17,
      transactionCount: 45,
    },
    lastPayout: {
      date: '2026-01-06',
      amount: 112.52,
      status: 'deposited',
    },
    nextPayout: {
      estimatedDate: '2026-01-13',
      estimatedAmount: 1234.56,
    },
    updatedAt: Timestamp,
  }
}
```

### Indexes Required

```
payouts:
- brandId + payoutDate (desc)
- brandId + status + payoutDate (desc)

transactions:
- brandId + date (desc)
- brandId + payoutId + date (desc)
- brandId + orderId
- brandId + type + date (desc)
```

---

## Implementation Notes

### 1. Payout Calculation Logic

When an order is completed:
```typescript
// Calculate fees
const processingFee = (orderTotal * PROCESSING_FEE_PERCENTAGE) + PROCESSING_FEE_FIXED;
const platformFee = orderTotal * PLATFORM_FEE_PERCENTAGE;
const totalFees = processingFee + platformFee;
const netAmount = orderTotal - totalFees;

// Create transaction records
await createTransaction({
  type: 'charge',
  amount: orderTotal,
  fee: totalFees,
  netAmount: netAmount,
  orderId: order.id,
  paymentMethod: order.paymentMethod,
});

// Update financial summary
await updateFinancialSummary(brandId, {
  toBePaid: increment(netAmount),
  thisMonth.grossSales: increment(orderTotal),
  thisMonth.fees: increment(totalFees),
  thisMonth.transactionCount: increment(1),
});
```

### 2. Payout Schedule (Automated)

Cloud Function runs daily to process payouts:
```typescript
// Every day at 2 AM
exports.processPayouts = functions.pubsub.schedule('0 2 * * *').onRun(async () => {
  const brands = await getBrandsEligibleForPayout();

  for (const brand of brands) {
    const unpaidTransactions = await getUnpaidTransactions(brand.id);
    const totalAmount = calculateTotalNet(unpaidTransactions);

    // Check minimum payout amount
    if (totalAmount < PAYOUT_SCHEDULE.minimumAmount) {
      continue;
    }

    // Create payout
    const payout = await createPayout({
      brandId: brand.id,
      transactions: unpaidTransactions,
      amount: totalAmount,
      status: 'pending',
    });

    // Initiate bank transfer (Stripe, PayPal, etc.)
    await initiateBankTransfer(payout);
  }
});
```

### 3. Refund Handling

When a refund is issued:
```typescript
// Create refund transaction
await createTransaction({
  type: 'refund',
  amount: -refundAmount, // Negative amount
  fee: -refundFees,
  netAmount: -(refundAmount - refundFees),
  orderId: order.id,
  payoutStatus: 'pending',
});

// Update summary
await updateFinancialSummary(brandId, {
  toBePaid: increment(-refundAmount + refundFees),
  thisMonth.grossSales: increment(-refundAmount),
});
```

### 4. Tax Document Generation

Annually generate 1099-K forms:
```typescript
// Cloud Function on January 15th
exports.generate1099K = functions.pubsub.schedule('0 0 15 1 *').onRun(async () => {
  const brands = await getBrandsEligibleFor1099K(); // $600+ in sales

  for (const brand of brands) {
    const yearTransactions = await getTransactionsByYear(brand.id, previousYear);
    const pdf = await generate1099KPDF(brand, yearTransactions);

    await saveTaxDocument({
      brandId: brand.id,
      year: previousYear,
      documentType: '1099-K',
      fileUrl: pdf.url,
    });

    // Send email notification
    await sendTaxDocumentEmail(brand.email, pdf.url);
  }
});
```

### 5. Export Functionality

```typescript
// CSV Export
const exportToCSV = (transactions: Transaction[]) => {
  const headers = ['Date', 'Order', 'Type', 'Amount', 'Fee', 'Net', 'Status'];
  const rows = transactions.map(t => [
    t.date,
    t.orderId || '',
    t.type,
    t.amount,
    t.fee,
    t.netAmount,
    t.payoutStatus,
  ]);

  return generateCSV([headers, ...rows]);
};

// PDF Export
const exportToPDF = (transactions: Transaction[]) => {
  const doc = new jsPDF();
  doc.text('Transaction Report', 10, 10);
  doc.autoTable({
    head: [['Date', 'Order', 'Type', 'Amount', 'Fee', 'Net', 'Status']],
    body: transactions.map(t => [
      formatDate(t.date),
      t.orderId || '-',
      formatTransactionType(t.type),
      formatCurrency(t.amount),
      formatCurrency(t.fee),
      formatCurrency(t.netAmount),
      formatStatus(t.payoutStatus),
    ]),
  });
  return doc.output('blob');
};
```

---

## UI Integration

### Navigation Update

Add Finance to profile sidebar:

```typescript
// app/profile/layout.tsx
const FinanceIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Add to navigation array
{
  name: "Finance",
  href: "/profile/finance",
  icon: FinanceIcon,
  current: pathname.startsWith("/profile/finance"),
}
```

### Finance Sub-navigation

```typescript
const financeSections = [
  { id: 'overview', title: 'Overview', href: '/profile/finance', icon: DashboardIcon },
  { id: 'payouts', title: 'Payouts', href: '/profile/finance/payouts', icon: CreditCardIcon },
  { id: 'transactions', title: 'Transactions', href: '/profile/finance/transactions', icon: ListIcon },
  { id: 'tax', title: 'Tax Filing', href: '/profile/finance/tax', icon: FileTextIcon },
];
```

---

## Testing Checklist

- [ ] Create test transactions from orders
- [ ] Verify payout calculations are accurate
- [ ] Test fee calculations (platform + processing)
- [ ] Filter payouts by date range and status
- [ ] Filter transactions by type and order
- [ ] Export payouts to CSV and PDF
- [ ] Export transactions to CSV and PDF
- [ ] View payout detail with transaction breakdown
- [ ] Handle refunds correctly (negative amounts)
- [ ] Handle chargebacks correctly
- [ ] Verify "To be paid" amount is accurate
- [ ] Test payout status badges display correctly
- [ ] Test payment method icons display correctly
- [ ] Verify pagination works for large datasets
- [ ] Test mobile responsiveness
- [ ] Verify tax document access (when available)

---

## Dependencies

- jsPDF - PDF generation for exports
- papaparse - CSV generation
- date-fns - Date manipulation for filters
- Lucide icons - UI icons
- Stripe/PayPal SDK - Payment processing (optional)

---

## Security Considerations

1. **Data Access**: Users can only see their own brand's financial data
2. **Bank Account Masking**: Only show last 4 digits of account numbers
3. **PCI Compliance**: Never store full card numbers, only last 4 digits
4. **Tax Documents**: Secure file storage with authenticated access only
5. **Payout Verification**: Require admin approval for manual payouts
6. **Rate Limiting**: Limit export requests to prevent abuse

---

## Future Enhancements

1. **Recurring Billing**: Support for subscription-based services
2. **Multi-Currency**: Support for international payments
3. **Disputes**: Interface for handling chargebacks and disputes
4. **Analytics**: Revenue charts and financial forecasting
5. **Invoicing**: Generate invoices for B2B services
6. **Tax Automation**: Integrate with tax filing services
7. **Payment Plans**: Allow customers to pay in installments
8. **Tip Distribution**: Split tips among service providers

---

## Priority

**High** - Essential for marketplace operations and brand owner trust
