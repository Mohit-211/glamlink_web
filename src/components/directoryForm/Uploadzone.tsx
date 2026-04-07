'use client'
import React, { useRef } from 'react'

interface UploadZoneProps {
  label: string
  icon: string
  file: File | null
  onChange: (file: File | null) => void
  compact?: boolean
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  label,
  icon,
  file,
  onChange,
  compact = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped) onChange(dropped)
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`
          border-2 border-dashed border-[#B4DCE9] rounded-xl text-center cursor-pointer
          bg-[#F7FAFB] transition-all duration-200
          hover:border-[#3BBDD4] hover:bg-[#EEF9FC]
          ${compact ? 'py-4 px-6' : 'py-7 px-6'}
        `}
      >
        {!compact && (
          <div className="text-3xl mb-2">{icon}</div>
        )}
        <p className="text-[13px] text-[#7AAAB8] leading-relaxed">
          <span className="text-[#3BBDD4] font-bold">{label}</span>
          {!compact && <><br />JPG, PNG · max 5MB</>}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </div>
      {file && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="text-[#3BBDD4] font-bold text-xs">✓</span>
          <span className="text-[11px] text-[#3BBDD4] font-bold truncate">{file.name}</span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[#7AAAB8] hover:text-[#3BBDD4] text-xs ml-auto"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}