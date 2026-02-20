import { useRef, useEffect, useCallback } from "react";

interface PerformanceMetrics {
  validationCalls: number;
  cacheHits: number;
  averageValidationTime: number;
  totalValidationTime: number;
  maxValidationTime: number;
  lastValidationError: string | null;
}

export const usePerformanceMonitor = (hookName: string = "Validation") => {
  const metrics = useRef<PerformanceMetrics>({
    validationCalls: 0,
    cacheHits: 0,
    averageValidationTime: 0,
    totalValidationTime: 0,
    maxValidationTime: 0,
    lastValidationError: null
  });

  const startTimer = useRef<number>(0);

  const startValidation = useCallback(() => {
    startTimer.current = performance.now();
    metrics.current.validationCalls++;
  }, []);

  const endValidation = useCallback((error: string | null = null) => {
    const endTime = performance.now();
    const duration = endTime - startTimer.current;

    metrics.current.totalValidationTime += duration;
    metrics.current.maxValidationTime = Math.max(metrics.current.maxValidationTime, duration);
    metrics.current.averageValidationTime = metrics.current.totalValidationTime / metrics.current.validationCalls;
    metrics.current.lastValidationError = error;

    // Log performance warnings (disabled for production)
    // if (duration > 16) { // More than one frame at 60fps
    //   console.warn(`[Performance] ${hookName} took ${duration.toFixed(2)}ms - slow validation detected`);
    // }

    return duration;
  }, [hookName]);

  const recordCacheHit = useCallback(() => {
    metrics.current.cacheHits++;
  }, []);

  const getMetrics = useCallback(() => {
    return {
      ...metrics.current,
      cacheHitRate: metrics.current.cacheHits / Math.max(metrics.current.validationCalls, 1),
      performanceScore: (metrics.current.averageValidationTime < 5 ? 'excellent' :
                        metrics.current.averageValidationTime < 10 ? 'good' :
                        metrics.current.averageValidationTime < 16 ? 'acceptable' : 'poor') as 'excellent' | 'good' | 'acceptable' | 'poor'
    };
  }, []);

  const logMetrics = useCallback(() => {
    // Disabled for production
    return;
    // const currentMetrics = getMetrics();
    // console.log(`[Performance] ${hookName} Metrics:`, {
    //   totalCalls: currentMetrics.validationCalls,
    //   cacheHitRate: `${(currentMetrics.cacheHitRate * 100).toFixed(1)}%`,
    //   averageTime: `${currentMetrics.averageValidationTime.toFixed(2)}ms`,
    //   maxTime: `${currentMetrics.maxValidationTime.toFixed(2)}ms`,
    //   performanceScore: currentMetrics.performanceScore,
    //   lastError: currentMetrics.lastValidationError
    // });
  }, [hookName, getMetrics]);

  // Log metrics periodically (disabled for production)
  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development') {
  //     const interval = setInterval(() => {
  //       if (metrics.current.validationCalls > 0) {
  //         logMetrics();
  //       }
  //     }, 10000); // Log every 10 seconds

  //     return () => clearInterval(interval);
  //   }
  // }, [logMetrics]);

  return {
    startValidation,
    endValidation,
    recordCacheHit,
    getMetrics,
    logMetrics
  };
};