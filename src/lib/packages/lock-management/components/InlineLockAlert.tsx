'use client';

/**
 * InlineLockAlert Component - User-friendly lock status messages
 * 
 * Displays inline alerts for lock-related events and errors
 */

import React, { useEffect, useState } from 'react';
import { AlertCircle, Info, AlertTriangle, X, Lock, Users } from 'lucide-react';

export interface InlineLockAlertProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  message?: string | null;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  autoDismissDelay?: number;
  className?: string;
}

export function InlineLockAlert({
  type = 'info',
  message,
  onDismiss,
  autoDismiss = false,
  autoDismissDelay = 5000,
  className = ''
}: InlineLockAlertProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      
      if (autoDismiss && autoDismissDelay > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => onDismiss?.(), 300); // Wait for fade out animation
        }, autoDismissDelay);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [message, autoDismiss, autoDismissDelay, onDismiss]);

  if (!message || !isVisible) return null;

  const styles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-500'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertTriangle,
      iconColor: 'text-yellow-500'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-500'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: Lock,
      iconColor: 'text-green-500'
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  // Parse special lock error messages
  const isMultiTabError = message.includes('another browser tab');
  const isLockedByOther = message.includes('locked by') && !isMultiTabError;

  return (
    <div
      className={`
        ${style.bg} ${style.border} ${style.text}
        border rounded-lg p-4 mb-4
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {isMultiTabError ? (
            <Users className={`h-5 w-5 ${style.iconColor}`} />
          ) : isLockedByOther ? (
            <Lock className={`h-5 w-5 ${style.iconColor}`} />
          ) : (
            <Icon className={`h-5 w-5 ${style.iconColor}`} />
          )}
        </div>
        
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">
            {isMultiTabError ? 'Multi-Tab Conflict' : 
             isLockedByOther ? 'Resource Locked' : 
             type === 'error' ? 'Lock Error' :
             type === 'warning' ? 'Warning' :
             type === 'success' ? 'Success' :
             'Information'}
          </p>
          <p className="mt-1 text-sm">{message}</p>
          
          {isMultiTabError && (
            <p className="mt-2 text-xs opacity-75">
              Close other tabs or use the "Take Control" option to transfer the lock to this tab.
            </p>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onDismiss(), 300);
            }}
            className={`ml-3 flex-shrink-0 ${style.text} hover:opacity-75 transition-opacity`}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Export convenience wrapper for lock-specific alerts
export function LockStatusAlert({ 
  lockError, 
  onDismiss,
  ...props 
}: { 
  lockError?: string | null;
  onDismiss?: () => void;
} & Omit<InlineLockAlertProps, 'message' | 'type'>) {
  if (!lockError) return null;
  
  // Determine type based on error content
  const type = lockError.includes('locked by') ? 'warning' : 
               lockError.includes('expired') ? 'info' :
               lockError.includes('success') ? 'success' :
               'error';
  
  return (
    <InlineLockAlert
      type={type}
      message={lockError}
      onDismiss={onDismiss}
      autoDismiss={type === 'success'}
      {...props}
    />
  );
}