import React from 'react'

interface SectionCardProps {
  id: string
  step: number
  title: string
  description?: string
  children: React.ReactNode
}

/** One numbered section inside the application card, divided from the previous by a rule. */
export const SectionCard: React.FC<SectionCardProps> = ({
  id,
  step,
  title,
  description,
  children,
}) => (
  <section
    id={id}
    aria-labelledby={`${id}-title`}
    className="scroll-mt-28 border-t px-5 py-8 first:border-t-0 sm:px-8 sm:py-10 md:px-10"
  >
    <header className="mb-6 flex items-baseline gap-3 sm:mb-8 sm:gap-4">
      <span className="text-sm font-semibold tabular-nums text-primary" aria-hidden="true">
        {String(step).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <h2 id={`${id}-title`} className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
    </header>
    {children}
  </section>
)
