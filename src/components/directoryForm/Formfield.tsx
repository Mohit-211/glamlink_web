import React from 'react'

interface FormFieldProps {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  hint,
  children,
  className = '',
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-[11px] font-bold uppercase tracking-widest text-[#4A7A88]">
      {label}
      {required && <span className="text-[#3BBDD4] ml-0.5">*</span>}
    </label>
    {children}
    {hint && (
      <p className="text-[11px] text-[#7AAAB8] leading-relaxed">{hint}</p>
    )}
  </div>
)

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input
    className={`
      bg-[#F7FAFB] border-[1.5px] border-[#DCF0F6] rounded-[10px]
      px-3.5 py-[11px] font-nunito text-sm text-[#1A3A42]
      outline-none w-full transition-all duration-200
      placeholder:text-[#AACCDA]
      focus:border-[#3BBDD4] focus:shadow-[0_0_0_3px_rgba(59,189,212,0.14)] focus:bg-white
      ${className}
    `}
    {...props}
  />
)

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea: React.FC<TextAreaProps> = ({ className = '', ...props }) => (
  <textarea
    className={`
      bg-[#F7FAFB] border-[1.5px] border-[#DCF0F6] rounded-[10px]
      px-3.5 py-[11px] font-nunito text-sm text-[#1A3A42]
      outline-none w-full transition-all duration-200 resize-y min-h-[88px]
      placeholder:text-[#AACCDA]
      focus:border-[#3BBDD4] focus:shadow-[0_0_0_3px_rgba(59,189,212,0.14)] focus:bg-white
      ${className}
    `}
    {...props}
  />
)

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
}

export const Select: React.FC<SelectProps> = ({ options, className = '', ...props }) => (
  <select
    className={`
      bg-[#F7FAFB] border-[1.5px] border-[#DCF0F6] rounded-[10px]
      px-3.5 py-[11px] font-nunito text-sm text-[#1A3A42]
      outline-none w-full transition-all duration-200
      focus:border-[#3BBDD4] focus:shadow-[0_0_0_3px_rgba(59,189,212,0.14)] focus:bg-white
      ${className}
    `}
    {...props}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
)