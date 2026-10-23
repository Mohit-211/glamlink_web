'use client'

import { useState, type FormEvent } from 'react'
import { BadgeCheck, Loader2, MapPin, Search } from 'lucide-react'
import { findGoogleBusiness } from '@/api/Api'
import { readApiError } from '@/lib/apiError'

export interface GoogleMatch {
  place_id: string
  name: string
  address?: string | null
  city?: string | null
  state?: string | null
  claimed?: boolean
}

interface GoogleBusinessFinderProps {
  /** The business picked: the form fills in what Google knows about it. */
  onPick: (match: GoogleMatch) => void
}

/**
 * "Find my business on Google" (backend handoff, 10.13): up to 5 matches for a
 * business name and city; picking one starts the application from its listing.
 */
export function GoogleBusinessFinder({ onPick }: GoogleBusinessFinderProps) {
  const [query, setQuery] = useState('')
  const [matches, setMatches] = useState<GoogleMatch[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')

  const onSearch = async (event: FormEvent) => {
    event.preventDefault()
    const q = query.trim()
    if (q.length < 2) return
    setSearching(true)
    setError('')
    try {
      const res = await findGoogleBusiness(q)
      setMatches(Array.isArray(res?.data) ? res.data : [])
    } catch (err) {
      setError(readApiError(err, "We couldn't search Google right now. Fill in the form instead.").message)
      setMatches(null)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
      <p className="text-sm font-semibold text-foreground">Find my business on Google</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Start from your Google listing: we fill in your address, phone, website and hours.
      </p>
      {/* Not a nested <form>: this sits inside the application form */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row" role="search">
        <label htmlFor="google-business-search" className="sr-only">
          Business name and city
        </label>
        <input
          id="google-business-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch(e)
          }}
          placeholder="Business name, city"
          className="input-glamlink flex-1"
        />
        <button type="button" onClick={onSearch} disabled={searching || query.trim().length < 2} className="btn-outline">
          {searching ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Search className="h-4 w-4" aria-hidden="true" />}
          Search
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {matches && (
        <div className="mt-4" aria-live="polite">
          {matches.length === 0 ? (
            <p className="text-sm text-muted-foreground">No match on Google. Fill in the form below instead.</p>
          ) : (
            <ul className="space-y-2">
              {matches.map((match) => (
                <li key={match.place_id}>
                  <button
                    type="button"
                    disabled={match.claimed}
                    onClick={() => onPick(match)}
                    className="flex w-full items-start gap-3 rounded-xl border border-border px-4 py-3 text-left transition-colors hover:border-secondary hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border disabled:hover:bg-transparent"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-foreground">{match.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {match.address || [match.city, match.state].filter(Boolean).join(', ')}
                      </span>
                    </span>
                    {match.claimed && (
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground">
                        <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        Already claimed
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
