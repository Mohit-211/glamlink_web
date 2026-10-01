'use client';

import React, { useState } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { subDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { DateRangeValue } from './types';
import { formatRangeLabel, parseApiDate, toApiDate } from './analyticsHelpers';

export const PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
] as const;

export const presetRange = (days: number): DateRangeValue => {
  const today = new Date();
  return { from: toApiDate(subDays(today, days - 1)), to: toApiDate(today) };
};

const sameRange = (a: DateRangeValue, b: DateRangeValue) => a.from === b.from && a.to === b.to;

export default function AnalyticsDateFilter({
  value,
  onChange,
  disabled,
}: {
  value: DateRangeValue;
  onChange: (range: DateRangeValue) => void;
  disabled?: boolean;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>();

  const activePreset = PRESETS.find((p) => sameRange(presetRange(p.days), value));
  const buttonLabel = activePreset?.label ?? formatRangeLabel(value.from, value.to);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraft({
        from: parseApiDate(value.from) ?? undefined,
        to: parseApiDate(value.to) ?? undefined,
      });
    }
    setOpen(next);
  };

  const apply = (range: DateRangeValue) => {
    onChange(range);
    setOpen(false);
  };

  const canApply = !!draft?.from;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="inline-flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50 sm:w-auto"
        >
          <span className="flex min-w-0 items-center gap-2">
            <CalendarDays className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="truncate">{buttonLabel}</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto max-w-[calc(100vw-2rem)] p-0">
        <div className="flex flex-wrap gap-1.5 border-b border-border p-3">
          {PRESETS.map((p) => (
            <button
              key={p.days}
              type="button"
              onClick={() => apply(presetRange(p.days))}
              className={cn(
                'rounded-full border px-3 py-1 text-[11px] font-medium transition-colors',
                activePreset?.days === p.days
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:border-primary/50 hover:bg-primary/5'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <Calendar
          mode="range"
          selected={draft}
          onSelect={setDraft}
          numberOfMonths={isMobile ? 1 : 2}
          defaultMonth={draft?.from}
          disabled={{ after: new Date() }}
          className="bg-transparent"
        />
        <div className="flex items-center justify-between gap-3 border-t border-border p-3">
          <span className="truncate text-xs text-muted-foreground">
            {draft?.from
              ? formatRangeLabel(toApiDate(draft.from), toApiDate(draft.to ?? draft.from))
              : 'Select a start date'}
          </span>
          <button
            type="button"
            disabled={!canApply}
            onClick={() =>
              draft?.from &&
              apply({ from: toApiDate(draft.from), to: toApiDate(draft.to ?? draft.from) })
            }
            className="flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
