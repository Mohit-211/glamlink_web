import React, { useState, useEffect, useRef, useCallback } from "react";
import { BOOKING_METHODS, BookingMethod, FieldErrors, GlamCardFormData } from "./types";
import { userSpecialtiesApi } from "@/api/Api";

interface Props {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
  errors?: FieldErrors;
  clearError?: (key: string) => void;
}

const sectionClass = "space-y-6 rounded-xl border border-gray-200 bg-white p-6";
const labelClass = "text-sm font-medium text-gray-700";
const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm " +
  "text-gray-900 placeholder-gray-400 transition " +
  "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200";
const errorInputClass = "border-red-500 focus:border-red-500 focus:ring-red-200";

const INSTAGRAM_KEYS = ["instagram", "instagram1", "instagram2"] as const;

/* ================= HELPERS ================= */
const parseOtherLinks = (value: any): { title: string; url: string }[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const ServicesAndBookingForm: React.FC<Props> = ({
  data,
  setData,
  errors,
  clearError,
}) => {
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [infoInput, setInfoInput] = useState("");
  const [showInfo, setShowInfo] = useState(false);


  const [specialtyOptions, setSpecialtyOptions] = useState<string[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [specialtyDropdownOpen, setSpecialtyDropdownOpen] = useState(false);
  const specialtyWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await userSpecialtiesApi();
        const names: string[] = (res?.data?.rows ?? [])
          .map((item: any) => item?.name ?? item?.title ?? item)
          .filter(Boolean);
        if (mounted) setSpecialtyOptions(names);
      } catch (err) {
        console.error("Failed to load specialties:", err);
      } finally {
        if (mounted) setLoadingSpecialties(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        specialtyWrapperRef.current &&
        !specialtyWrapperRef.current.contains(e.target as Node)
      ) {
        setSpecialtyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        specialtyWrapperRef.current &&
        !specialtyWrapperRef.current.contains(e.target as Node)
      ) {
        setSpecialtyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!data) return null;

  /* ================= SPECIALTIES ================= */
  const isSpecialtyAdded = (val: string) =>
    data.specialties.some(
      (s) => s.toLowerCase() === val.trim().toLowerCase()
    );

  const addSpecialty = (value?: string) => {
    const val = (value ?? specialtyInput).trim();
    if (!val) return;
    if (data.specialties.length >= 5) return;
    if (isSpecialtyAdded(val)) return;
    setData((prev) => ({
      ...prev,
      specialties: [...prev.specialties, val],
    }));
    setSpecialtyInput("");
    setSpecialtyDropdownOpen(false);
    clearError?.("specialties");
  };

  const removeSpecialty = (index: number) => {
    setData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  };

  const filteredSpecialtyOptions = specialtyOptions.filter(
    (opt) =>
      opt.toLowerCase().includes(specialtyInput.trim().toLowerCase()) &&
      !isSpecialtyAdded(opt)
  );

  const specialtyExactMatch = specialtyOptions.some(
    (opt) => opt.toLowerCase() === specialtyInput.trim().toLowerCase()
  );

  const canAddCustomSpecialty =
    specialtyInput.trim().length > 0 &&
    !specialtyExactMatch &&
    !isSpecialtyAdded(specialtyInput) &&
    data.specialties.length < 5;

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
      important_info: prev.important_info?.filter((_, i) => i !== index),
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
    social_media: { ...prev.social_media, [key]: value },
  }));
  if (idx === 0) clearError?.("instagram");
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
      other_links: [...parseOtherLinks(prev.other_links), { title: "", url: "" }],
    }));
  };

  const removeOtherLink = (index: number) => {
    setData((prev) => ({
      ...prev,
      other_links: parseOtherLinks(prev.other_links).filter(
        (_: any, i: number) => i !== index,
      ),
    }));
  };

  const updateOtherLink = (index: number, field: "title" | "url", value: string) => {
    setData((prev) => {
      const updated = [...parseOtherLinks(prev.other_links)];
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

      {/* Additional Specialties */}
      <div id="field-specialties" className="space-y-3">
        <label className={labelClass}>
          Additional Specialties <span className="text-red-500">*</span>
        </label>

        <div className="relative flex gap-2" ref={specialtyWrapperRef}>
      <div className="relative flex-1">
  <input
    className={`${inputClass} ${errors?.specialties ? errorInputClass : ""}`}
    placeholder="e.g. Balayage, Keratin Treatments, Bridal Makeup"
    value={specialtyInput}
    onChange={(e) => {
      setSpecialtyInput(e.target.value);
      setSpecialtyDropdownOpen(true);
    }}
    onFocus={() => setSpecialtyDropdownOpen(true)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (specialtyExactMatch) {
          addSpecialty(specialtyInput.trim());
        } else if (canAddCustomSpecialty) {
          addSpecialty();
        }
      }
    }}
  />

  {specialtyDropdownOpen && (
    <div className="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
      {loadingSpecialties ? (
        <div className="px-4 py-2 text-sm text-gray-400">Loading…</div>
      ) : (
        <>
          {filteredSpecialtyOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => addSpecialty(opt)}
              disabled={data.specialties.length >= 5}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-[#24bbcb]/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {opt}
            </button>
          ))}

          {canAddCustomSpecialty && (
            <button
              type="button"
              onClick={() => addSpecialty()}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-[#24bbcb] hover:bg-[#24bbcb]/10 border-t border-gray-100"
            >
              + Add "{specialtyInput.trim()}"
            </button>
          )}

          {!filteredSpecialtyOptions.length && !canAddCustomSpecialty && (
            <div className="px-4 py-2 text-sm text-gray-400">
              {specialtyOptions.length === 0 ? "No specialties available" : "No matches"}
            </div>
          )}
        </>
      )}
    </div>
  )}
