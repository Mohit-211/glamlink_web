"use client";

import React from "react";
import dynamic from "next/dynamic";

import { FieldErrors, GlamCardFormData } from "../types";
import { TOKENS } from "@/lib/designTokens";

/* ================= CLIENT-ONLY BIO EDITOR ================= */
// The rich-text editor lives in its own file and is loaded only in the
// browser, which keeps it (and its editor engine) out of the server render
// and the initial bundle.
const BioEditor = dynamic(() => import("./Bioeditor"), {
  ssr: false,
  loading: () => (
    <div className="h-32 w-full animate-pulse rounded-lg border border-border bg-muted" />
  ),
});

/* ================= TYPES ================= */

interface SectionProps {
  data: GlamCardFormData & {
    // preferred_booking_phone?: boolean;
    is_phone_visible?: boolean;
  };
  setData: React.Dispatch<
    React.SetStateAction<
      GlamCardFormData & {
        // preferred_booking_phone?: boolean;
        is_phone_visible?: boolean;
      }
    >
  >;
  errors?: FieldErrors;
  clearError?: (key: string) => void;
  /** Editing a card: the type is shown but only admins change it. */
  typeLocked?: boolean;
}

/* ================= WHO THE CARD IS FOR ================= */

const TYPES = [
  { value: "individual", label: "Beauty or wellness professional", hint: "You offer services to clients" },
  { value: "brand", label: "Brand", hint: "You make or sell beauty or wellness products" },
] as const;

/* ================= STYLES ================= */

const sectionClass =
  "space-y-6 rounded-xl border border-border bg-card p-4 sm:p-6";




const CHARACTER_LIMIT = 80;

const getCharacterCount = (html: string) =>
  html?.replace(/<[^>]*>/g, "").trim().length || 0;

/* ================= COMPONENT ================= */

