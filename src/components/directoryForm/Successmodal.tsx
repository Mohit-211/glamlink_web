import React from 'react'
import { CheckCircle2 } from 'lucide-react'

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

  const chips = [
    'Application received',
    ...(accessCard ? ['Access card queued'] : []),
    'Map listing pending',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="directory-success-title"
        className="w-full max-w-[440px] rounded-2xl border bg-card p-8 text-center shadow-large animate-fade-up sm:p-10"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 id="directory-success-title" className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
          Application submitted
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          Thank you for applying to Glamlink! Our team will review your listing within
          2–3 business days. Check your inbox for confirmation
          {accessCard && ' — and your free Access card on approval'}.
        </p>
        <ul className="mt-5 flex flex-wrap justify-center gap-2">
          {chips.map((chip) => (
            <li
              key={chip}
              className="rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1 text-xs font-medium text-foreground/80"
            >
              {chip}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="btn-primary mt-7 w-full sm:w-auto sm:px-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
        >
          Got it, thanks
        </button>
      </div>
    </div>
  )
}
