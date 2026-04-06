'use client'
import React, { useState, useEffect, useRef } from 'react'
import { FormField, Input, TextArea, Select } from './Formfield'
import { AccessCardToggle } from './Accesscardtoggle'
import { SuccessModal } from './Successmodal'
import { SectionCard } from './Sectioncard'
import { getallCategories } from '@/api/Api'

// ── Types ─────────────────────────────────────────────────

export type BookingMethod =
  | 'Go to Booking Link'
  | 'Phone / text'
  | 'Walk-ins welcome'
  | 'By appointment only'
  | ''

export type LocationType = 'exact_address' | 'service_area' | 'virtual'

export interface SocialMedia {
  instagram?: string
  tiktok?: string
  facebook?: string
  youtube?: string
}

export interface Location {
  label: string
  location_type: LocationType
  address: string
  city: string
  state: string
  business_name: string
  phone: string
  description: string
  is_primary: boolean
  sort_order: number
}

export interface BusinessHourNote {
  note: string
}

export interface GalleryItem {
  file: File
  caption: string
  is_thumbnail: boolean
  sort_order: number
  preview_url: string
}

export interface Category {
  id: number
  title: string
  slug: string
  is_active: boolean
}

export interface FormData {
  name: string
  professional_title: string
  email: string
  phone: string
  bio: string
  custom_handle: string
  website?: string
  social_media: SocialMedia
  preferred_booking_method: BookingMethod
  booking_link: string
  primary_specialty: string
  specialties: string[]
  locations: Location[]
  business_hours: BusinessHourNote[]
  profilePhoto: File | null
  profilePhotoPreview: string
  gallery: GalleryItem[]
  offer_promotion: boolean
  promotion_details: string
  elite_setup: boolean
  important_info: string[]
  excites_about_glamlink: string[]
  biggest_pain_points: string[]
  createAccessCard: boolean
}

// ── Constants ─────────────────────────────────────────────

const BUSINESS_HOUR_PRESETS: BusinessHourNote[] = [
  { note: 'Hours: By Appointment Only' },
  { note: 'Availability: Flexible Daily Hours' },
  { note: 'Booking: Advance Booking Required' },
  { note: 'Early/Late Times: Available Upon Request' },
  { note: 'Please Provide Requested Time When Booking' },
  { note: 'Travel Available Upon Request' },
]

const EXCITES_OPTIONS = [
  "Clients ability to discover pros nearby and check out their services, work, reviews, etc",
  "Seamless booking inside Glamlink either in app or goes directly to your booking link",
  "Pro shops & e-commerce",
  "The Glamlink Edit magazine & spotlights",
  "AI powered discovery & smart recommendations (coming soon)",
  "Community & networking with other pros",
]

const PAIN_POINTS_OPTIONS = [
  "Posting but no conversions",
  "DMs - too much back and forth",
  "No shows",
  "Juggling too many platforms (booking, social media, e-commerce, etc)",
  "Inventory/aftercare not tied to treatments",
  "Client notes/consents all over the place",
  "Finding new clients",
  "None of the above",
]

const HERO_BADGES = [
  { icon: '🗺️', label: 'Found on Treatment Map' },
  { icon: '📇', label: 'Free Digital Card' },
  { icon: '🔗', label: 'QR Code in Articles' },
  { icon: '📧', label: 'Email Marketing Ready' },
]

const PROCESS_STEPS = ['Submit Form', 'Admin Reviews', 'Approved & Live', 'Map + Card + Articles', 'Email Campaigns']

const INITIAL_FORM: FormData = {
  name: '',
  professional_title: '',
  email: '',
  phone: '',
  bio: '',
  custom_handle: '',
  website: '',
  social_media: { instagram: '', tiktok: '' },
  preferred_booking_method: '',
  booking_link: '',
  primary_specialty: '',
  specialties: [],
  locations: [{
    label: '', location_type: 'exact_address', address: '', city: '',
    state: '', business_name: '', phone: '', description: '', is_primary: true, sort_order: 1,
  }],
  business_hours: BUSINESS_HOUR_PRESETS,
  profilePhoto: null,
  profilePhotoPreview: '',
  gallery: [],
  offer_promotion: false,
  promotion_details: '',
  elite_setup: false,
  important_info: [],
  excites_about_glamlink: [],
  biggest_pain_points: [],
  createAccessCard: true,
}

