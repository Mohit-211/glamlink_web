'use client'
import React, { useState, KeyboardEvent } from 'react'

interface TreatmentTaggerProps {
  treatments: string[]
  onChange: (treatments: string[]) => void
}

export const TreatmentTagger: React.FC<TreatmentTaggerProps> = ({
  treatments,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState('')

  const addTreatments = () => {
    const parts = inputValue
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
    const next = [...treatments]
    parts.forEach((p) => {
      if (!next.includes(p)) next.push(p)
    })
    onChange(next)
    setInputValue('')
  }

  const remove = (t: string) => onChange(treatments.filter((x) => x !== t))

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTreatments()
    }
  }

  return (
    <div>
      {treatments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {treatments.map((t) => (
            <span
              key={t}
              className="
                inline-flex items-center gap-1.5
                bg-[#EEF9FC] border-[1.5px] border-[#D6F2F8]
                rounded-full px-3 py-1 text-xs font-bold text-[#2A9BB5]
              "
            >
              {t}
              <button
                type="button"
                onClick={() => remove(t)}
                className="text-[#3BBDD4] hover:text-[#2A9BB5] text-sm leading-none transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2.5">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="e.g. Botox, Microneedling, HydraFacial, Lash Extensions…"
          className="
            flex-1 bg-[#F7FAFB] border-[1.5px] border-[#DCF0F6] rounded-[10px]
            px-3.5 py-2.5 font-nunito text-[13px] text-[#1A3A42]
            outline-none transition-all duration-200 placeholder:text-[#AACCDA]
            focus:border-[#3BBDD4] focus:bg-white
          "
        />
        <button
          type="button"
          onClick={addTreatments}
          className="
            bg-[#3BBDD4] hover:bg-[#2A9BB5] text-white border-none rounded-[10px]
            px-5 py-2.5 text-[13px] font-bold whitespace-nowrap
            transition-colors duration-200
          "
        >
          + Add
        </button>
      </div>

      <p className="text-[11px] text-[#7AAAB8] mt-2 leading-relaxed">
        Press Enter or click Add. Separate multiple with commas.
      </p>

      <div className="
        bg-[#EEF9FC] border-l-[3px] border-[#3BBDD4] rounded-r-[10px]
        px-4 py-3.5 text-[13px] text-[#4A7A88] leading-relaxed mt-4
      ">
        <strong className="text-[#1A3A42]">How QR linking works:</strong>{' '}
        Once approved, each treatment gets a dedicated page (e.g.{' '}
        <code className="bg-[#D6F2F8] text-[#2A9BB5] px-1.5 py-0.5 rounded text-[11px] font-mono font-bold">
          glamlink.net/directory/microneedling
        </code>
        ). When that treatment appears in a GlamLink article, your listing is featured
        with a scannable QR code — clients can book directly with you.
      </div>
    </div>
  )
}