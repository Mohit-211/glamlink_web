"use client";

import React, { useState, useEffect } from "react";
import { X, Mail, User, Sparkles, BookOpen } from "lucide-react";

interface EmailSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueAsGuest?: () => void;
  issueTitle?: string;
  userType?: 'pros' | 'users';
}

export default function EmailSignupModal({
  isOpen,
  onClose,
  onContinueAsGuest,
  issueTitle = "this issue",
  userType = "users"
}: EmailSignupModalProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setFirstName("");
      setLastName("");
      setStatus("idle");
      setErrorMessage("");
      // Clear any previous response data
      sessionStorage.removeItem("glamlink_newsletter_response");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName, userType }),
      });

      const json = await res.json();

      if (res.ok) {
        setStatus("success");
        // Save subscription status to localStorage
        localStorage.setItem("glamlink_newsletter_subscribed", "true");
        localStorage.setItem("glamlink_newsletter_email", email);

        // Store response data for custom messages
        sessionStorage.setItem("glamlink_newsletter_response", JSON.stringify(json));

        // Don't auto-redirect - let user click button
      } else {
        setStatus("error");
        setErrorMessage(json.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-glamlink-teal to-teal-600 p-8 text-white">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">
            Get Exclusive Beauty Content
          </h2>
          <p className="text-center text-white/90 text-sm">
            Subscribe to our newsletter for the latest beauty trends, expert tips, and special offers
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === "success" ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {(() => {
                  const responseData = sessionStorage.getItem("glamlink_newsletter_response");
                  if (responseData) {
                    const response = JSON.parse(responseData);
                    if (response.resubscribed) {
                      return "Welcome Back!";
                    } else if (response.message?.includes("already subscribed")) {
                      return "You're Already Subscribed!";
                    }
                  }
                  return "Welcome to Glamlink!";
                })()}
              </h3>
              <p className="text-gray-600 mb-6">
                {(() => {
                  const responseData = sessionStorage.getItem("glamlink_newsletter_response");
                  if (responseData) {
                    const response = JSON.parse(responseData);
                    if (response.resubscribed) {
                      return "You've been resubscribed to The Glamlink Edit and will receive the latest beauty trends and exclusive offers.";
                    } else if (response.message?.includes("already subscribed")) {
                      return "You're already subscribed to The Glamlink Edit. Continue reading to enjoy our exclusive content!";
                    }
                  }
                  return "You're now subscribed to our newsletter and will receive the latest beauty trends and exclusive offers.";
                })()}
              </p>
              {onContinueAsGuest && issueTitle && (
                <button
                  onClick={onContinueAsGuest}
                  className="inline-flex items-center px-6 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  View {issueTitle}
                </button>
              )}
              {!onContinueAsGuest && (
                <button
                  onClick={onClose}
                  className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-full hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="your@email.com"
                      disabled={status === "loading"}
                    />
                  </div>
                </div>

                {/* Name fields in a row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        placeholder="First"
                        disabled={status === "loading"}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="Last"
                      disabled={status === "loading"}
                    />
                  </div>
                </div>

                {/* Error message */}
                {status === "error" && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-gradient-to-r from-glamlink-teal to-teal-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-glamlink-teal-dark hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Subscribing...
                    </span>
                  ) : (
                    onContinueAsGuest ? "Subscribe & Continue Reading" : "Subscribe to Newsletter"
                  )}
                </button>
              </form>

              {/* Divider and Continue as Guest - only show when viewing issues */}
              {onContinueAsGuest && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">or</span>
                    </div>
                  </div>
                  <button
                    onClick={onContinueAsGuest}
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <BookOpen className="w-5 h-5" />
                    Continue as Guest
                  </button>
                </>
              )}

              {/* Privacy note */}
              <p className="text-xs text-gray-500 text-center mt-4">
                By subscribing, you agree to receive marketing emails from Glamlink. 
                You can unsubscribe at any time.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}