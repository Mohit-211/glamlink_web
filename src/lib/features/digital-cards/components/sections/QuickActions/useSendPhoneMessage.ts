"use client";

import { useState, useCallback } from "react";

interface UseSendPhoneMessageReturn {
  isSending: boolean;
  success: boolean;
  error: string | null;
  sendMessage: (phoneNumber: string, professionalName: string, professionalId: string) => Promise<void>;
  resetState: () => void;
}

export function useSendPhoneMessage(): UseSendPhoneMessageReturn {
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Send SMS message via API
  const sendMessage = useCallback(async (
    phoneNumber: string,
    professionalName: string,
    professionalId: string
  ): Promise<void> => {
    setIsSending(true);
    setError(null);
    setSuccess(false);

    try {
      // Build the URL for the professional's digital card
      const cardUrl = `http://glamlink.net/for-professionals/${professionalId}`;

      // Build the message
      const message = `Here is your digital card for ${professionalName}: ${cardUrl}`;

      // Create JSON payload
      const payload = {
        message: message
      };

      // Log the JSON for verification
      console.log('JSON Payload:', JSON.stringify(payload, null, 2));

      // Send to API endpoint
      // TODO: Replace 'www.sample.com' with actual API endpoint
      const response = await fetch('https://www.sample.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      // Mark as success
      setSuccess(true);
    } catch (err) {
      console.error('Error sending message:', err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  }, []);

  // Reset all state
  const resetState = useCallback(() => {
    setIsSending(false);
    setSuccess(false);
    setError(null);
  }, []);

  return {
    isSending,
    success,
    error,
    sendMessage,
    resetState,
  };
}