const BasicInformationSection: React.FC<SectionProps> = ({
  data,
  setData,
  errors,
  clearError,
  typeLocked = false,
}) => {
  const brand = data.professional_type === "brand";
  return (
    <section className={sectionClass}>
      <h2 className="text-lg font-semibold">Basic Information</h2>

      {/* PROFESSIONAL OR BRAND */}
      <fieldset id="field-professional_type" className="space-y-2">
        <legend className="label-glamlink">
          I am a {!typeLocked && <span className="text-destructive">*</span>}
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {TYPES.map((type) => (
            <label
              key={type.value}
              className={`flex items-start gap-3 rounded-xl border p-4 transition-colors has-checked:border-secondary has-checked:bg-accent ${
                errors?.professional_type ? "border-destructive" : "border-border"
              } ${typeLocked ? "cursor-default" : "cursor-pointer hover:border-secondary"}`}
            >
              <input
                type="radio"
                name="professional_type"
                value={type.value}
                checked={data.professional_type === type.value}
                disabled={typeLocked}
                onChange={() => {
                  setData((p) => ({ ...p, professional_type: type.value }));
                  clearError?.("professional_type");
                }}
                className="mt-0.5 h-4 w-4 shrink-0 accent-secondary"
              />
              <span>
                <span className="block text-sm font-semibold text-foreground">{type.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{type.hint}</span>
              </span>
            </label>
          ))}
        </div>
        {typeLocked && (
          <p className="text-xs text-muted-foreground">To change this, contact support.</p>
        )}
        {errors?.professional_type && (
          <p className="text-sm text-destructive">{errors.professional_type}</p>
        )}
      </fieldset>

      <div className="grid gap-5 md:grid-cols-2">
        {/* NAME */}
        <div id="field-name">
          <label className="label-glamlink">
            {brand ? "Contact Name" : "Full Name"} <span className="text-destructive">*</span>
          </label>
          <input
            className="input-glamlink" aria-invalid={!!errors?.name}
            placeholder={brand ? "The person we can reach" : "e.g. Jane Smith"}
            value={data.name || ""}
            onChange={(e) => {
              setData((p) => ({
                ...p,
                name: e.target.value,
              }));
              clearError?.("name");
            }}
          />
          {errors?.name && (
            <p className="mt-1 text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* TITLE */}
        <div id="field-professional_title">
          <label className="label-glamlink">
            {brand ? (
              <>
                Tagline <span className="normal-case tracking-normal text-muted-foreground">(optional)</span>
              </>
            ) : (
              <>
                Professional Title <span className="text-destructive">*</span>
              </>
            )}
          </label>
          <input
            className="input-glamlink" aria-invalid={!!errors?.professional_title}
            placeholder={brand ? "e.g. Clean skincare, made in Las Vegas" : "e.g. Hair Stylist, Nail Technician"}
            value={data.professional_title || ""}
            onChange={(e) => {
              setData((p) => ({
                ...p,
                professional_title: e.target.value,
              }));
              clearError?.("professional_title");
            }}
          />
          {errors?.professional_title && (
            <p className="mt-1 text-sm text-destructive">{errors.professional_title}</p>
          )}
        </div>



        {/* EMAIL */}
        <div id="field-email">
          <label className="label-glamlink">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            className="input-glamlink" aria-invalid={!!errors?.email}
            placeholder="you@example.com"
            value={data.email || ""}
            onChange={(e) => {
              setData((p) => ({
                ...p,
                email: e.target.value,
              }));
              clearError?.("email");
            }}
          />
          {errors?.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* PHONE */}
    <div id="field-phone">
  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
    <label className="label-glamlink">
      Phone
      {(data.is_phone_visible ?? true) && <span className="text-destructive"> *</span>}
    </label>

    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={data.is_phone_visible ?? true}
        onChange={(e) =>
          setData((p) => ({
            ...p,
            is_phone_visible: e.target.checked,
          }))
        }
        className="h-4 w-4 accent-secondary"
      />
      <span className="text-xs font-medium text-muted-foreground">
        Show phone number on card
      </span>
    </label>
  </div>

  <input
    type="tel"
    inputMode="numeric"
    maxLength={15}
    className="input-glamlink" aria-invalid={!!errors?.phone}
    placeholder="e.g. 5551234567"
    value={data.phone || ""}
    required={data.is_phone_visible}
    onChange={(e) => {
      const digitsOnly = e.target.value.replace(/\D/g, "");
      setData((p) => ({
        ...p,
        phone: digitsOnly,
      }));
      clearError?.("phone");
    }}
  />

  {errors?.phone ? (
    <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
  ) : (
    data.is_phone_visible && !data.phone?.trim() && (
      <p className="mt-1 text-sm text-destructive">
        Phone number is required.
      </p>
    )
  )}
</div>

        {/* BIO */}
        <div id="field-bio" className="md:col-span-2">
          <label className="label-glamlink">
            {brand ? "About the Brand" : "Professional Bio"} <span className="text-destructive">*</span>
          </label>

          <div
            className={
              errors?.bio ? "rounded-lg ring-1 ring-destructive" : undefined
            }
          >
            <BioEditor
              value={data.bio || ""}
              placeholder="Write your bio..."
              onChange={(html) => {
                const text = html.replace(/<[^>]*>/g, "").trim();

                if (text.length <= CHARACTER_LIMIT) {
                  setData((p) => ({
                    ...p,
                    bio: html,
                  }));
                  clearError?.("bio");
                }
              }}
            />
          </div>

          <div className="mt-1 flex items-start justify-between gap-3">
            {errors?.bio ? (
              <p className="text-sm text-destructive">{errors.bio}</p>
            ) : (
              <span />
            )}
            <p className="text-right text-xs text-muted-foreground">
              {getCharacterCount(data.bio || "")} / {CHARACTER_LIMIT}
            </p>
          </div>
        </div>
      </div>
      {/* BUSINESS NAME */}
      <div id="field-business_name">
        <label className="label-glamlink">
          {brand ? "Brand Name" : "Business Name"} <span className="text-destructive">*</span>
        </label>
        <input
          className="input-glamlink w-full" aria-invalid={!!errors?.business_name}
          placeholder={brand ? "e.g. Glow Skincare" : "e.g. Glow Beauty Studio"}
          value={data.business_name || ""}
          onChange={(e) => {
            setData((p) => ({
              ...p,
              business_name: e.target.value,
            }));
            clearError?.("business_name");
          }}
        />
        {errors?.business_name && (
          <p className="mt-1 text-sm text-destructive">{errors.business_name}</p>
        )}
      </div>

      {/* CARD COLOR */}
      <div id="field-color_code">
        <label className="label-glamlink">Card Color</label>
        <p className="mt-1 text-xs text-muted-foreground">
          Pick an accent color for your Access Card — it themes the Featured
          Links cards, icons, and highlights across your page.
        </p>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="color"
            value={
              /^#[0-9a-fA-F]{6}$/.test(data.color_code || "")
                ? (data.color_code as string)
                : TOKENS.primary.toLowerCase()
            }
            onChange={(e) =>
              setData((p) => ({ ...p, color_code: e.target.value }))
            }
            className="h-10 w-14 flex-none cursor-pointer rounded-lg border border-border bg-card p-1"
            title="Pick a color"
          />
          <input
            type="text"
            className="input-glamlink min-w-0 max-w-[140px]"
            placeholder={TOKENS.primary}
            value={data.color_code || ""}
            onChange={(e) =>
              setData((p) => ({ ...p, color_code: e.target.value }))
            }
            maxLength={7}
          />
        </div>
      </div>
    </section>
  );
};

export default BasicInformationSection;