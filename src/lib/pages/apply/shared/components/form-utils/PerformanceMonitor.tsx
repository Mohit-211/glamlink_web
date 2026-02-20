"use client";

interface PerformanceMetrics {
  validationCalls: number;
  cacheHits: number;
  averageValidationTime: number;
  totalValidationTime: number;
  maxValidationTime: number;
  lastValidationError: string | null;
  cacheHitRate: number;
  performanceScore: 'excellent' | 'good' | 'acceptable' | 'poor';
}

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics | null;
  onLogMetrics?: () => void;
}

export default function PerformanceMonitor({ metrics, onLogMetrics }: PerformanceMonitorProps) {
  // Completely disable performance monitoring for production
  return null;
}