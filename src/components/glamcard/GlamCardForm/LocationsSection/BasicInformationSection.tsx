"use client";

import React from "react";
import dynamic from "next/dynamic";

import { FieldErrors, GlamCardFormData } from "../types";

/* ================= SSR SAFE CKEDITOR ================= */
// The editor and its build are isolated in their own client-only file.
// dynamic() only skips SSR if the import itself is deferred like this —
// importing CKEditor/ClassicEditor directly in this file (even if unused
// afterwards) would still evaluate them on the server and crash.
const BioEditor = dynamic(() => import("./Bioeditor"), {
  ssr: false,
  loading: () => (
    <div className="h-32 w-full animate-pulse rounded-lg border border-gray-200 bg-gray-50" />
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
}

/* ================= STYLES ================= */

const sectionClass =
  "space-y-6 rounded-xl border border-gray-200 bg-white p-6";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200";

const errorInputClass = "border-red-500 focus:border-red-500 focus:ring-red-200";

const labelClass = "text-sm font-medium text-gray-700";

const CHARACTER_LIMIT = 80;

const getCharacterCount = (html: string) =>
  html?.replace(/<[^>]*>/g, "").trim().length || 0;

/* ================= COMPONENT ================= */

const BasicInformationSection: React.FC<SectionProps> = ({
  data,
  setData,
  errors,
  clearError,
}) => {
  return (
    <section className={sectionClass}>
      <h2 className="text-lg font-semibold">Basic Information</h2>

      <div className="grid gap-5 md:grid-cols-2">
        {/* NAME */}
        <div id="field-name">
          <label className={labelClass}>
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            className={`${inputClass} ${errors?.name ? errorInputClass : ""}`}
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
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* TITLE */}
        <div id="field-professional_title">
          <label className={labelClass}>
            Professional Title <span className="text-red-500">*</span>
          </label>
          <input
            className={`${inputClass} ${errors?.professional_title ? errorInputClass : ""}`}
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
            <p className="mt-1 text-sm text-red-500">{errors.professional_title}</p>
          )}
        </div>



        {/* EMAIL */}
        <div id="field-email">
          <label className={labelClass}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className={`${inputClass} ${errors?.email ? errorInputClass : ""}`}
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
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* PHONE */}
    <div id="field-phone">
  <div className="mb-2 flex items-center justify-between">
    <label className={labelClass}>Phone</label>

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
        className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
      />
      <span className="text-xs font-medium text-gray-600">
        Show phone number on card
      </span>
    </label>
  </div>

  <input
    type="tel"
    inputMode="numeric"
    maxLength={15}
    className={`${inputClass} ${errors?.phone ? errorInputClass : ""}`}
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
    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
  ) : (
    data.is_phone_visible && !data.phone?.trim() && (
      <p className="mt-1 text-sm text-red-500">
        Phone number is required.
      </p>
    )
  )}
</div>

        {/* BIO */}
        <div id="field-bio" className="md:col-span-2">
          <label className={labelClass}>Professional Bio</label>

          <div
            className={
              errors?.bio ? "rounded-lg ring-1 ring-red-500" : undefined
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

          <div className="mt-1 flex items-center justify-between">
            {errors?.bio ? (
              <p className="text-sm text-red-500">{errors.bio}</p>
            ) : (
              <span />
            )}
            <p className="text-right text-xs text-gray-500">
              {getCharacterCount(data.bio || "")} / {CHARACTER_LIMIT}
            </p>
          </div>
        </div>
      </div>
      {/* BUSINESS NAME */}
      <div id="field-business_name">
        <label className={labelClass}>Business Name</label>
        <input
          className={`${inputClass} w-full ${errors?.business_name ? errorInputClass : ""}`}
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
          <p className="mt-1 text-sm text-red-500">{errors.business_name}</p>
        )}
      </div>
    </section>
  );
};

export default BasicInformationSection;