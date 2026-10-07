'use client'
import React, { useState, useEffect, useRef } from 'react'
import {
  AlertCircle, Check, CreditCard, ImagePlus, Loader2, Mail, Map as MapIcon, MapPin, Plus, QrCode, UserRound, X,
} from 'lucide-react'
import { FormField, Input, TextArea, Select } from './Formfield'
import { AccessCardToggle } from './Accesscardtoggle'
import { SuccessModal } from './Successmodal'
import { SectionCard } from './Sectioncard'
import { Switch } from './Switch'
import { getAllCategories } from '@/api/Api'

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
  { icon: MapIcon, label: 'Found on the treatment map' },
  { icon: CreditCard, label: 'Free digital card' },
  { icon: QrCode, label: 'QR code in articles' },
  { icon: Mail, label: 'Email marketing ready' },
]

const PROCESS_STEPS = ['Submit form', 'Admin reviews', 'Approved & live', 'Map + card + articles', 'Email campaigns']

const BOOKING_METHOD_OPTIONS = [
  { value: 'Go to Booking Link', label: 'Go to Website' },
  { value: 'Call / text', label: 'Call / text' },
  { value: 'DM on Instagram', label: 'DM on Instagram' },
]

const LOCATION_TYPE_OPTIONS = [
  { value: 'exact_address' as const, label: 'Exact address', icon: MapPin },
  { value: 'service_area' as const, label: 'City / area only', icon: MapIcon },
]

const SECTIONS = [
  { id: 'about', title: 'About You', short: 'About You' },
  { id: 'professional', title: 'Professional Information', short: 'Professional' },
  { id: 'booking', title: 'Booking & Social', short: 'Booking' },
  { id: 'locations', title: 'Locations & Hours', short: 'Locations' },
  { id: 'profile', title: 'Directory Profile', short: 'Profile' },
  { id: 'final', title: 'Final Details', short: 'Final Details' },
]

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

// ── Validation (fields the form marks as required) ────────

type FieldErrors = Partial<Record<keyof FormData, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Listed in page order so the first error is the one nearest the top.
function validate(f: FormData): FieldErrors {
  const e: FieldErrors = {}
  if (!f.name.trim()) e.name = 'Please enter your full name.'
  if (!f.professional_title.trim()) e.professional_title = 'Please enter your professional title.'
  if (!f.email.trim()) e.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(f.email.trim())) e.email = 'Please enter a valid email address.'
  if (f.preferred_booking_method === 'Go to Booking Link' && !f.booking_link.trim()) {
    e.booking_link = 'Please add your booking link.'
  }
  if (!f.bio.trim()) e.bio = 'Please add a short professional bio.'
  if (f.excites_about_glamlink.length === 0) e.excites_about_glamlink = 'Select at least one option.'
  if (f.biggest_pain_points.length === 0) e.biggest_pain_points = 'Select at least one option.'
  return e
}

const SECTION_FIELDS: Record<string, (keyof FormData)[]> = {
  about: ['name', 'professional_title', 'email'],
  booking: ['booking_link'],
  profile: ['bio'],
  final: ['excites_about_glamlink', 'biggest_pain_points'],
}

const fieldId = (key: string) => `dir-${key}`

// ── Reusable UI ───────────────────────────────────────────

const chipClass = (active: boolean) =>
  `inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 py-2 text-left text-sm transition-colors outline-none focus-visible:ring-4 focus-visible:ring-primary/15
  ${active
    ? 'border-primary bg-primary/[0.07] font-medium text-foreground'
    : 'border-input bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'}`

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${checked ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background'}`}
      aria-hidden="true"
    >
      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
    </span>
  )
}

