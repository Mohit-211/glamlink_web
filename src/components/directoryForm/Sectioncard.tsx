import React from 'react'

interface SectionCardProps {
  step: number
  title: string
  subtitle?: string
  children: React.ReactNode
}

export const SectionCard: React.FC<SectionCardProps> = ({
  step,
  title,
  subtitle,
  children,
}) => (
  <div className="
    bg-card border border-border rounded-2xl p-8 mb-6
    transition-all duration-200
    focus-within:border-border focus-within:shadow-primary
  ">
    <div className="flex items-center gap-3 mb-5">
      <div className="
        w-[30px] h-[30px] rounded-full bg-primary text-white
        text-[13px] font-semibold flex items-center justify-center shrink-0
      ">
        {step}
      </div>
      <h2 className="text-[17px] font-semibold text-foreground">
        {title}
        {subtitle && (
          <span className="text-xs font-normal text-muted-foreground ml-2">
            {subtitle}
          </span>
        )}
      </h2>
    </div>
    {children}
  </div>
)