</div>

          <button
            type="button"
            onClick={() => {
              if (specialtyExactMatch) {
                addSpecialty(specialtyInput.trim());
              } else {
                addSpecialty();
              }
            }}
            disabled={
              data.specialties.length >= 5 ||
              !specialtyInput.trim() ||
              isSpecialtyAdded(specialtyInput)
            }
            className={`rounded-lg px-5 text-sm font-medium transition ${
              data.specialties.length >= 5 ||
              !specialtyInput.trim() ||
              isSpecialtyAdded(specialtyInput)
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#24bbcb] text-white hover:bg-[#24bbcb]"
            }`}
          >
            + Add
          </button>
        </div>

        {errors?.specialties ? (
          <p className="text-sm text-red-500">{errors.specialties}</p>
        ) : (
          <p className="text-xs text-gray-500">Max 5 specialties</p>
        )}
        {data.specialties.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.specialties.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#24bbcb] px-3 py-1 text-xs font-medium text-black"
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
              className={`${inputClass} ${errors?.booking_link ? errorInputClass : ""}`}
              placeholder="https://yourwebsite.com"
              value={data.website || ""}
              onChange={(e) => {
                setData((prev) => ({ ...prev, website: e.target.value }));
                clearError?.("booking_link");
              }}
            />
          </div>

          <div id="field-instagram" className="md:col-span-2">
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
      className={`${inputClass} flex-1 ${idx === 0 && errors?.instagram ? errorInputClass : ""}`}
      placeholder="Enter URL"
      value={value}
      required={
        idx === 0 &&
        !!data.preferred_booking_methods?.includes(
          BOOKING_METHODS.INSTAGRAM
        )
      }
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
            {errors?.instagram && (
              <p className="mt-1 text-sm text-red-500">{errors.instagram}</p>
            )}
          </div>
{/* TikTok */}
<div>
  <label className={labelClass}>TikTok</label>
  <input
    type="url"
    className={inputClass}
    placeholder="Enter URL"
    value={data.social_media?.tiktok || ""}
    onChange={(e) =>
      setData((prev) => ({
        ...prev,
        social_media: { ...prev.social_media, tiktok: e.target.value },
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
    placeholder="Enter URL"
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
    placeholder="Enter URL"
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
    placeholder="Enter URL"
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
            {parseOtherLinks(data?.other_links).map(
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
            {parseOtherLinks(data?.other_links).length === 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
                No links added yet. Click "Add Link" to get started.
              </div>
            )}
          </div>
        </div>
      </div>

      <div id="field-preferred_booking_methods">
        <div className="flex items-center gap-2 relative">
          <label className={labelClass}>Ways To Connects</label>
        </div>

        <div
          className={`mt-3 rounded-lg p-1 ${errors?.preferred_booking_methods ? "ring-1 ring-red-500" : ""}`}
          style={{ display: "flex", gap: "8px" }}
        >
          {[
            BOOKING_METHODS.LINK,
            BOOKING_METHODS.CALL,
            BOOKING_METHODS.INSTAGRAM,
          ].map((method) => (
            <label
              key={method}
              className="flex items-center gap-2 cursor-pointer m-0"
            >
              <input
                type="checkbox"
                checked={!!data.preferred_booking_methods?.includes(method)}
                onChange={(e) => {
                  setData((prev) => ({
                    ...prev,
                    preferred_booking_methods: e.target.checked
                      ? [...(prev.preferred_booking_methods || []), method]
                      : (prev.preferred_booking_methods || []).filter(
                        (m) => m !== method
                      ),
                  }));
                  clearError?.("preferred_booking_methods");
                }}
              />

              <span>
                {method === BOOKING_METHODS.LINK && "Go to Website"}
                {method === BOOKING_METHODS.CALL && "Call / Text"}
                {method === BOOKING_METHODS.INSTAGRAM && "DM on Instagram"}
              </span>
            </label>
          ))}
        </div>
        {errors?.preferred_booking_methods && (
          <p className="mt-1 text-sm text-red-500">
            {errors.preferred_booking_methods}
          </p>
        )}

        {data.preferred_booking_methods?.includes(BOOKING_METHODS.LINK) && (
          <div id="field-booking_link" className="mt-4">
            <label className={`${labelClass} m-0`}>
              Booking Link
            </label>
            <input
              type="url"
              className={`${inputClass} ${errors?.booking_link ? errorInputClass : ""}`}
              placeholder="https://yourwebsite.com"
              value={data.booking_link || data.website || ""}
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  booking_link: e.target.value,
                }));
                clearError?.("booking_link");
              }}
            />
            {errors?.booking_link && (
              <p className="mt-1 text-sm text-red-500">{errors.booking_link}</p>
            )}
          </div>
        )}
      </div>

      {/* Important Info */}
      <div className="space-y-3">
        <label className={`${labelClass} m-0`}>
          Important Information
        </label>
        {data.important_info?.length > 0 && (
          <div className="space-y-2">
            {data.important_info?.map((item, i) => (
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
            className="rounded-lg bg-gray-200 p-1 text-sm font-medium hover:bg-gray-300"
          >
            + Add
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesAndBookingForm;