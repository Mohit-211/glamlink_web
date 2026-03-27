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
    bg-white border border-[#DCF0F6] rounded-2xl p-8 mb-6
    transition-all duration-200
    focus-within:border-[#A8E0EE] focus-within:shadow-[0_4px_24px_rgba(59,189,212,0.1)]
  ">
    <div className="flex items-center gap-3 mb-5">
      <div className="
        w-[30px] h-[30px] rounded-full bg-[#3BBDD4] text-white
        text-[13px] font-bold flex items-center justify-center shrink-0
      ">
        {step}
      </div>
      <h2 className="font-poppins text-[17px] font-semibold text-[#1A3A42]">
        {title}
        {subtitle && (
          <span className="font-nunito text-xs font-light text-[#7AAAB8] ml-2">
            {subtitle}
          </span>
        )}
      </h2>
    </div>
    {children}
  </div>
)