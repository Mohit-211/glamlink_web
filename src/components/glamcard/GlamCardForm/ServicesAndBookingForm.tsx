import React, { useState } from "react";
import { BOOKING_METHODS, BookingMethod, GlamCardFormData } from "./types";

interface Props {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
}

const sectionClass = "space-y-6 rounded-xl border border-gray-200 bg-white p-6";
const labelClass = "text-sm font-medium text-gray-700";
const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm " +
  "text-gray-900 placeholder-gray-400 transition " +
  "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200";

const INSTAGRAM_KEYS = ["instagram", "instagram1", "instagram2"] as const;
type InstagramKey = (typeof INSTAGRAM_KEYS)[number];

const ServicesAndBookingForm: React.FC<Props> = ({ data, setData }) => {
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [infoInput, setInfoInput] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  if (!data) return null;

  /* ================= SPECIALTIES ================= */
  const addSpecialty = () => {
    if (!specialtyInput.trim()) return;
    if (data.specialties.length >= 5) return;
    setData((prev) => ({
      ...prev,
      specialties: [...prev.specialties, specialtyInput.trim()],
    }));
    setSpecialtyInput("");
  };

  const removeSpecialty = (index: number) => {
    setData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  };

  /* ================= IMPORTANT INFO ================= */
  const addInfo = () => {
    if (!infoInput.trim()) return;
    setData((prev) => ({
      ...prev,
      important_info: [...prev.important_info, infoInput.trim()],
    }));
    setInfoInput("");
  };

  const removeInfo = (index: number) => {
    setData((prev) => ({
      ...prev,
      important_info: prev.important_info.filter((_, i) => i !== index),
    }));
  };

  /* ================= FORMATTERS ================= */
  const formatInstagram = (value: string) => {
    if (!value.trim()) return "";
    if (value.startsWith("http")) return value.trim();
    const clean = value.replace(/^@/, "").trim();
    return `https://www.instagram.com/${clean}`;
  };

  const formatTikTok = (value: string) => {
    if (!value.trim()) return "";
    if (value.startsWith("http")) return value.trim();
    const clean = value.replace(/^@/, "").trim();
    return `https://www.tiktok.com/@${clean}`;
  };

 /* ================= INSTAGRAM HANDLES ================= */
const getHandles = (): string[] => {
  const sm = data.social_media as any;
  const handles: string[] = [];
  if (sm?.instagram) handles.push(sm.instagram);
  
  let i = 1;
  while (sm?.[`instagram${i}`] !== undefined) {
    handles.push(sm[`instagram${i}`]);
    i++;
  }
  return handles.length > 0 ? handles : [""];
};

const addInstagramHandle = () => {
  const sm = data.social_media as any;
  
  // Count existing keys
  let count = 0;
  if (sm?.instagram !== undefined) count++;
  let i = 1;
  while (sm?.[`instagram${i}`] !== undefined) {
    count++;
    i++;
  }

  // Next key: instagram → instagram1 → instagram2 → instagram3...
  const nextKey = count === 0 ? "instagram" : `instagram${count}`;

  setData((prev) => ({
    ...prev,
    social_media: { ...prev.social_media, [nextKey]: "" },
  }));
};

const updateInstagramHandle = (idx: number, value: string) => {
  const key = idx === 0 ? "instagram" : `instagram${idx}`;
  setData((prev) => ({
    ...prev,
    social_media: { ...prev.social_media, [key]: formatInstagram(value) },
  }));
};

const removeInstagramHandle = (idx: number) => {
  setData((prev) => {
    const sm = { ...(prev.social_media as any) };
    // Remove all instagram keys and re-build from remaining handles
    const handles = getHandles().filter((_, i) => i !== idx);
    delete sm.instagram;
    let i = 1;
    while (sm[`instagram${i}`] !== undefined) {
      delete sm[`instagram${i}`];
      i++;
    }
    // Re-assign
    handles.forEach((val, i) => {
      const key = i === 0 ? "instagram" : `instagram${i}`;
      sm[key] = val;
    });
    return { ...prev, social_media: sm };
  });
};
  /* ================= OTHER LINKS ================= */
  const addOtherLink = () => {
    setData((prev) => ({
      ...prev,
      other_links: [...(prev.other_links || []), { title: "", url: "" }],
    }));
  };

  const removeOtherLink = (index: number) => {
    setData((prev) => ({
      ...prev,
      other_links: prev.other_links.filter((_: any, i: number) => i !== index),
    }));
  };

  const updateOtherLink = (index: number, field: "title" | "url", value: string) => {
    setData((prev) => {
      const updated = [...(prev.other_links || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, other_links: updated };
    });
  };

  /* ================= RENDER ================= */
  return (
    <section className={sectionClass}>
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Services & Booking</h2>
        <p className="text-sm text-gray-500">
          Your specialties and how clients can reach you
        </p>
      </header>

      {/* Primary Specialty */}
      {/* <div>
        <label className={labelClass}>Primary Specialty *</label>
        <input
          className={inputClass}
          placeholder="e.g. Hair Styling, Nails, Makeup..."
          value={data.primary_specialty || ""}
          onChange={(e) =>
            setData((prev) => ({ ...prev, primary_specialty: e.target.value }))
          }
          required
        />
      </div> */}

      {/* Additional Specialties */}
      <div className="space-y-3">
        <label className={labelClass}>Additional Specialties</label>
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="e.g. Balayage, Keratin Treatments, Bridal Makeup"
            value={specialtyInput}
            onChange={(e) => setSpecialtyInput(e.target.value)}
          />
          <button
            type="button"
            onClick={addSpecialty}
            disabled={data.specialties.length >= 5 || !specialtyInput.trim()}
            className={`rounded-lg px-5 text-sm font-medium transition ${data.specialties.length >= 5 || !specialtyInput.trim()
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
          >
            + Add
          </button>
        </div>
        <p className="text-xs text-gray-500">Max 5 specialties</p>
        {data.specialties.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.specialties.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeSpecialty(i)}
                  className="ml-1 text-teal-800 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Custom Handle */}
      <div>
        <label className={labelClass}>Claim Your Custom Handle</label>
        <input
          className={inputClass}
          placeholder="Used for your Glamlink profile URL"
          value={data.custom_handle || ""}
          onChange={(e) =>
            setData((prev) => ({ ...prev, custom_handle: e.target.value }))
          }
        />
      </div>

      {/* Socials & Website */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Socials & Website</h3>
          <p className="text-xs text-gray-500 mt-1">
            Add your social profiles, website, press features, or articles
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Website */}
          <div>
            <label className={labelClass}>Website</label>
            <input
              type="url"
              className={inputClass}
              placeholder="https://yourwebsite.com"
              value={data.website || ""}
              onChange={(e) =>
                setData((prev) => ({ ...prev, website: e.target.value }))
              }
            />
          </div>

          {/* Instagram — 3 fixed slots */}
        
           {/* Instagram — dynamic */}
<div className="md:col-span-2">
  <div className="flex items-center justify-between mb-2">
    <div>
      <label className={labelClass}>Instagram</label>
      <p className="text-xs text-gray-500">Add multiple Instagram handles</p>
    </div>
    <button
      type="button"
      onClick={addInstagramHandle}
      className="text-xs text-[#23AEB8] hover:underline font-medium"
    >
      + Add Instagram
    </button>
  </div>
  <div className="space-y-2">
    {getHandles().map((value, idx) => (
      <div key={idx} className="flex items-center gap-2">
        <span className="text-xs text-gray-400 w-24 shrink-0">
          {idx === 0 ? "Instagram" : `Instagram ${idx}`}
        </span>
        <input
          className={`${inputClass} flex-1`}
          placeholder="@yourusername or full URL"
          value={value}
          required={idx === 0 && data.preferred_booking_method === BOOKING_METHODS.INSTAGRAM}
          onChange={(e) => updateInstagramHandle(idx, e.target.value)}
        />
        {getHandles().length > 1 && (
          <button
            type="button"
            onClick={() => removeInstagramHandle(idx)}
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
          >
            ×
          </button>
        )}
      </div>
    ))}
  </div>
</div>
          

          {/* TikTok */}
          <div>
            <label className={labelClass}>TikTok</label>
            <input
              className={inputClass}
              placeholder="@yourusername or full URL"
              value={data.social_media?.tiktok || ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  social_media: {
                    ...prev.social_media,
                    tiktok: formatTikTok(e.target.value),
                  },
                }))
              }
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input
              type="url"
              className={inputClass}
              placeholder="https://linkedin.com/in/yourprofile"
              value={data.social_media?.linkedin || ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  social_media: { ...prev.social_media, linkedin: e.target.value },
                }))
              }
            />
          </div>

          {/* YouTube */}
          <div>
            <label className={labelClass}>YouTube</label>
            <input
              type="url"
              className={inputClass}
              placeholder="https://youtube.com/@yourchannel"
              value={data.social_media?.youtube || ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  social_media: { ...prev.social_media, youtube: e.target.value },
                }))
              }
            />
          </div>

          {/* Facebook */}
          <div>
            <label className={labelClass}>Facebook</label>
            <input
              type="url"
              className={inputClass}
              placeholder="https://facebook.com/yourpage"
              value={data.social_media?.facebook || ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  social_media: { ...prev.social_media, facebook: e.target.value },
                }))
              }
            />
          </div>
        </div>

        {/* Press / Articles / Other Links */}
        <div className="space-y-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Press / Articles / Other Links
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Add magazine features, interviews, blog articles, portfolios,
                press coverage, Behance projects, or any important external links.
              </p>
            </div>
            <button
              type="button"
              onClick={addOtherLink}
              className="flex-none rounded-lg bg-[#23AEB8] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f9aa3]"
            >
              + Add Link
            </button>
          </div>
          <div className="space-y-3">
            {(data.other_links || []).map(
              (link: { title: string; url: string }, index: number) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className={`${inputClass} flex-1`}
                      placeholder="Title (e.g. Vogue Feature)"
                      value={link.title}
                      onChange={(e) => updateOtherLink(index, "title", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeOtherLink(index)}
                      className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                  <input
                    type="url"
                    className={inputClass}
                    placeholder="https://example.com/article"
                    value={link.url}
                    onChange={(e) => updateOtherLink(index, "url", e.target.value)}
                  />
                </div>
              )
            )}
            {(data.other_links?.length ?? 0) === 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
                No links added yet. Click "Add Link" to get started.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preferred Booking Method */}
      <div>
        <div className="flex items-center gap-2 relative">
          <label className={labelClass}>Preferred Booking Method</label>
          <span
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
            className="cursor-pointer text-gray-400 hover:text-gray-600 text-sm"
          >
            ⓘ
          </span>
          {showInfo && (
            <div className="absolute top-6 left-0 z-10 w-64 rounded-lg bg-black text-white text-xs p-3 shadow-lg">
              Choose how clients can contact you:
              <br />• Booking Link → requires link
              <br />• Call/Text → requires phone number
              <br />• Instagram DM → requires Instagram
            </div>
          )}
        </div>
        <select
          className={inputClass}
          value={data.preferred_booking_method}
          onChange={(e) => {
            const value = e.target.value as BookingMethod;
            setData((prev) => ({
              ...prev,
              preferred_booking_method: value,
              booking_link: value === BOOKING_METHODS.LINK ? prev.booking_link : "",
            }));
          }}
          required
        >
          <option value="">Select booking method...</option>
          <option value={BOOKING_METHODS.LINK}>Go to Booking Link</option>
          <option value={BOOKING_METHODS.CALL}>Call / Text</option>
          <option value={BOOKING_METHODS.INSTAGRAM}>DM on Instagram</option>
        </select>
        {data.preferred_booking_method === "GO_tO_BOOKING_LINK" && (
          <div className="mt-4">
            <label className={labelClass}>Booking Link</label>
            <input
              type="url"
              className={inputClass}
              required
              placeholder="https://booksy.com/yourprofile or calendly.com/..."
              value={data.booking_link || ""}
              onChange={(e) =>
                setData((prev) => ({ ...prev, booking_link: e.target.value }))
              }
            />
          </div>
        )}
      </div>

      {/* Important Info */}
      <div className="space-y-3">
        <label className={labelClass}>Important Information</label>
        {data.important_info.length > 0 && (
          <div className="space-y-2">
            {data.important_info.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className={`${inputClass} bg-gray-50`}
                  value={item}
                  disabled
                />
                <button
                  type="button"
                  onClick={() => removeInfo(i)}
                  className="text-red-600 hover:text-red-800 text-xl"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="e.g. By appointment only • Cash/Card accepted"
            value={infoInput}
            onChange={(e) => setInfoInput(e.target.value)}
          />
          <button
            type="button"
            onClick={addInfo}
            className="rounded-lg bg-gray-200 px-5 text-sm font-medium hover:bg-gray-300"
          >
            + Add
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesAndBookingForm;