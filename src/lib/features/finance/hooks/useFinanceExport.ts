/**
 * useFinanceExport Hook
 *
 * Handles exporting financial data to CSV and PDF
 */

import { useState, useCallback } from 'react';
import type { UseFinanceExportReturn } from '../types';

export function useFinanceExport(): UseFinanceExportReturn {
  const [isExporting, setIsExporting] = useState(false);

  const exportPayouts = useCallback(async (
    format: 'csv' | 'pdf',
    dateRange?: { start: string; end: string }
  ) => {
    try {
      setIsExporting(true);

      const queryParams = new URLSearchParams({ format });
      if (dateRange) {
        queryParams.append('start', dateRange.start);
        queryParams.append('end', dateRange.end);
      }

      const response = await fetch(`/api/finance/export/payouts?${queryParams}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to export payouts');
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payouts-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting payouts:', err);
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const exportTransactions = useCallback(async (
    format: 'csv' | 'pdf',
    dateRange?: { start: string; end: string }
  ) => {
    try {
      setIsExporting(true);

      const queryParams = new URLSearchParams({ format });
      if (dateRange) {
        queryParams.append('start', dateRange.start);
        queryParams.append('end', dateRange.end);
      }

      const response = await fetch(`/api/finance/export/transactions?${queryParams}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to export transactions');
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting transactions:', err);
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    isExporting,
    exportPayouts,
    exportTransactions,
  };
}
