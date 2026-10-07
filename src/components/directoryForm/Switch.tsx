import React from 'react'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  /** Label content; the whole row is the click target. */
  children: React.ReactNode
  className?: string
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, children, className = '' }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`group flex w-full items-start gap-3 rounded-xl text-left outline-none focus-visible:ring-4 focus-visible:ring-primary/15 ${className}`}
  >
    <span
      className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${checked ? 'bg-primary' : 'bg-border group-hover:bg-primary/30'}`}
      aria-hidden="true"
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-transform duration-200 ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
      />
    </span>
    <span className="min-w-0">{children}</span>
  </button>
)
