import { useState, useCallback, useRef, useEffect } from "react";

interface DebouncedProgressOptions {
  delay?: number; // Debounce delay in ms (default: 200ms)
  minProgressChange?: number; // Minimum percentage change to trigger update (default: 1%)
}

interface ProgressInfo {
  totalFields: number;
  completedFields: number;
  missingFields: number;
  progressPercentage: number;
  isComplete: boolean;
}

export const useDebouncedProgress = (
  calculateProgress: () => ProgressInfo,
  options: DebouncedProgressOptions = {}
) => {
  const { delay = 200, minProgressChange = 1 } = options;

  const [debouncedProgress, setDebouncedProgress] = useState<ProgressInfo>({
    totalFields: 0,
    completedFields: 0,
    missingFields: 0,
    progressPercentage: 0,
    isComplete: false
  });
  const [isCalculating, setIsCalculating] = useState(false);

  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastProgressRef = useRef<ProgressInfo>(debouncedProgress);
  const pendingProgressRef = useRef<ProgressInfo | null>(null);

  // Clear any existing timer
  const clearTimer = useCallback(() => {
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
      progressTimerRef.current = undefined;
    }
  }, []);

  // Function to check if progress change is significant enough to update
  const isSignificantChange = useCallback((old: ProgressInfo, New: ProgressInfo): boolean => {
    return Math.abs(New.progressPercentage - old.progressPercentage) >= minProgressChange ||
           New.isComplete !== old.isComplete ||
           New.missingFields !== old.missingFields;
  }, [minProgressChange]);

  // Trigger progress calculation
  const triggerProgressCalculation = useCallback(() => {
    // If already calculating, don't trigger again
    if (isCalculating) return;

    clearTimer();

    progressTimerRef.current = setTimeout(() => {
      setIsCalculating(true);

      try {
        const newProgress = calculateProgress();

        // Check if the change is significant
        if (isSignificantChange(lastProgressRef.current, newProgress)) {
          setDebouncedProgress(newProgress);
          lastProgressRef.current = newProgress;
        }

        pendingProgressRef.current = newProgress;
      } catch (error) {
        console.error('Progress calculation error:', error);
      } finally {
        setIsCalculating(false);
      }
    }, delay);
  }, [calculateProgress, delay, isCalculating, isSignificantChange, clearTimer]);

  // Force immediate progress update (for critical moments like form submission)
  const forceProgressUpdate = useCallback(() => {
    clearTimer();
    setIsCalculating(true);

    try {
      const newProgress = calculateProgress();
      setDebouncedProgress(newProgress);
      lastProgressRef.current = newProgress;
      pendingProgressRef.current = newProgress;
    } catch (error) {
      console.error('Forced progress calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [calculateProgress, clearTimer]);

  // Get the latest progress (returns pending if available, otherwise debounced)
  const getLatestProgress = useCallback((): ProgressInfo => {
    return pendingProgressRef.current || debouncedProgress;
  }, [debouncedProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  // Trigger progress calculation when form data changes
  useEffect(() => {
    triggerProgressCalculation();
  }, [triggerProgressCalculation]);

  return {
    debouncedProgress,
    isCalculating,
    triggerProgressCalculation,
    forceProgressUpdate,
    getLatestProgress
  };
};