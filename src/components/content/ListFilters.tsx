"use client";

import { useState, type ChangeEvent } from "react";
import { Loader2 } from "lucide-react";
import { listHref } from "@/lib/searchParams";
import { cn } from "@/lib/utils";
import { useListNavigation } from "./ListNavigation";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterField {
  /** The URL parameter. */
  name: string;
  label: string;
  /** The empty choice: "All specialties". */
  allLabel: string;
  value: string;
  options: FilterOption[];
  /** Choices that depend on another field (a state's cities): by that field's value. Empty until it is chosen. */
  dependsOn?: { name: string; options: Record<string, FilterOption[]> };
}

interface ListFiltersProps {
  /** The list's path: "/professionals" or "/brands". */
  action: string;
  fields: FilterField[];
  sort: { value: string; options: FilterOption[] };
  /** Kept as they are when a filter changes: the search box's text. */
  keep?: Record<string, string>;
  /** The point behind sort=nearest, kept while that sort is chosen. */
  point?: { lat: string; lng: string } | null;
}

/** Two decimals: about a kilometre, close enough to sort by and kinder to the visitor (and the cache). */
const roundCoordinate = (n: number) => String(Math.round(n * 100) / 100);

/**
 * The filters and sort of the Professionals and Brands pages. Each choice loads the list with it (page 1); without
 * JavaScript it is a plain GET form with an Apply button. "Nearest to me" asks the browser for the visitor's place.
 */
export default function ListFilters({ action, fields, sort, keep = {}, point = null }: ListFiltersProps) {
  const { pending, navigate } = useListNavigation();
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.name, f.value])));
  const [sortValue, setSortValue] = useState(sort.value);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const go = (next: Record<string, string>, nextSort: string, at: { lat: string; lng: string } | null) => {
    setError(null);
    const href = listHref(action, {
      ...keep,
      ...next,
      // The first order is the list's own: the URL leaves it out
      sort: nextSort === sort.options[0]?.value ? "" : nextSort,
      ...(nextSort === "nearest" && at ? at : {}),
    });
    navigate(href);
  };

  const onField = (field: FilterField) => (event: ChangeEvent<HTMLSelectElement>) => {
    const next = { ...values, [field.name]: event.target.value };
    // A field whose choices depend on this one starts over (a new state: any city)
    for (const other of fields) if (other.dependsOn?.name === field.name) next[other.name] = "";
    setValues(next);
    go(next, sortValue, point);
  };

  const onSort = (event: ChangeEvent<HTMLSelectElement>) => {
    const chosen = event.target.value;
    if (chosen !== "nearest") {
      setSortValue(chosen);
      go(values, chosen, null);
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Your browser can't share its location. Pick a state or city instead.");
      return;
    }
    setSortValue(chosen);
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        go(values, "nearest", { lat: roundCoordinate(coords.latitude), lng: roundCoordinate(coords.longitude) });
      },
      (failure) => {
        setLocating(false);
        setSortValue(sort.value);
        setError(
          failure.code === failure.PERMISSION_DENIED
            ? "Location access was blocked, so we can't sort by distance."
            : "We couldn't find your location. Try again, or pick a state or city."
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  };

  const optionText = (option: FilterOption) =>
    option.count === undefined ? option.label : `${option.label} (${option.count})`;

  return (
    <form action={action} method="get" aria-busy={pending || locating} onSubmit={(e) => e.preventDefault()}>
      {Object.entries(keep).map(([name, value]) =>
        value ? <input key={name} type="hidden" name={name} value={value} /> : null
      )}
      {sortValue === "nearest" && point && (
        <>
          <input type="hidden" name="lat" value={point.lat} />
          <input type="hidden" name="lng" value={point.lng} />
        </>
      )}

      <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:items-end">
        {fields.map((field) => {
          const options = field.dependsOn
            ? (field.dependsOn.options[values[field.dependsOn.name] ?? ""] ?? [])
            : field.options;
          const disabled = Boolean(field.dependsOn) && !values[field.dependsOn!.name];
          if (!field.dependsOn && options.length === 0 && !field.value) return null;
          return (
            <div key={field.name} className="min-w-0 md:w-52">
              <label htmlFor={`filter-${field.name}`} className="label-glamlink">
                {field.label}
              </label>
              <select
                id={`filter-${field.name}`}
                name={field.name}
                value={values[field.name] ?? ""}
                onChange={onField(field)}
                disabled={disabled}
                className="input-glamlink rounded-full py-2.5"
              >
                <option value="">{field.allLabel}</option>
                {/* A chosen value no longer offered (no one left with it) stays, so the list can be read back */}
                {field.value && !options.some((o) => o.value === field.value) && values[field.name] === field.value && (
                  <option value={field.value}>{field.value}</option>
                )}
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {optionText(option)}
                  </option>
                ))}
              </select>
            </div>
          );
        })}

        <div className="min-w-0 md:ml-auto md:w-52">
          <label htmlFor="filter-sort" className="label-glamlink">
            Sort by
          </label>
          <div className="relative">
            <select
              id="filter-sort"
              name="sort"
              value={sortValue}
              onChange={onSort}
              className={cn("input-glamlink rounded-full py-2.5", (pending || locating) && "pr-10")}
            >
              {sort.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {(pending || locating) && (
              <Loader2
                className="pointer-events-none absolute right-8 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        <noscript>
          <button type="submit" className="btn-primary py-2.5">
            Apply
          </button>
        </noscript>
      </div>

      <p role="alert" className={cn("mt-3 text-sm text-destructive", !error && "sr-only")}>
        {error}
      </p>
    </form>
  );
}
