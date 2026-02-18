"use client";

import { Heart, Calendar, Smartphone, Loader2, X, Check } from "lucide-react";
import { Professional } from "@/lib/pages/for-professionals/types/professional";
import { useSaveCardVirtual } from "./useSaveCardVirtual";
import { useSavePhone } from "./useSavePhone";

interface QuickActionsProps {
  professional: Professional;
  layout?: "grid" | "list";
}

export default function QuickActions({ professional, layout = "grid" }: QuickActionsProps) {
  // Hooks
  const { handleSaveToContacts } = useSaveCardVirtual(professional);
  const {
    formattedPhone,
    isValid,
    error: phoneError,
    showInput,
    isSending,
    success,
    sendError,
    isMobile,
    setPhoneNumber,
    setShowInput,
    handleSendToPhone,
    handleCancel,
  } = useSavePhone();

  const gridClass = layout === "grid" ? "grid grid-cols-1 gap-3" : "space-y-3";

  const actions = [
    /*
    {
      icon: Heart,
      label: "Save",
      onClick: handleSaveToContacts,
      primary: false,
      available: isMobile // Only show on mobile devices
    },
    {
      icon: Smartphone,
      label: "Save to Phone",
      onClick: () => setShowInput(true),
      primary: false,
      available: !showInput && !success // Hide when input is shown or success
    },
    */
    {
      icon: Calendar,
      label: "Book Appointment",
      onClick: () => {
        window.open("https://qrco.de/bfw5e3", "_blank", "noopener,noreferrer");
      },
      primary: true,
      available: true
    }
  ];

  return (
    <div className={gridClass}>
      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">This digital card has been sent to your phone!</span>
        </div>
      )}

      {/* Phone Input Form */}
      {showInput && !success && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Enter your phone number
            </label>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            type="tel"
            value={formattedPhone}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="(555) 555-5555"
            className={`
              w-full px-3 py-2 border rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-transparent
              ${phoneError ? 'border-red-300 bg-red-50' : 'border-gray-300'}
            `}
            disabled={isSending}
          />

          {phoneError && (
            <p className="text-xs text-red-500">{phoneError}</p>
          )}

          {sendError && (
            <p className="text-xs text-red-500">{sendError}</p>
          )}

          <button
            onClick={() => handleSendToPhone(professional.name, professional.id)}
            disabled={!isValid || isSending}
            className={`
              w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
              ${isValid && !isSending
                ? 'bg-glamlink-teal text-white hover:bg-glamlink-teal-dark'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <span>Send</span>
            )}
          </button>
        </div>
      )}

      {/* Action Buttons */}
      {actions.filter(action => action.available).map((action, index) => {
        const Icon = action.icon;
        return (
          <button
            key={index}
            onClick={action.onClick}
            className={`
              flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all md:w-full
              ${action.primary
                ? 'bg-glamlink-teal text-white hover:bg-glamlink-teal-dark shadow-md hover:shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }
              justify-center
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}
