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
    bg-accent
    border-2 border-primary rounded-2xl p-7
    flex gap-5 items-start relative overflow-hidden mb-6
  ">

    {/* icon */}
    <div className="
      w-[50px] h-[50px] bg-primary rounded-[13px]
      flex items-center justify-center text-2xl shrink-0
      shadow-primary
    ">
      ✦
    </div>

    <div className="flex-1 min-w-0">
      <h3 className="text-[17px] font-semibold text-foreground mb-1.5">
        Your Access Digital Business Card{' '}
        {/* <span className="
          inline-block bg-primary text-white
          text-[10px] font-semibold tracking-widest uppercase
          px-2.5 py-0.5 rounded-full align-middle ml-1
        ">
          FREE
        </span> */}
      </h3>

      <p className="text-[13px] text-muted-foreground leading-[1.65] mb-3.5">
        A beautiful digital business card at{' '}
        <strong className="text-foreground">glamlink.net/pro/[yourname]</strong> —
        shareable via link, QR code, Apple Wallet & Google Pay. Delivered in your
        approval email and included in GlamLink email marketing campaigns.
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {perks.map((perk) => (
          <span
            key={perk}
            className="
              text-[11px] font-semibold bg-primary/10
              text-primary border border-primary/25
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
            ${enabled ? 'bg-primary' : 'bg-accent'}
          `}
        >
          <div
            className={`
              absolute w-5 h-5 bg-card rounded-full top-[3px]
              shadow-soft
              transition-transform duration-250
              ${enabled ? 'translate-x-[22px]' : 'translate-x-[3px]'}
            `}
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Yes — create my Access digital business card & map listing
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            No credit card · Activates instantly on approval
          </p>
        </div>
      </div>
    </div>
  </div>
)