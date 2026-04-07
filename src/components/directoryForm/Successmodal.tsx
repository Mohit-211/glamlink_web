import React from 'react'

interface SuccessModalProps {
  open: boolean
  onClose: () => void
  accessCard: boolean
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  onClose,
  accessCard,
}) => {
  if (!open) return null

  return (
    <div className="
      fixed inset-0 bg-[rgba(26,58,66,0.55)] backdrop-blur-md
      z-50 flex items-center justify-center p-4
    ">
      <div className="
        bg-white rounded-[22px] p-12 text-center max-w-[430px] w-full
        border-t-4 border-[#3BBDD4]
        animate-[popIn_0.42s_cubic-bezier(0.34,1.56,0.64,1)]
      ">
        <div className="text-5xl mb-3.5">🎉</div>
        <h2 className="font-poppins text-2xl font-semibold text-[#1A3A42] mb-2.5">
          Application Submitted!
        </h2>
        <p className="text-sm text-[#4A7A88] leading-[1.7] mb-5">
          Thank you for joining GlamLink! Our team will review your listing within
          2–3 business days. Check your inbox for confirmation
          {accessCard && ' — and your free Access card on approval'}.
        </p>
        <div className="flex flex-wrap gap-2 justify-center mb-7">
          <span className="text-xs font-bold px-3.5 py-1.5 rounded-full border-[1.5px] bg-[#EDFAF4] border-[#A8E5C8] text-[#2E8A5A]">
            ✓ Application Received
          </span>
          {accessCard && (
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full border-[1.5px] bg-[#EEF9FC] border-[#D6F2F8] text-[#2A9BB5]">
              ✦ Access Card Queued
            </span>
          )}
          <span className="text-xs font-bold px-3.5 py-1.5 rounded-full border-[1.5px] bg-[#EEF9FC] border-[#D6F2F8] text-[#2A9BB5]">
            🗺️ Map Listing Pending
          </span>
        </div>
        <button
          onClick={onClose}
          className="
            bg-[#3BBDD4] hover:bg-[#2A9BB5] text-white border-none rounded-full
            px-10 py-3.5 font-poppins text-sm font-semibold
            transition-colors duration-200
            shadow-[0_4px_14px_rgba(59,189,212,0.3)]
          "
        >
          Got it, thanks!
        </button>
      </div>
    </div>
  )
}