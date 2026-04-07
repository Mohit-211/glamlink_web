import React from 'react'

interface AccessCardToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

const perks = [
  '📇 Digital Business Card',
  '🗺️ Interactive Map Listing',
  '📧 Email Campaign Ready',
  '📱 Apple & Google Wallet',
  '🔗 Auto QR Code',
  '🔄 Always Up-to-Date',
]

export const AccessCardToggle: React.FC<AccessCardToggleProps> = ({
  enabled,
  onChange,
}) => (
  <div className="
    bg-gradient-to-br from-[#E8F9FD] to-white
    border-2 border-[#3BBDD4] rounded-2xl p-7
    flex gap-5 items-start relative overflow-hidden mb-6
  ">
    {/* decorative glow */}
    <div className="
      absolute -top-10 -right-10 w-32 h-32 rounded-full
      bg-[radial-gradient(circle,rgba(59,189,212,0.1)_0%,transparent_70%)]
      pointer-events-none
    " />

    {/* icon */}
    <div className="
      w-[50px] h-[50px] bg-[#3BBDD4] rounded-[13px]
      flex items-center justify-center text-2xl shrink-0
      shadow-[0_4px_14px_rgba(59,189,212,0.3)]
    ">
      ✦
    </div>

    <div className="flex-1 min-w-0">
      <h3 className="font-poppins text-[17px] font-semibold text-[#1A3A42] mb-1.5">
        Your FREE Access Digital Business Card{' '}
        <span className="
          inline-block bg-[#3BBDD4] text-white
          text-[10px] font-bold tracking-widest uppercase
          px-2.5 py-0.5 rounded-full align-middle ml-1
        ">
          FREE
        </span>
      </h3>

      <p className="text-[13px] text-[#4A7A88] leading-[1.65] mb-3.5">
        A beautiful digital business card at{' '}
        <strong className="text-[#1A3A42]">glamlink.net/pro/[yourname]</strong> —
        shareable via link, QR code, Apple Wallet & Google Pay. Delivered in your
        approval email and included in GlamLink email marketing campaigns.
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {perks.map((perk) => (
          <span
            key={perk}
            className="
              text-[11px] font-bold bg-[rgba(59,189,212,0.1)]
              text-[#2A9BB5] border border-[rgba(59,189,212,0.25)]
              rounded-full px-3 py-1
            "
          >
            {perk}
          </span>
        ))}
      </div>

      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => onChange(!enabled)}
      >
        {/* toggle */}
        <div
          className={`
            w-12 h-[26px] rounded-full relative transition-colors duration-250 shrink-0
            ${enabled ? 'bg-[#3BBDD4]' : 'bg-[#B4DCE9]'}
          `}
        >
          <div
            className={`
              absolute w-5 h-5 bg-white rounded-full top-[3px]
              shadow-[0_1px_5px_rgba(0,0,0,0.18)]
              transition-transform duration-250
              ${enabled ? 'translate-x-[22px]' : 'translate-x-[3px]'}
            `}
          />
        </div>
        <div>
          <p className="text-sm font-bold text-[#1A3A42]">
            Yes — create my FREE Access digital business card & map listing
          </p>
          <p className="text-[11px] text-[#7AAAB8] mt-0.5">
            No credit card · Activates instantly on approval
          </p>
        </div>
      </div>
    </div>
  </div>
)