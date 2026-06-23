import type { Order } from './types';

const STATUS = {
  completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  pending:   { label: 'Pending',   color: 'bg-amber-50  text-amber-700  border-amber-200',     dot: 'bg-amber-500'  },
  cancelled: { label: 'Cancelled', color: 'bg-red-50    text-red-700    border-red-200',        dot: 'bg-red-500'    },
};

export function StatusPill({ status }: { status: Order['status'] }) {
  const s = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${s.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
