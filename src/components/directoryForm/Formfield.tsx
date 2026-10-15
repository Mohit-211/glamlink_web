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
    <label className="label-glamlink mb-0">
      {label}
      {required && <span className="text-primary ml-0.5">*</span>}
    </label>
    {children}
    {hint && (
      <p className="text-[11px] text-muted-foreground leading-relaxed">{hint}</p>
    )}
  </div>
)

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input
    className={`input-glamlink ${className}`}
    {...props}
  />
)

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const TextArea: React.FC<TextAreaProps> = ({ className = '', ...props }) => (
  <textarea
    className={`input-glamlink min-h-[88px] resize-y ${className}`}
    {...props}
  />
)

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
}

export const Select: React.FC<SelectProps> = ({ options, className = '', ...props }) => (
  <select
    className={`input-glamlink cursor-pointer ${className}`}
    {...props}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
)