// ── Reusable UI ───────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!enabled)}
      className={`w-10 h-[22px] rounded-full relative transition-colors duration-200 shrink-0 cursor-pointer ${enabled ? 'bg-[#3BBDD4]' : 'bg-[#B4DCE9]'}`}
    >
      <div className={`absolute w-4 h-4 bg-white rounded-full top-[3px] shadow-sm transition-transform duration-200 ${enabled ? 'translate-x-[22px]' : 'translate-x-[3px]'}`} />
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MultiSelect({
  options, selected, onChange, minLabel,
}: {
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
  minLabel?: string
}) {
  const toggle = (val: string) =>
    onChange(selected.includes(val) ? selected.filter((x) => x !== val) : [...selected, val])

  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`text-left text-[13px] px-4 py-3 rounded-xl border-[1.5px] transition-all duration-150 leading-snug flex items-center gap-3
              ${active ? 'bg-[#EEF9FC] border-[#3BBDD4] text-[#1A3A42] font-semibold' : 'bg-[#F7FAFB] border-[#DCF0F6] text-[#4A7A88] hover:border-[#A8E0EE] hover:bg-[#EEF9FC]'}`}
          >
            <span className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${active ? 'bg-[#3BBDD4] border-[#3BBDD4]' : 'border-[#B4DCE9]'}`}>
              {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </span>
            {opt}
          </button>
        )
      })}
      {minLabel && selected.length === 0 && (
        <p className="text-[11px] text-[#F4928A] mt-1">{minLabel}</p>
      )}
    </div>
  )
}

// ── Business Hours ────────────────────────────────────────

function BusinessHoursSection({ hours, onChange }: { hours: BusinessHourNote[]; onChange: (h: BusinessHourNote[]) => void }) {
  const toggle = (note: string) => {
    const exists = hours.some((h) => h.note === note)
    onChange(exists ? hours.filter((h) => h.note !== note) : [...hours, { note }])
  }
  return (
    <div className="flex flex-col gap-2">
      {BUSINESS_HOUR_PRESETS.map((preset) => {
        const active = hours.some((h) => h.note === preset.note)
        return (
          <button
            key={preset.note}
            type="button"
            onClick={() => toggle(preset.note)}
            className={`text-left text-[13px] px-4 py-3 rounded-xl border-[1.5px] transition-all duration-150 flex items-center gap-3
              ${active ? 'bg-[#EEF9FC] border-[#3BBDD4] text-[#1A3A42] font-semibold' : 'bg-[#F7FAFB] border-[#DCF0F6] text-[#4A7A88] hover:border-[#A8E0EE]'}`}
          >
            <div className={`w-4 h-4 rounded-[4px] border-[1.5px] flex items-center justify-center shrink-0 ${active ? 'bg-[#3BBDD4] border-[#3BBDD4]' : 'border-[#B4DCE9] bg-white'}`}>
              {active && (
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            {preset.note}
          </button>
        )
      })}
    </div>
  )
}

// ── Media & Profile ───────────────────────────────────────

function MediaSection({
  profilePhotoPreview, gallery,
  onProfileChange, onGalleryAdd, onGalleryRemove, onGalleryCaption, onGalleryThumbnail,
}: {
  profilePhotoPreview: string
  gallery: GalleryItem[]
  onProfileChange: (file: File, preview: string) => void
  onGalleryAdd: (files: FileList) => void
  onGalleryRemove: (i: number) => void
  onGalleryCaption: (i: number, caption: string) => void
  onGalleryThumbnail: (i: number) => void
}) {
  const profileRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      {/* Profile Image */}
      <div className="mb-8">
        <p className="text-[13px] font-bold text-[#3BBDD4] mb-3">Profile Image</p>
        <div className="flex items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-[90px] h-[90px] rounded-full border-2 border-[#DCF0F6] overflow-hidden bg-[#EEF9FC] flex items-center justify-center">
              {profilePhotoPreview
                ? <img src={profilePhotoPreview} alt="Profile" className="w-full h-full object-cover" />
                : <span className="text-4xl">👤</span>
              }
            </div>
            <button
              type="button"
              onClick={() => profileRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-[#3BBDD4] rounded-full flex items-center justify-center shadow-md hover:bg-[#2A9BB5] transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M9.5 1.5L11.5 3.5L4.5 10.5H2.5V8.5L9.5 1.5Z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </button>
            <input ref={profileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) onProfileChange(f, URL.createObjectURL(f))
              }}
            />
          </div>
          <p className="text-[13px] text-[#7AAAB8] leading-relaxed">
            Square image works best. Face centered. Clean background.
          </p>
        </div>
      </div>

      {/* Gallery */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-bold text-[#3BBDD4]">
            Gallery <span className="text-[#7AAAB8] font-normal">(Max 5)</span>
          </p>
          {gallery.length < 5 && (
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              className="bg-[#3BBDD4] hover:bg-[#2A9BB5] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              + Upload
            </button>
          )}
          <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => { if (e.target.files) onGalleryAdd(e.target.files) }}
          />
        </div>

        {gallery.length === 0 ? (
          <div
            className="border-2 border-dashed border-[#B4DCE9] rounded-xl p-10 text-center cursor-pointer hover:border-[#3BBDD4] hover:bg-[#EEF9FC] transition-all"
            onClick={() => galleryRef.current?.click()}
          >
            <p className="text-[13px] text-[#7AAAB8]">
              <span className="text-[#3BBDD4] font-bold">Click to upload</span> gallery photos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {gallery.map((item, i) => (
              <div key={i} className="border border-[#DCF0F6] rounded-xl overflow-hidden bg-white">
                <div className="relative h-[140px]">
                  <img src={item.preview_url} alt={item.caption || `Photo ${i + 1}`} className="w-full h-full object-cover" />
                  {item.is_thumbnail && (
                    <span className="absolute top-2 left-2 bg-[#3BBDD4] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Thumbnail
                    </span>
                  )}
                </div>
                {/* Caption */}
                <div className="px-3 py-2 border-t border-[#DCF0F6]">
                  <input
                    type="text"
                    value={item.caption}
                    onChange={(e) => onGalleryCaption(i, e.target.value)}
                    placeholder="Add caption…"
                    className="w-full text-[12px] text-[#1A3A42] bg-transparent outline-none placeholder:text-[#AAC8D0]"
                  />
                </div>
                {/* Actions */}
                <div className="px-3 py-2 flex items-center gap-3 border-t border-[#DCF0F6]">
                  {!item.is_thumbnail && (
                    <button
                      type="button"
                      onClick={() => onGalleryThumbnail(i)}
                      className="text-[11px] text-[#3BBDD4] font-semibold hover:underline"
                    >
                      Make Thumbnail
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onGalleryRemove(i)}
                    className="text-[11px] text-[#F4928A] font-semibold hover:underline ml-auto"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────

export default function DirectoryFormApply() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await getallCategories();

      console.log(response, "===>>");

      const categoryArray = Array.isArray(response?.data?.rows)
        ? response.data.rows
        : [];

      setCategories(categoryArray.filter((c: any) => c.is_active));
    } catch (error: any) {
      console.error("Error fetching categories:", error?.message || error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  fetchCategories();
}, []);
console.log(categories,"==")
  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const setSocial = (key: keyof SocialMedia, value: string) =>
    setForm((prev) => ({ ...prev, social_media: { ...prev.social_media, [key]: value } }))

  const setLocation = (idx: number, key: keyof Location, value: string | boolean | number) =>
    setForm((prev) => {
      const locs = [...prev.locations]
      locs[idx] = { ...locs[idx], [key]: value }
      return { ...prev, locations: locs }
    })

  const toggleSpecialty = (title: string) => {
    if (form.specialties.includes(title)) {
      set('specialties', form.specialties.filter((s) => s !== title))
    } else {
      if (form.specialties.length >= 5) return
      set('specialties', [...form.specialties, title])
    }
  }

  const handleGalleryAdd = (files: FileList) => {
    const remaining = 5 - form.gallery.length
    const items: GalleryItem[] = Array.from(files).slice(0, remaining).map((file, i) => ({
      file,
      caption: '',
      is_thumbnail: form.gallery.length === 0 && i === 0,
      sort_order: form.gallery.length + i + 1,
      preview_url: URL.createObjectURL(file),
    }))
    set('gallery', [...form.gallery, ...items])
  }

  const handleGalleryRemove = (idx: number) => {
    let next = form.gallery.filter((_, i) => i !== idx)
    if (!next.some((g) => g.is_thumbnail) && next.length > 0) next[0].is_thumbnail = true
    set('gallery', next.map((g, i) => ({ ...g, sort_order: i + 1 })))
  }

  const handleGalleryCaption = (idx: number, caption: string) => {
    const next = [...form.gallery]
    next[idx] = { ...next[idx], caption }
    set('gallery', next)
  }

  const handleGalleryThumbnail = (idx: number) => {
    set('gallery', form.gallery.map((g, i) => ({ ...g, is_thumbnail: i === idx })))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const formData = new FormData()

      // ── Basic Info ──
      formData.append("name", form.name)
      formData.append("professional_title", form.professional_title)
      formData.append("email", form.email)
      formData.append("phone", form.phone)
      formData.append("bio", form.bio)
      formData.append("custom_handle", form.custom_handle)
      if (form.website) formData.append("website", form.website)

      // ── Social Media ──
      formData.append("social_media", JSON.stringify(form.social_media))

      // ── Booking ──
      formData.append("preferred_booking_method", form.preferred_booking_method)
      if (form.booking_link) {
        formData.append("booking_link", form.booking_link)
      }

      // ── Specialty ──
      formData.append("primary_specialty", form.primary_specialty)
      formData.append("specialties", JSON.stringify(form.specialties))

      // ── Location ──
      formData.append("locations", JSON.stringify(form.locations))

      // ── Business Hours ──
      formData.append("business_hours", JSON.stringify(form.business_hours))

      // ── Profile Image ──
      if (form.profilePhoto) {
        formData.append("profilePhoto", form.profilePhoto)
      }

      // ── Gallery Images ──
      form.gallery.forEach((item, index) => {
        formData.append(`gallery_images`, item.file)
      })

      // ── Gallery Meta (captions, thumbnail, order) ──
      formData.append(
        "gallery_meta",
        JSON.stringify(
          form.gallery.map((g) => ({
            caption: g.caption,
            is_thumbnail: g.is_thumbnail,
            sort_order: g.sort_order,
          }))
        )
      )

      // ── Promotion ──
      formData.append("offer_promotion", String(form.offer_promotion))
      formData.append("promotion_details", form.promotion_details)

      // ── Elite Setup ──
      formData.append("elite_setup", String(form.elite_setup))

      // ── Glamlink Questions ──
      formData.append(
        "excites_about_glamlink",
        JSON.stringify(form.excites_about_glamlink)
      )
      formData.append(
        "biggest_pain_points",
        JSON.stringify(form.biggest_pain_points)
      )

      // ── Access Card ──
      formData.append("createAccessCard", String(form.createAccessCard))

      // ── API CALL ──
      const res = await fetch(
        "https://node.glamlink.net:5000/api/v1/businessCard",
        {
          method: "POST",
          body: formData, // ✅ DO NOT set Content-Type
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong")
      }

      console.log("SUCCESS:", data)

      // success modal
      setSubmitted(true)

    } catch (err: any) {
      console.error(err)
      alert(err.message || "Submission failed")
    }
  }
// ✅ UPDATE LOCATION
const updateLocation = (
  index: number,
  updatedFields: Partial<Location>
) => {
  setForm((prev) => {
    let updatedLocations = prev.locations.map((loc, i) =>
      i === index ? { ...loc, ...updatedFields } : loc
    )

    if (updatedFields.is_primary) {
      updatedLocations = updatedLocations.map((loc, i) => ({
        ...loc,
        is_primary: i === index,
      }))
    }

    return { ...prev, locations: updatedLocations }
  })
}

// ✅ ADD LOCATION
// ✅ ADD LOCATION
const addLocation = () => {
  setForm((prev) => {
    const newIndex = prev.locations.length

    return {
      ...prev,
      locations: [
        ...prev.locations,
        {
          label: '',
          location_type:
            newIndex === 0 ? 'exact_address' : 'service_area', // ✅ FIXED
          address: '',
          city: '',
          state: '',
          business_name: '',
          phone: '',
          description: '',
          is_primary: newIndex === 0,
          sort_order: newIndex + 1,
        },
      ],
    }
  })
}

// ✅ REMOVE LOCATION
const removeLocation = (index: number) => {
  setForm((prev) => {
    if (prev.locations.length === 1) return prev // ✅ prevent delete last

    const updated = prev.locations.filter((_, i) => i !== index)

    return {
      ...prev,
      locations: updated.map((loc, i) => ({
        ...loc,
        sort_order: i + 1,
        is_primary: i === 0,
      })),
    }
  })
}
  return (
    <div className="bg-[#F7FAFB] min-h-screen font-nunito text-[#1A3A42]">

      {/* HEADER */}
      <header className="bg-white border-b-2 border-[#D6F2F8] h-[62px] flex items-center justify-between px-12 sticky top-0 z-40 shadow-[0_2px_12px_rgba(59,189,212,0.08)]">
        <span className="font-poppins text-2xl font-semibold text-[#3BBDD4] tracking-tight">glamlink</span>
        <nav className="text-xs text-[#7AAAB8]">
          <a href="#" className="text-[#3BBDD4] font-bold hover:text-[#2A9BB5] transition-colors">Directory</a>{' › '}Apply
        </nav>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#3BBDD4] via-[#2A9BB5] to-[#1E7A90] py-[68px] px-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_600px_at_20%_50%,rgba(255,255,255,0.07)_0%,transparent_60%)]" />
        <div className="absolute bottom-[-2px] left-0 right-0 h-12 bg-[#F7FAFB] [clip-path:ellipse(56%_100%_at_50%_100%)]" />
        <div className="inline-flex items-center gap-2 bg-white/20 border border-white/35 backdrop-blur-sm rounded-full px-5 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase text-white mb-5 relative">
          ✦ &nbsp;Professional Directory Application
        </div>
        <h1 className="font-poppins text-[clamp(28px,5vw,50px)] font-semibold text-white leading-[1.2] mb-3.5 relative">
          Get Listed on GlamLink<br /><span className="text-white/75 font-light">Beauty & Wellness Directory</span>
        </h1>
        <p className="text-[15px] text-white/80 max-w-[520px] mx-auto mb-8 leading-[1.75] font-light relative">
          Join thousands of beauty professionals. Get discovered by clients, appear on the treatment map, and receive your free Access digital business card — all in one application.
        </p>
        <div className="flex justify-center flex-wrap gap-2.5 relative">
          {HERO_BADGES.map((b) => (
            <div key={b.label} className="bg-white/16 border border-white/32 rounded-full px-4 py-1.5 text-xs font-bold text-white flex items-center gap-1.5">
              {b.icon} {b.label}
            </div>
          ))}
        </div>
      </section>

      <main className="max-w-[840px] mx-auto px-5 pt-9 pb-20">

        {/* Process Bar */}
        <div className="bg-white border border-[#DCF0F6] rounded-2xl px-7 py-5 flex items-center justify-center flex-wrap gap-0 mb-8">
          {PROCESS_STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-1.5 px-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EEF9FC] border-2 border-[#D6F2F8] text-[#3BBDD4] font-bold text-[13px] flex items-center justify-center">{i + 1}</div>
                <span className="text-[10px] font-bold uppercase tracking-[0.07em] text-[#7AAAB8] text-center max-w-[70px] leading-tight">{step}</span>
              </div>
              {i < PROCESS_STEPS.length - 1 && <span className="text-[#D6F2F8] text-xl mb-5 px-1 hidden sm:block">›</span>}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* 1. PROFILE */}
          <SectionCard step={1} title="Your Profile">
            <div className="grid grid-cols-2 gap-[18px]">
              <FormField label="Full Name" required>
                <Input placeholder="Kate Sue" value={form.name} onChange={(e) => set('name', e.target.value)} required />
              </FormField>
              <FormField label="Professional Title" required>
                <Input placeholder="Makeup Artist" value={form.professional_title} onChange={(e) => set('professional_title', e.target.value)} required />
              </FormField>
              <FormField label="Email" required>
                <Input type="email" placeholder="kate@example.com" value={form.email} onChange={(e) => set('email', e.target.value)} required />
              </FormField>
              <FormField label="Phone">
                <Input type="tel" placeholder="(702) 677-4576" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              </FormField>
              <FormField label="Custom Handle" hint="Your public URL: glamlink.net/pro/@handle">
                <Input placeholder="@katesue_bee" value={form.custom_handle} onChange={(e) => set('custom_handle', e.target.value)} />
              </FormField>
              <FormField label="Website (optional)">
                <Input type="url" placeholder="https://yoursite.com" value={form.website} onChange={(e) => set('website', e.target.value)} />
              </FormField>
              <FormField label="Professional Bio" required hint="Appears on your public listing and Access card. 2–4 sentences recommended." className="col-span-2">
                <TextArea
                  placeholder={"Makeup Artist | Bridal • Editorial • Events\n\nAvailable For Travel\n\nSend DM On IG @makeupbyadison"}
                  value={form.bio}
                  onChange={(e) => set('bio', e.target.value)}
                  required
                />
              </FormField>
            </div>
          </SectionCard>

          {/* 2. SOCIAL & BOOKING */}
          <SectionCard step={2} title="Social Media & Booking">
            <div className="grid grid-cols-2 gap-[18px]">
              <FormField label="Instagram URL">
                <Input placeholder="https://www.instagram.com/makeupbyadison" value={form.social_media.instagram ?? ''} onChange={(e) => setSocial('instagram', e.target.value)} />
              </FormField>
              <FormField label="TikTok URL">
                <Input placeholder="https://tiktok.com/@makeupbyadison" value={form.social_media.tiktok ?? ''} onChange={(e) => setSocial('tiktok', e.target.value)} />
              </FormField>
              <FormField label="Preferred Booking Method">
                <Select
                  value={form.preferred_booking_method}
                  onChange={(e) => {
                    set('preferred_booking_method', e.target.value as BookingMethod)
                    if (e.target.value !== 'Go to Booking Link') set('booking_link', '')
                  }}
                  options={[
                    { value: '', label: 'Select…' },
                    { value: 'Go to Booking Link', label: 'Go to Booking Link' },
                    { value: 'Call / text', label: 'Call / text' },
                    { value: 'DM on Instagram', label: 'DM on_Instagram' },
                   
                  ]}
                />
              </FormField>
              {/* Conditional booking link — only shown when "Go to Booking Link" selected */}
              {form.preferred_booking_method === 'Go to Booking Link' && (
                <FormField label="Booking Link" required hint="e.g. https://qrco.de/bfw5e3">
                  <Input
                    type="url"
                    placeholder="https://qrco.de/bfw5e3"
                    value={form.booking_link}
                    onChange={(e) => set('booking_link', e.target.value)}
                    required
                  />
                </FormField>
              )}
            </div>
          </SectionCard>

          {/* 3. SPECIALTY — loaded from API */}
          {/* 3. SPECIALTY */}
          <SectionCard step={3} title="Specialty / Profession" subtitle="— select up to 5">

            {/* Primary Specialty → INPUT */}
            <FormField label="Primary Specialty" className="mb-5">
              <Input
                placeholder="e.g. Makeup Artist"
                value={form.primary_specialty}
                onChange={(e) => set('primary_specialty', e.target.value)}
              />
            </FormField>

            {/* Additional Specialties → DROPDOWN MULTI SELECT */}
            <FormField label="Additional Specialties">
              <div className="relative">
                <select
                  className="w-full border border-[#DCF0F6] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3BBDD4]"
                  onChange={(e) => {
                    const value = e.target.value
                    if (!value) return

                    if (form.specialties.includes(value)) return

                    if (form.specialties.length >= 5) return

                    set('specialties', [...form.specialties, value])
                  }}
                >
                  <option value="">Select specialty...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </FormField>

            {/* Selected Items */}
            <div className="flex flex-wrap gap-2 mt-3">
              {form.specialties.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-[#EEF9FC] border border-[#3BBDD4] text-[#1A3A42] text-xs font-semibold px-3 py-1.5 rounded-full"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        'specialties',
                        form.specialties.filter((s) => s !== item)
                      )
                    }
                    className="text-[#F4928A] font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Counter */}
            <div className="flex justify-between mt-2">
              <span className="text-[11px] text-[#7AAAB8]">
                {form.specialties.length}/5 selected
              </span>
              {form.specialties.length >= 5 && (
                <span className="text-[11px] text-[#3BBDD4] font-semibold">
                  Maximum reached
                </span>
              )}
            </div>

          </SectionCard>

          {/* 4. LOCATION */}
         {/* 4. LOCATIONS */}
{/* 4. LOCATIONS */}
<SectionCard step={4} title="Business Locations">
  <div className="space-y-5">

    {form.locations.map((loc, index) => (
      <div key={index} className="border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] p-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm text-[#1A3A42]">
              {loc.label || `Location ${index + 1}`}
            </p>

            {loc.is_primary && (
              <span className="bg-[#FDE68A] text-[10px] px-2 py-0.5 rounded-full font-semibold">
                Primary
              </span>
            )}
          </div>

          <div className="flex gap-3 text-xs">
            {!loc.is_primary && (
              <button
                type="button"
                onClick={() => updateLocation(index, { is_primary: true })}
                className="text-[#F59E0B] font-medium"
              >
                Make primary
              </button>
            )}

            {form.locations.length > 1 && (
              <button
                type="button"
                onClick={() => removeLocation(index)}
                className="text-[#EF4444]"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* LOCATION TYPE */}
        <div className="mb-4">
          <p className="text-xs font-medium mb-2">Location Type</p>

          <div className="flex gap-6 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={loc.location_type === "exact_address"}
                onChange={() =>
                  updateLocation(index, { location_type: "exact_address" })
                }
              />
              Exact Address
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={loc.location_type === "service_area"}
                onChange={() =>
                  updateLocation(index, { location_type: "service_area" })
                }
              />
              City / Area Only
            </label>
          </div>
        </div>

        {/* DISPLAY LABEL */}
        <FormField label="Display Label">
          <Input
            placeholder="e.g. Luxe Beauty Studio - Las Vegas"
            value={loc.label}
            onChange={(e) =>
              updateLocation(index, { label: e.target.value })
            }
          />
        </FormField>

        {/* ADDRESS (ONLY IF EXACT) */}
        {loc.location_type === "exact_address" && (
          <FormField label="Address" className="mt-3">
            <div className="flex gap-2">
              <Input
                value={loc.address}
                onChange={(e) =>
                  updateLocation(index, { address: e.target.value })
                }
              />
              <button
                type="button"
                className="bg-[#374151] text-white px-4 rounded-md text-sm"
              >
                Confirm
              </button>
            </div>
          </FormField>
        )}

        {/* CITY + STATE (ONLY IF CITY ONLY) */}
        {loc.location_type === "service_area" && (
          <div className="grid grid-cols-2 gap-4 mt-3">
            <FormField label="City">
              <Input
                value={loc.city}
                onChange={(e) =>
                  updateLocation(index, { city: e.target.value })
                }
              />
            </FormField>

            <FormField label="State">
              <Input
                value={loc.state}
                onChange={(e) =>
                  updateLocation(index, { state: e.target.value })
                }
              />
            </FormField>
          </div>
        )}

        {/* BUSINESS NAME + PHONE */}
        <div className="grid grid-cols-2 gap-4 mt-3">
          <FormField label="Business Name (optional)">
            <Input
              value={loc.business_name}
              onChange={(e) =>
                updateLocation(index, { business_name: e.target.value })
              }
            />
          </FormField>

          <FormField label="Phone (optional)">
            <Input
              value={loc.phone}
              onChange={(e) =>
                updateLocation(index, { phone: e.target.value })
              }
            />
          </FormField>
        </div>

        {/* NOTES */}
        <FormField label="Notes / Description (optional)" className="mt-3">
          <TextArea
            value={loc.description}
            onChange={(e) =>
              updateLocation(index, { description: e.target.value })
            }
          />
        </FormField>

      </div>
    ))}

    {/* ADD LOCATION */}
    <button
      type="button"
      onClick={addLocation}
      className="w-full border-dashed border border-[#B4DCE9] py-3 rounded-xl text-sm text-[#3BBDD4] font-semibold hover:bg-[#EEF9FC]"
    >
      + Add Another Location
    </button>

  </div>
</SectionCard>
          {/* 5. BUSINESS HOURS */}
       <SectionCard step={5} title="Business Hours">
  <p className="text-[13px] text-[#4A7A88] mb-4 leading-relaxed">
    Select all notes that apply to your availability.
  </p>

  {/* ✅ Manual Input */}
  <div className="flex gap-2 mb-4">
    <input
      id="business-note-input"
      type="text"
      placeholder="Enter business note..."
      className="flex-1 border border-[#DCF0F6] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#3BBDD4]"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          const value = (e.target as HTMLInputElement).value.trim()
          if (!value) return

          if (form.business_hours.some((h) => h.note === value)) return

          set("business_hours", [...form.business_hours, { note: value }])
          ;(e.target as HTMLInputElement).value = ""
        }
      }}
    />

    <button
      type="button"
      onClick={() => {
        const input = document.getElementById(
          "business-note-input"
        ) as HTMLInputElement
        const value = input?.value.trim()
        if (!value) return

        if (form.business_hours.some((h) => h.note === value)) return

        set("business_hours", [...form.business_hours, { note: value }])
        input.value = ""
      }}
      className="bg-[#3BBDD4] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#2A9BB5]"
    >
      Add
    </button>
  </div>

  {/* ✅ Selected Notes */}
  {form.business_hours.length > 0 && (
    <div className="flex flex-wrap gap-2 mb-4">
      {form.business_hours.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-2 bg-[#EEF9FC] border border-[#3BBDD4] text-[#1A3A42] text-xs font-semibold px-3 py-1.5 rounded-full"
        >
          {item.note}
          <button
            type="button"
            onClick={() =>
              set(
                "business_hours",
                form.business_hours.filter((h) => h.note !== item.note)
              )
            }
            className="text-[#F4928A] font-bold"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )}

 
</SectionCard>

          {/* 6. MEDIA & PROFILE */}
          <SectionCard step={6} title="Media & Profile">
            <MediaSection
              profilePhotoPreview={form.profilePhotoPreview}
              gallery={form.gallery}
              onProfileChange={(file, preview) => setForm((prev) => ({ ...prev, profilePhoto: file, profilePhotoPreview: preview }))}
              onGalleryAdd={handleGalleryAdd}
              onGalleryRemove={handleGalleryRemove}
              onGalleryCaption={handleGalleryCaption}
              onGalleryThumbnail={handleGalleryThumbnail}
            />
          </SectionCard>

          {/* ACCESS CARD */}
          <AccessCardToggle enabled={form.createAccessCard} onChange={(v) => set('createAccessCard', v)} />

          {/* 7. GLAMLINK INTEGRATION */}
          <SectionCard step={7} title="Glamlink Integration">
            <p className="text-[13px] text-[#4A7A88] mb-6 leading-relaxed">
              Help us understand your needs and how we can best support your business.
            </p>

            {/* Excites */}
            <div className="mb-6">
              <p className="text-sm font-bold text-[#1A3A42] mb-1">
                What excites you about Glamlink? <span className="text-[#F4928A]">*</span>
                <span className="text-[#7AAAB8] font-normal text-xs ml-1">(Select at least 1)</span>
              </p>
              <MultiSelect
                options={EXCITES_OPTIONS}
                selected={form.excites_about_glamlink}
                onChange={(v) => set('excites_about_glamlink', v)}
                minLabel="Minimum 1 selection required"
              />
            </div>

            {/* Pain points */}
            <div className="mb-6">
              <p className="text-sm font-bold text-[#1A3A42] mb-1">
                Biggest pain points <span className="text-[#F4928A]">*</span>
                <span className="text-[#7AAAB8] font-normal text-xs ml-1">(Select at least 1)</span>
              </p>
              <MultiSelect
                options={PAIN_POINTS_OPTIONS}
                selected={form.biggest_pain_points}
                onChange={(v) => set('biggest_pain_points', v)}
                minLabel="Minimum 1 selection required"
              />
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-[#DCF0F6]">

              {/* Promotion toggle */}
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => set('offer_promotion', !form.offer_promotion)}>
                <Toggle enabled={form.offer_promotion} onChange={(v) => set('offer_promotion', v)} />
                <span className="text-sm font-semibold text-[#1A3A42]">
                  I would like to offer a promotion with my digital card
                </span>
              </div>
              {form.offer_promotion && (
                <FormField label="Promotion Details" hint="e.g. 20% off Balayage for first-time clients">
                  <Input
                    placeholder="20% off on Balayage for first-time clients"
                    value={form.promotion_details}
                    onChange={(e) => set('promotion_details', e.target.value)}
                  />
                </FormField>
              )}

              {/* Elite setup */}
              <div
                className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border-[1.5px] border-[#DCF0F6] hover:border-[#A8E0EE] transition-colors bg-[#F7FAFB]"
                onClick={() => set('elite_setup', !form.elite_setup)}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-[5px] border-[1.5px] flex items-center justify-center shrink-0 transition-all ${form.elite_setup ? 'bg-[#3BBDD4] border-[#3BBDD4]' : 'bg-white border-[#B4DCE9]'}`}>
                  {form.elite_setup && <CheckIcon />}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1A3A42]">
                    The Elite Setup{' '}
                    <span className="text-[11px] text-[#3BBDD4] font-semibold">(Recommended)</span>
                  </p>
                  <p className="text-xs text-[#7AAAB8] mt-1 leading-relaxed">
                    I agree to let the Glamlink Concierge Team build my professional profile and digital business card using my existing public social media content. We'll curate your first clips, photo albums, and service menu so you can launch instantly.
                  </p>
                </div>
              </div>

            </div>
          </SectionCard>

          {/* SUBMIT */}
          <div className="text-center pt-2">
            <button
              type="submit"
              className="bg-gradient-to-br from-[#3BBDD4] to-[#2A9BB5] hover:from-[#2A9BB5] hover:to-[#1E7A90] text-white border-none rounded-full px-16 py-[17px] font-poppins text-[15px] font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-[0_6px_22px_rgba(59,189,212,0.38)] hover:-translate-y-0.5 hover:shadow-[0_10px_34px_rgba(59,189,212,0.46)]"
            >
              Submit My Application →
            </button>
            <p className="text-xs text-[#7AAAB8] mt-3.5 leading-[1.7]">
              By submitting you agree to GlamLink's{' '}
              <a href="#" className="text-[#3BBDD4] font-bold hover:underline">Terms of Service</a>{' '}and{' '}
              <a href="#" className="text-[#3BBDD4] font-bold hover:underline">Directory Guidelines</a>.
              <br />Applications are reviewed within 2–3 business days. Confirmation email sent immediately.
            </p>
          </div>

        </form>
      </main>

      <SuccessModal open={submitted} onClose={() => setSubmitted(false)} accessCard={form.createAccessCard} />
    </div>
  )
}