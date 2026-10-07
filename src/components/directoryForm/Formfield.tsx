'use client'
import React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { AlertCircle, Check, ChevronDown } from 'lucide-react'

// Shared look for every text-like control on the application form.
// text-base on mobile keeps iOS from zooming into the field on focus.
export const fieldClass = (invalid?: boolean) =>
  `w-full rounded-xl border bg-background px-4 text-base sm:text-sm text-foreground
  placeholder:text-muted-foreground/70 outline-none transition focus:ring-4 disabled:opacity-60
  ${invalid
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
    : 'border-input hover:border-primary/40 focus:border-primary focus:ring-primary/10'}`

// ── Field wrapper ─────────────────────────────────────────

interface FormFieldProps {
  label: string
  /** id of the control this label points at; omit for grouped controls. */
  htmlFor?: string
  /** id for the error message; defaults to `${htmlFor}-error`. */
  errorId?: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  errorId,
  required,
  hint,
  error,
  children,
  className = '',
}) => {
  const labelContent = (
    <>
      {label}
      {required && <span className="ml-0.5 text-primary" aria-hidden="true">*</span>}
    </>
  )
  const labelClass = 'text-sm font-medium text-foreground'
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      {htmlFor
        ? <label htmlFor={htmlFor} className={labelClass}>{labelContent}</label>
        : <p className={labelClass}>{labelContent}</p>}
      {children}
      {error ? (
        <p id={errorId ?? (htmlFor && `${htmlFor}-error`)} className="flex items-start gap-1.5 text-xs text-red-500">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}

// ── Inputs ────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input: React.FC<InputProps> = ({ className = '', invalid, id, ...props }) => (
  <input
    id={id}
    aria-invalid={invalid || undefined}
    aria-describedby={invalid && id ? `${id}-error` : undefined}
    className={`${fieldClass(invalid)} h-12 ${className}`}
    {...props}
  />
)

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const TextArea: React.FC<TextAreaProps> = ({ className = '', invalid, id, rows = 4, ...props }) => (
  <textarea
    id={id}
    aria-invalid={invalid || undefined}
    aria-describedby={invalid && id ? `${id}-error` : undefined}
    rows={rows}
    className={`${fieldClass(invalid)} resize-y py-3 leading-relaxed ${className}`}
    {...props}
  />
)

// ── Select ────────────────────────────────────────────────

interface SelectProps {
  id?: string
  /** "" shows the placeholder. */
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string; disabled?: boolean }[]
  placeholder?: string
  invalid?: boolean
  disabled?: boolean
}

/** Radix select styled to match Input; option values must be non-empty. */
export const Select: React.FC<SelectProps> = ({
  id,
  value,
  onValueChange,
  options,
  placeholder = 'Select…',
  invalid,
  disabled,
}) => (
  <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
    <SelectPrimitive.Trigger
      id={id}
      aria-invalid={invalid || undefined}
      className={`${fieldClass(invalid)} group flex h-12 items-center justify-between gap-3 text-left
        data-[placeholder]:text-muted-foreground/70
        data-[state=open]:border-primary data-[state=open]:ring-4 data-[state=open]:ring-primary/10`}
    >
      <span className="min-w-0 truncate">
        <SelectPrimitive.Value placeholder={placeholder} />
      </span>
      <SelectPrimitive.Icon asChild>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary"
          aria-hidden="true"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>

    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={6}
        collisionPadding={16}
        className="z-[60] max-h-[min(var(--radix-select-content-available-height),320px)] w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border bg-popover shadow-large data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
      >
        <SelectPrimitive.Viewport className="p-1.5">
          {options.map((o) => (
            <SelectPrimitive.Item
              key={o.value}
              value={o.value}
              disabled={o.disabled}
              className="relative flex cursor-pointer select-none items-center rounded-lg py-2.5 pl-3 pr-9 text-sm leading-snug text-foreground outline-none transition-colors data-[highlighted]:bg-primary/[0.07] data-[state=checked]:font-semibold data-[state=checked]:text-primary data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45"
            >
              <SelectPrimitive.ItemText>{o.label}</SelectPrimitive.ItemText>
              <SelectPrimitive.ItemIndicator className="absolute right-3 flex items-center">
                <Check className="h-4 w-4" aria-hidden="true" />
              </SelectPrimitive.ItemIndicator>
            </SelectPrimitive.Item>
          ))}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  </SelectPrimitive.Root>
)