function MultiSelect({
  id, options, selected, onChange, invalid,
}: {
  id: string
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
  invalid?: boolean
}) {
  const toggle = (val: string) =>
    onChange(selected.includes(val) ? selected.filter((x) => x !== val) : [...selected, val])

  return (
    <div
      id={id}
      tabIndex={-1}
      role="group"
      aria-describedby={invalid ? `${id}-error` : undefined}
      className="grid grid-cols-1 gap-2 outline-none sm:grid-cols-2"
    >
      {options.map((opt) => {
        const active = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(opt)}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm leading-snug transition-colors outline-none focus-visible:ring-4 focus-visible:ring-primary/15
              ${active
                ? 'border-primary bg-primary/[0.05] text-foreground'
                : `${invalid ? 'border-red-300' : 'border-input'} bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground`}`}
          >
            <span className="mt-px"><CheckBox checked={active} /></span>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

// ── Business Hours ────────────────────────────────────────

function BusinessHoursSection({ hours, onChange }: { hours: BusinessHourNote[]; onChange: (h: BusinessHourNote[]) => void }) {
  const [draft, setDraft] = useState('')
  const custom = hours.filter((h) => !BUSINESS_HOUR_PRESETS.some((p) => p.note === h.note))

  const toggle = (note: string) => {
    const exists = hours.some((h) => h.note === note)
    onChange(exists ? hours.filter((h) => h.note !== note) : [...hours, { note }])
  }

  const addDraft = () => {
    const value = draft.trim()
    if (!value) return
    if (!hours.some((h) => h.note === value)) onChange([...hours, { note: value }])
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {BUSINESS_HOUR_PRESETS.map((preset) => {
          const active = hours.some((h) => h.note === preset.note)
          return (
            <button key={preset.note} type="button" aria-pressed={active} onClick={() => toggle(preset.note)} className={chipClass(active)}>
              <CheckBox checked={active} />
              {preset.note}
            </button>
          )
        })}
        {custom.map((item) => (
          <span key={item.note} className={chipClass(true)}>
            {item.note}
            <button
              type="button"
              onClick={() => toggle(item.note)}
              aria-label={`Remove “${item.note}”`}
              className="-mr-1 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-500"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          id={fieldId('business-note')}
          aria-label="Add your own availability note"
          placeholder="Add your own note, e.g. Sundays by request"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addDraft()
            }
          }}
        />
        <button type="button" onClick={addDraft} className="btn-outline h-12 shrink-0 rounded-xl px-5 py-0">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add
        </button>
      </div>
    </div>
  )
}

// ── Media & Profile ───────────────────────────────────────

function ProfilePhotoField({
  preview, onChange, onRemove,
}: {
  preview: string
  onChange: (file: File, preview: string) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={`flex flex-col items-center gap-5 rounded-xl border p-5 text-center sm:flex-row sm:text-left ${preview ? 'border-input' : 'border-dashed border-input bg-muted/30'}`}>
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-background">
        {preview
          ? <img src={preview} alt="Profile preview" className="h-full w-full object-cover" />
          : <UserRound className="h-9 w-9 text-muted-foreground/60" aria-hidden="true" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{preview ? 'Profile photo added' : 'Upload a profile photo'}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Square image works best — face centered, clean background. JPG or PNG recommended.
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
          <button type="button" onClick={() => inputRef.current?.click()} className="btn-outline h-10 rounded-xl px-4 py-0">
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            {preview ? 'Replace' : 'Choose image'}
          </button>
          {preview && (
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onChange(f, URL.createObjectURL(f))
          e.target.value = ''
        }}
      />
    </div>
  )
}

function GalleryField({
  gallery, onAdd, onRemove, onCaption, onThumbnail,
}: {
  gallery: GalleryItem[]
  onAdd: (files: FileList) => void
  onRemove: (i: number) => void
  onCaption: (i: number, caption: string) => void
  onThumbnail: (i: number) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const canAdd = gallery.length < 5

  const addTile = (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-input bg-muted/30 px-4 py-6 text-center transition-colors hover:border-primary/50 hover:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
    >
      <ImagePlus className="h-6 w-6 text-primary" aria-hidden="true" />
      <span className="text-sm font-semibold text-foreground">Add gallery photos</span>
      <span className="text-xs text-muted-foreground">{5 - gallery.length} of 5 remaining · JPG or PNG</span>
    </button>
  )

  return (
    <div>
      {gallery.length === 0 ? addTile : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {gallery.map((item, i) => (
            <div key={item.preview_url} className="flex flex-col overflow-hidden rounded-xl border bg-background">
              <div className="relative aspect-square bg-muted">
                <img src={item.preview_url} alt={item.caption || `Gallery photo ${i + 1}`} className="h-full w-full object-cover" />
                {item.is_thumbnail && (
                  <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                    Thumbnail
                  </span>
                )}
              </div>
              <input
                type="text"
                value={item.caption}
                onChange={(e) => onCaption(i, e.target.value)}
                placeholder="Add caption…"
                aria-label={`Caption for photo ${i + 1}`}
                className="w-full border-t bg-transparent px-3 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground/70 focus:bg-primary/[0.03] sm:text-xs"
              />
              <div className="mt-auto flex items-center gap-2 border-t px-3 py-2">
                {!item.is_thumbnail && (
                  <button type="button" onClick={() => onThumbnail(i)} className="text-xs font-semibold text-primary hover:underline">
                    Make thumbnail
                  </button>
                )}
                <button type="button" onClick={() => onRemove(i)} className="ml-auto text-xs font-semibold text-red-500 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))}
          {canAdd && <div className="flex [&>button]:h-full">{addTile}</div>}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) onAdd(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────

export default function DirectoryFormApply() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  // Errors appear after the first submit attempt, then update live as fields are fixed.
  const [attempted, setAttempted] = useState(false)

  const errors = attempted ? validate(form) : {}
  const hasErrors = Object.keys(errors).length > 0

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();

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

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const setSocial = (key: keyof SocialMedia, value: string) =>
    setForm((prev) => ({ ...prev, social_media: { ...prev.social_media, [key]: value } }))

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
    if (submitting) return

    setAttempted(true)
    setSubmitError('')
    const firstError = Object.keys(validate(form))[0]
    if (firstError) {
      const el = document.getElementById(fieldId(firstError))
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.focus({ preventScroll: true })
      return
    }

    setSubmitting(true)
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
      setSubmitError(err.message || "Submission failed")
    } finally {
      setSubmitting(false)
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
const addLocation = () => {
  setForm((prev) => {
    const newIndex = prev.locations.length

    return {
      ...prev,
      locations: [
        ...prev?.locations,
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

  const maxSpecialties = form.specialties.length >= 5

  return (
    <div className="min-h-screen bg-muted/40 text-foreground">

      {/* INTRO */}
      <header className="container-glamlink pb-10 pt-28 text-center md:pb-12 md:pt-32">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Glamlink Directory</p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
          Join the Glamlink Directory
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          Beauty + wellness professionals and businesses can apply to be listed on Glamlink — get
          discovered by clients nearby and receive a free Access digital business card.
        </p>
        <ul className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-x-5 gap-y-2.5 text-sm text-muted-foreground">
          {HERO_BADGES.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-1.5">
              <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </header>

      <div className="mx-auto max-w-[880px] px-4 pb-20 sm:px-6">
        <form onSubmit={handleSubmit} noValidate className="overflow-hidden rounded-2xl border bg-card shadow-soft">

          {/* SECTION INDEX */}
          <nav aria-label="Application sections" className="border-b bg-muted/30">
            <ol className="flex gap-1 overflow-x-auto px-3 py-2.5 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
              {SECTIONS.map((s, i) => {
                const sectionHasError = SECTION_FIELDS[s.id]?.some((k) => errors[k])
                return (
                  <li key={s.id} className="shrink-0">
                    <a
                      href={`#${s.id}`}
                      className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    >
                      <span className="text-xs font-semibold tabular-nums text-primary">{String(i + 1).padStart(2, '0')}</span>
                      {s.short}
                      {sectionHasError && (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden="true" />
                          <span className="sr-only">(needs attention)</span>
                        </>
                      )}
                    </a>
                  </li>
                )
              })}
            </ol>
          </nav>

          {/* 1. ABOUT YOU */}
          <SectionCard id="about" step={1} title="About You" description="The basics clients will see on your listing.">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Full Name" htmlFor={fieldId('name')} required error={errors.name}>
                <Input id={fieldId('name')} autoComplete="name" placeholder="Kate Sue" value={form.name} invalid={!!errors.name} onChange={(e) => set('name', e.target.value)} />
              </FormField>
              <FormField label="Professional Title" htmlFor={fieldId('professional_title')} required error={errors.professional_title}>
                <Input id={fieldId('professional_title')} autoComplete="organization-title" placeholder="Makeup Artist" value={form.professional_title} invalid={!!errors.professional_title} onChange={(e) => set('professional_title', e.target.value)} />
              </FormField>
              <FormField label="Email" htmlFor={fieldId('email')} required error={errors.email}>
                <Input id={fieldId('email')} type="email" autoComplete="email" inputMode="email" placeholder="kate@example.com" value={form.email} invalid={!!errors.email} onChange={(e) => set('email', e.target.value)} />
              </FormField>
              <FormField label="Phone" htmlFor={fieldId('phone')}>
                <Input id={fieldId('phone')} type="tel" autoComplete="tel" placeholder="(702) 677-4576" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              </FormField>
              <FormField label="Custom Handle" htmlFor={fieldId('custom_handle')} hint="Your public URL: glamlink.net/pro/@handle">
                <Input id={fieldId('custom_handle')} placeholder="@katesue_bee" value={form.custom_handle} onChange={(e) => set('custom_handle', e.target.value)} />
              </FormField>
              <FormField label="Website" htmlFor={fieldId('website')} hint="Optional">
                <Input id={fieldId('website')} type="url" inputMode="url" placeholder="https://yoursite.com" value={form.website} onChange={(e) => set('website', e.target.value)} />
              </FormField>
            </div>
          </SectionCard>

          {/* 2. PROFESSIONAL INFORMATION */}
          <SectionCard id="professional" step={2} title="Professional Information" description="Tell clients what you specialize in. Add up to 5 specialties.">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Primary Specialty" htmlFor={fieldId('primary_specialty')}>
                <Input id={fieldId('primary_specialty')} placeholder="e.g. Makeup Artist" value={form.primary_specialty} onChange={(e) => set('primary_specialty', e.target.value)} />
              </FormField>

              <FormField
                label="Additional Specialties"
                htmlFor={fieldId('specialties')}
                hint={maxSpecialties ? 'Maximum reached — remove one to add another.' : `${form.specialties.length}/5 selected`}
              >
                <Select
                  id={fieldId('specialties')}
                  value=""
                  disabled={categoriesLoading || maxSpecialties}
                  placeholder={categoriesLoading ? 'Loading specialties…' : maxSpecialties ? 'Maximum of 5 selected' : 'Select a specialty…'}
                  options={categories.map((c) => ({ value: c.title, label: c.title, disabled: form.specialties.includes(c.title) }))}
                  onValueChange={(value) => {
                    if (!value || form.specialties.includes(value) || form.specialties.length >= 5) return
                    set('specialties', [...form.specialties, value])
                  }}
                />
              </FormField>

              {form.specialties.length > 0 && (
                <ul className="flex flex-wrap gap-2 sm:col-span-2" aria-label="Selected specialties">
                  {form.specialties.map((item) => (
                    <li key={item} className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/[0.07] py-1 pl-3.5 pr-1 text-sm font-medium text-foreground">
                      {item}
                      <button
                        type="button"
                        onClick={() => set('specialties', form.specialties.filter((s) => s !== item))}
                        aria-label={`Remove ${item}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </SectionCard>

          {/* 3. BOOKING & SOCIAL */}
          <SectionCard id="booking" step={3} title="Booking & Social" description="How clients find your work and book with you.">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Instagram URL" htmlFor={fieldId('instagram')}>
                <Input id={fieldId('instagram')} type="url" inputMode="url" placeholder="https://instagram.com/makeupbyadison" value={form.social_media.instagram ?? ''} onChange={(e) => setSocial('instagram', e.target.value)} />
              </FormField>
              <FormField label="TikTok URL" htmlFor={fieldId('tiktok')}>
                <Input id={fieldId('tiktok')} type="url" inputMode="url" placeholder="https://tiktok.com/@makeupbyadison" value={form.social_media.tiktok ?? ''} onChange={(e) => setSocial('tiktok', e.target.value)} />
              </FormField>
              <FormField label="Preferred Booking Method" htmlFor={fieldId('preferred_booking_method')}>
                <Select
                  id={fieldId('preferred_booking_method')}
                  value={form.preferred_booking_method}
                  placeholder="Select a booking method…"
                  options={BOOKING_METHOD_OPTIONS}
                  onValueChange={(value) => {
                    set('preferred_booking_method', value as BookingMethod)
                    if (value !== 'Go to Booking Link') set('booking_link', '')
                  }}
                />
              </FormField>
              {/* Conditional booking link — only shown when "Go to Booking Link" selected */}
              {form.preferred_booking_method === 'Go to Booking Link' && (
                <FormField label="Booking Link" htmlFor={fieldId('booking_link')} required error={errors.booking_link}>
                  <Input
                    id={fieldId('booking_link')}
                    type="url"
                    inputMode="url"
                    placeholder="https://qrco.de/bfw5e3"
                    value={form.booking_link}
                    invalid={!!errors.booking_link}
                    onChange={(e) => set('booking_link', e.target.value)}
                  />
                </FormField>
              )}
            </div>
          </SectionCard>

          {/* 4. LOCATIONS & HOURS */}
          <SectionCard id="locations" step={4} title="Locations & Hours" description="Where you work and when clients can book.">
            <div className="flex flex-col gap-4">
              {form.locations.map((loc, index) => (
                <div key={index} className="rounded-xl border bg-muted/30 p-4 sm:p-5">

                  {/* HEADER */}
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {loc.label || `Location ${index + 1}`}
                      </p>
                      {loc.is_primary && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {!loc.is_primary && (
                        <button
                          type="button"
                          onClick={() => updateLocation(index, { is_primary: true })}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                        >
                          Make primary
                        </button>
                      )}
                      {form.locations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLocation(index)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* LOCATION TYPE */}
                    <FormField label="Location Type" className="sm:col-span-2">
                      <div role="radiogroup" aria-label="Location type" className="grid grid-cols-2 gap-2">
                        {LOCATION_TYPE_OPTIONS.map(({ value, label, icon: Icon }) => {
                          const active = loc.location_type === value
                          return (
                            <label
                              key={value}
                              className={`flex min-h-12 cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/15
                                ${active ? 'border-primary bg-background font-semibold text-foreground' : 'border-input bg-background text-muted-foreground hover:border-primary/40'}`}
                            >
                              <input
                                type="radio"
                                name={`location-type-${index}`}
                                className="sr-only"
                                checked={active}
                                onChange={() => updateLocation(index, { location_type: value })}
                              />
                              <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-primary' : ''}`} aria-hidden="true" />
                              {label}
                            </label>
                          )
                        })}
                      </div>
                    </FormField>

                    {/* DISPLAY LABEL */}
                    <FormField label="Display Label" htmlFor={fieldId(`loc-${index}-label`)} className="sm:col-span-2">
                      <Input
                        id={fieldId(`loc-${index}-label`)}
                        placeholder="e.g. Luxe Beauty Studio - Las Vegas"
                        value={loc.label}
                        onChange={(e) => updateLocation(index, { label: e.target.value })}
                      />
                    </FormField>

                    {/* ADDRESS (ONLY IF EXACT) */}
                    {loc.location_type === "exact_address" && (
                      <FormField label="Address" htmlFor={fieldId(`loc-${index}-address`)} className="sm:col-span-2">
                        <div className="flex gap-2">
                          <Input
                            id={fieldId(`loc-${index}-address`)}
                            autoComplete="street-address"
                            placeholder="Street, city, state"
                            value={loc.address}
                            onChange={(e) => updateLocation(index, { address: e.target.value })}
                          />
                          <button type="button" className="btn-outline h-12 shrink-0 rounded-xl px-5 py-0">
                            Confirm
                          </button>
                        </div>
                      </FormField>
                    )}

                    {/* CITY + STATE (ONLY IF CITY ONLY) */}
                    {loc.location_type === "service_area" && (
                      <>
                        <FormField label="City" htmlFor={fieldId(`loc-${index}-city`)}>
                          <Input id={fieldId(`loc-${index}-city`)} value={loc.city} onChange={(e) => updateLocation(index, { city: e.target.value })} />
                        </FormField>
                        <FormField label="State" htmlFor={fieldId(`loc-${index}-state`)}>
                          <Input id={fieldId(`loc-${index}-state`)} value={loc.state} onChange={(e) => updateLocation(index, { state: e.target.value })} />
                        </FormField>
                      </>
                    )}

                    {/* BUSINESS NAME + PHONE */}
                    <FormField label="Business Name" htmlFor={fieldId(`loc-${index}-business`)} hint="Optional">
                      <Input id={fieldId(`loc-${index}-business`)} value={loc.business_name} onChange={(e) => updateLocation(index, { business_name: e.target.value })} />
                    </FormField>
                    <FormField label="Phone" htmlFor={fieldId(`loc-${index}-phone`)} hint="Optional">
                      <Input id={fieldId(`loc-${index}-phone`)} type="tel" value={loc.phone} onChange={(e) => updateLocation(index, { phone: e.target.value })} />
                    </FormField>

                    {/* NOTES */}
                    <FormField label="Notes / Description" htmlFor={fieldId(`loc-${index}-notes`)} hint="Optional" className="sm:col-span-2">
                      <TextArea
                        id={fieldId(`loc-${index}-notes`)}
                        rows={3}
                        value={loc.description}
                        onChange={(e) => updateLocation(index, { description: e.target.value })}
                      />
                    </FormField>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addLocation}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-input text-sm font-semibold text-primary transition-colors hover:border-primary/50 hover:bg-primary/[0.04]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add another location
              </button>
            </div>

            <div className="mt-8 border-t pt-8">
              <FormField label="Business Hours" hint="Select every note that applies to your availability, or add your own.">
                <div className="mt-1">
                  <BusinessHoursSection hours={form.business_hours} onChange={(h) => set('business_hours', h)} />
                </div>
              </FormField>
            </div>
          </SectionCard>

          {/* 5. DIRECTORY PROFILE */}
          <SectionCard id="profile" step={5} title="Directory Profile" description="Your photo, bio and gallery appear on your public listing and Access card.">
            <div className="flex flex-col gap-6">
              <FormField label="Profile Image">
                <ProfilePhotoField
                  preview={form.profilePhotoPreview}
                  onChange={(file, preview) => setForm((prev) => ({ ...prev, profilePhoto: file, profilePhotoPreview: preview }))}
                  onRemove={() => setForm((prev) => ({ ...prev, profilePhoto: null, profilePhotoPreview: '' }))}
                />
              </FormField>

              <FormField label="Professional Bio" htmlFor={fieldId('bio')} required error={errors.bio} hint="2–4 sentences recommended.">
                <TextArea
                  id={fieldId('bio')}
                  rows={6}
                  placeholder={"Makeup Artist | Bridal • Editorial • Events\n\nAvailable For Travel\n\nSend DM On IG @makeupbyadison"}
                  value={form.bio}
                  invalid={!!errors.bio}
                  onChange={(e) => set('bio', e.target.value)}
                />
              </FormField>

              <FormField label="Gallery" hint="Up to 5 photos. The thumbnail is shown first on your listing.">
                <GalleryField
                  gallery={form.gallery}
                  onAdd={handleGalleryAdd}
                  onRemove={handleGalleryRemove}
                  onCaption={handleGalleryCaption}
                  onThumbnail={handleGalleryThumbnail}
                />
              </FormField>
            </div>
          </SectionCard>

          {/* 6. FINAL DETAILS */}
          <SectionCard id="final" step={6} title="Final Details" description="Help us understand your needs and how we can best support your business.">
            <div className="flex flex-col gap-8">
              <AccessCardToggle enabled={form.createAccessCard} onChange={(v) => set('createAccessCard', v)} />

              <FormField label="What excites you about Glamlink?" errorId={`${fieldId('excites_about_glamlink')}-error`} required error={errors.excites_about_glamlink} hint="Select at least one.">
                <MultiSelect
                  id={fieldId('excites_about_glamlink')}
                  options={EXCITES_OPTIONS}
                  selected={form.excites_about_glamlink}
                  invalid={!!errors.excites_about_glamlink}
                  onChange={(v) => set('excites_about_glamlink', v)}
                />
              </FormField>

              <FormField label="Your biggest pain points" errorId={`${fieldId('biggest_pain_points')}-error`} required error={errors.biggest_pain_points} hint="Select at least one.">
                <MultiSelect
                  id={fieldId('biggest_pain_points')}
                  options={PAIN_POINTS_OPTIONS}
                  selected={form.biggest_pain_points}
                  invalid={!!errors.biggest_pain_points}
                  onChange={(v) => set('biggest_pain_points', v)}
                />
              </FormField>

              <div className="flex flex-col gap-4 border-t pt-8">
                <Switch checked={form.offer_promotion} onChange={(v) => set('offer_promotion', v)}>
                  <span className="block text-sm font-semibold text-foreground">
                    I would like to offer a promotion with my digital card
                  </span>
                </Switch>
                {form.offer_promotion && (
                  <FormField label="Promotion Details" htmlFor={fieldId('promotion_details')} className="sm:pl-14">
                    <Input
                      id={fieldId('promotion_details')}
                      placeholder="e.g. 20% off Balayage for first-time clients"
                      value={form.promotion_details}
                      onChange={(e) => set('promotion_details', e.target.value)}
                    />
                  </FormField>
                )}

                <button
                  type="button"
                  aria-pressed={form.elite_setup}
                  onClick={() => set('elite_setup', !form.elite_setup)}
                  className={`mt-2 flex items-start gap-3 rounded-xl border p-4 text-left transition-colors outline-none focus-visible:ring-4 focus-visible:ring-primary/15 sm:p-5
                    ${form.elite_setup ? 'border-primary bg-primary/[0.04]' : 'border-input hover:border-primary/40'}`}
                >
                  <span className="mt-0.5"><CheckBox checked={form.elite_setup} /></span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      The Elite Setup{' '}
                      <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">Recommended</span>
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                      I agree to let the Glamlink Concierge Team build my professional profile and digital business card using my existing public social media content. We&apos;ll curate your first clips, photo albums, and service menu so you can launch instantly.
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </SectionCard>

          {/* SUBMIT */}
          <div className="border-t bg-muted/30 px-5 py-10 text-center sm:px-10">
            <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">Ready to submit your application?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Your application will be reviewed by the Glamlink team within 2–3 business days.
              A confirmation email is sent immediately.
            </p>

            <ol className="mx-auto mt-5 flex max-w-xl flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground" aria-label="What happens next">
              {PROCESS_STEPS.map((step, i) => (
                <li key={step} className="inline-flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>

            <div className="mx-auto mt-7 flex max-w-md flex-col items-center gap-3">
              {submitError && (
                <div role="alert" className="flex w-full items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-left text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{submitError}</span>
                </div>
              )}
              {hasErrors && (
                <p role="status" className="text-sm text-red-500">Please fix the highlighted fields above.</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary btn-lg w-full disabled:opacity-70 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 sm:w-auto sm:px-12"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Submitting…
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
              <p className="text-xs leading-relaxed text-muted-foreground">
                By submitting you agree to Glamlink&apos;s{' '}
                <a href="#" className="font-semibold text-primary hover:underline">Terms of Service</a>{' '}and{' '}
                <a href="#" className="font-semibold text-primary hover:underline">Directory Guidelines</a>.
              </p>
            </div>
          </div>

        </form>
      </div>

      <SuccessModal open={submitted} onClose={() => setSubmitted(false)} accessCard={form.createAccessCard} />
    </div>
  )
}
