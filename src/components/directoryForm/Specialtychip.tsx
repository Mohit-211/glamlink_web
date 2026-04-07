import React from 'react'

interface SpecialtyChipProps {
  label: string
  icon: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const SpecialtyChip: React.FC<SpecialtyChipProps> = ({
  label,
  icon,
  checked,
  onChange,
}) => (
  <label
    className={`
      flex items-center gap-2.5 border-[1.5px] rounded-[10px] px-3.5 py-2.5
      cursor-pointer select-none transition-all duration-150
      ${
        checked
          ? 'border-[#3BBDD4] bg-[#EEF9FC]'
          : 'border-[#DCF0F6] bg-[#F7FAFB] hover:border-[#A8E0EE] hover:bg-[#EEF9FC]'
      }
    `}
  >
    <input
      type="checkbox"
      className="hidden"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <div
      className={`
        w-4 h-4 rounded-[5px] border-[1.5px] flex items-center justify-center
        shrink-0 transition-all duration-150
        ${checked ? 'bg-[#3BBDD4] border-[#3BBDD4]' : 'bg-white border-[#B4DCE9]'}
      `}
    >
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
    <span className="text-xs font-semibold text-[#1A3A42]">
      {icon} {label}
    </span>
  </label>
)