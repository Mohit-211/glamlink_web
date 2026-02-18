"use client";

import { useState, useCallback, useEffect } from "react";
import { useSendPhoneMessage } from "./useSendPhoneMessage";

interface UseSavePhoneReturn {
  // Phone input state
  phoneNumber: string;
  formattedPhone: string;
  isValid: boolean;
  error: string | null;
  showInput: boolean;

  // Send state (from useSendPhoneMessage)
  isSending: boolean;
  success: boolean;
  sendError: string | null;

  // Mobile detection
  isMobile: boolean;

  // Actions
  setPhoneNumber: (phone: string) => void;
  setShowInput: (show: boolean) => void;
  handleSendToPhone: (professionalName: string, professionalId: string) => Promise<void>;
  handleCancel: () => void;
}

export function useSavePhone(): UseSavePhoneReturn {
  // Phone input state
  const [phoneNumber, setPhoneNumberState] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);

  // Mobile detection state
  const [isMobile, setIsMobile] = useState(false);

  // Get send message functionality from useSendPhoneMessage hook
  const {
    isSending,
    success,
    error: sendError,
    sendMessage,
    resetState: resetSendState,
  } = useSendPhoneMessage();

  // Detect if user is on mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        resetPhoneState();
        resetSendState();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, resetSendState]);

  // Validate US phone number format
  const validatePhone = useCallback((phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    // Accept 10 digits or 11 digits starting with 1
    if (cleaned.length === 10) {
      return true;
    }
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return true;
    }
    return false;
  }, []);

  // Format phone number as user types: (555) 555-5555
  const formatPhone = useCallback((phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');

    // Remove leading 1 if present for formatting
    const digits = cleaned.startsWith('1') && cleaned.length > 10
      ? cleaned.slice(1)
      : cleaned;

    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }, []);

  // Set phone number with auto-formatting and validation
  const setPhoneNumber = useCallback((phone: string) => {
    const formatted = formatPhone(phone);
    setFormattedPhone(formatted);
    setPhoneNumberState(phone.replace(/\D/g, ''));

    const valid = validatePhone(phone);
    setIsValid(valid);

    if (phone.replace(/\D/g, '').length > 0 && !valid) {
      setError("Please enter a valid 10-digit phone number");
    } else {
      setError(null);
    }
  }, [formatPhone, validatePhone]);

  // Reset phone input state
  const resetPhoneState = useCallback(() => {
    setPhoneNumberState("");
    setFormattedPhone("");
    setIsValid(false);
    setError(null);
    setShowInput(false);
  }, []);

  // Handle send button click
  const handleSendToPhone = useCallback(async (professionalName: string, professionalId: string) => {
    if (!isValid) return;
    await sendMessage(formattedPhone, professionalName, professionalId);
  }, [isValid, formattedPhone, sendMessage]);

  // Handle cancel/close
  const handleCancel = useCallback(() => {
    resetPhoneState();
    resetSendState();
  }, [resetPhoneState, resetSendState]);

  return {
    // Phone input state
    phoneNumber,
    formattedPhone,
    isValid,
    error,
    showInput,

    // Send state
    isSending,
    success,
    sendError,

    // Mobile detection
    isMobile,

    // Actions
    setPhoneNumber,
    setShowInput,
    handleSendToPhone,
    handleCancel,
  };
}
