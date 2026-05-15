"use client";

import React from "react";
import dynamic from "next/dynamic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { GlamCardFormData } from "../types";

/* ================= SSR SAFE CKEDITOR ================= */
// (prevents Next.js hydration issues)
const CKEditorComponent = dynamic(
  () => Promise.resolve(CKEditor),
  { ssr: false }
);

/* ================= TYPES ================= */

interface SectionProps {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
}

/* ================= STYLES ================= */

const sectionClass =
  "space-y-6 rounded-xl border border-gray-200 bg-white p-6";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200";

const labelClass = "text-sm font-medium text-gray-700";

const CHARACTER_LIMIT = 80;

const getCharacterCount = (html: string) =>
  html?.replace(/<[^>]*>/g, "").trim().length || 0;

/* ================= COMPONENT ================= */

const BasicInformationSection: React.FC<SectionProps> = ({
  data,
  setData,
}) => {
  return (
    <section className={sectionClass}>
      <h2 className="text-lg font-semibold">Basic Information</h2>

      <div className="grid gap-5 md:grid-cols-2">

        {/* NAME */}
        <div>
          <label className={labelClass}>Full Name *</label>
          <input
            className={inputClass}
            value={data.name || ""}
            onChange={(e) =>
              setData((p) => ({ ...p, name: e.target.value }))
            }
          />
        </div>

        {/* TITLE */}
        <div>
          <label className={labelClass}>Professional Title *</label>
          <input
            className={inputClass}
            value={data.professional_title || ""}
            onChange={(e) =>
              setData((p) => ({
                ...p,
                professional_title: e.target.value,
              }))
            }
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className={labelClass}>Email *</label>
          <input
            type="email"
            className={inputClass}
            value={data.email || ""}
            onChange={(e) =>
              setData((p) => ({ ...p, email: e.target.value }))
            }
          />
        </div>

        {/* PHONE */}
        <div>
          <label className={labelClass}>Phone *</label>
          <input
            className={inputClass}
            value={data.phone || ""}
            onChange={(e) =>
              setData((p) => ({ ...p, phone: e.target.value }))
            }
          />
        </div>

        {/* BIO */}
        <div className="md:col-span-2">
          <label className={labelClass}>Professional Bio</label>

          <CKEditor
            editor={ClassicEditor as any}
            data={data.bio || ""}
           config={{
  licenseKey: "GPL",
  placeholder: "Write your bio...",
}}
            onChange={(_, editor) => {
              const html = editor.getData();
              const text = html.replace(/<[^>]*>/g, "").trim();

              if (text.length <= CHARACTER_LIMIT) {
                setData((p) => ({ ...p, bio: html }));
              }
            }}
          />

          {/* COUNTER */}
          <p className="mt-1 text-right text-xs text-gray-500">
            {getCharacterCount(data.bio || "")} / {CHARACTER_LIMIT}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BasicInformationSection;