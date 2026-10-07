import React from 'react'
import { BadgeCheck, CreditCard, Mail, MapPin, QrCode, RefreshCw, Wallet } from 'lucide-react'
import { Switch } from './Switch'

interface AccessCardToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

const perks = [
  { icon: CreditCard, label: 'Digital Business Card' },
  { icon: MapPin, label: 'Interactive Map Listing' },
  { icon: Mail, label: 'Email Campaign Ready' },
  { icon: Wallet, label: 'Apple & Google Wallet' },
  { icon: QrCode, label: 'Auto QR Code' },
  { icon: RefreshCw, label: 'Always Up-to-Date' },
]

export const AccessCardToggle: React.FC<AccessCardToggleProps> = ({
  enabled,
  onChange,
}) => (
  <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-5 sm:p-6">
    <div className="flex items-start gap-4">
      <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-primary sm:flex">
        <BadgeCheck className="h-5 w-5" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold text-foreground">
          Your Access Digital Business Card
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          A digital business card at{' '}
          <strong className="font-semibold text-foreground">glamlink.net/pro/[yourname]</strong> —
          shareable via link, QR code, Apple Wallet & Google Pay. Delivered in your approval
          email and included in Glamlink email marketing campaigns.
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {perks.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-medium text-foreground/80"
            >
              <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        <Switch checked={enabled} onChange={onChange} className="mt-5">
          <span className="block text-sm font-semibold text-foreground">
            Yes — create my Access digital business card & map listing
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            No credit card · Activates instantly on approval
          </span>
        </Switch>
      </div>
    </div>
  </div>
)
