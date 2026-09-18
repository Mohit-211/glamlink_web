import React, { useState, useEffect, useRef, useCallback } from "react";
import { nanoid } from "nanoid";
import { GripVertical, ImagePlus, X } from "lucide-react";
import { BOOKING_METHODS, BookingMethod, FeaturedLink, FieldErrors, GlamCardFormData } from "./types";
import { userSpecialtiesApi } from "@/api/Api";

interface Props {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
  errors?: FieldErrors;
  clearError?: (key: string) => void;
  /** Needed to persist a Featured Links reorder immediately via its own endpoint (edit mode only). */
  mode?: "create" | "edit";
  cardId?: string | number;
}

const sectionClass = "space-y-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6";
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

const parseFeaturedLinks = (value: any): FeaturedLink[] => {
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
  mode,
  cardId,
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

  const updateInfo = (index: number, value: string) => {
    setData((prev) => ({
      ...prev,
      important_info: prev.important_info?.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  /* ================= FORMATTERS ================= */
  const formatInstagram = (value: string) => {
    if (!value.trim()) return "";
    if (value.startsWith("http")) return value.trim();
    const clean = value.replace(/^@/, "").trim();
    return `https://www.instagram.com/${clean}`;
  };

  const formatSocialLink = (value: string, domain: string) => {
    if (!value.trim()) return "";
    if (value.startsWith("http")) return value.trim();
    const clean = value.replace(/^@/, "").trim();
    return `https://${domain}/${clean}`;
  };

  const formatTikTok = (value: string) => formatSocialLink(value, "www.tiktok.com");
  const formatLinkedIn = (value: string) => formatSocialLink(value, "linkedin.com/in");
  const formatYouTube = (value: string) => formatSocialLink(value, "youtube.com");
  const formatFacebook = (value: string) => formatSocialLink(value, "facebook.com");

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
      social_media: { ...prev.social_media, [key]: formatInstagram(value) },
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

  /* ================= FEATURED LINKS ================= */
  // Object-URL previews for pending (not-yet-uploaded) thumbnail files, keyed
  // by link id. Regenerated/revoked whenever the featured_links array changes
  // so blob URLs don't leak as thumbnails are added, replaced, or removed.
  const [featuredLinkPreviews, setFeaturedLinkPreviews] = useState<Record<string, string>>({});
  useEffect(() => {
    const links = parseFeaturedLinks(data.featured_links);
    const next: Record<string, string> = {};
    links.forEach((link) => {
      if (link.thumbnail_file instanceof File) {
        next[link.id] = URL.createObjectURL(link.thumbnail_file);
      }
    });
    setFeaturedLinkPreviews(next);
    return () => {
      Object.values(next).forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.featured_links]);

  const [draggedFeaturedLinkIndex, setDraggedFeaturedLinkIndex] = useState<number | null>(null);

  const addFeaturedLink = () => {
    setData((prev) => {
      const links = parseFeaturedLinks(prev.featured_links);
      return {
        ...prev,
        featured_links: [
          ...links,
          { id: nanoid(), title: "", url: "", sort_order: links.length },
        ],
      };
    });
  };

  const removeFeaturedLink = (index: number) => {
    setData((prev) => ({
      ...prev,
      featured_links: parseFeaturedLinks(prev.featured_links)
        .filter((_, i) => i !== index)
        .map((link, i) => ({ ...link, sort_order: i })),
    }));
  };

  const updateFeaturedLink = (index: number, field: "title" | "url", value: string) => {
    setData((prev) => {
      const updated = [...parseFeaturedLinks(prev.featured_links)];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, featured_links: updated };
    });
  };

  const setFeaturedLinkThumbnail = (index: number, file: File) => {
    setData((prev) => {
      const updated = [...parseFeaturedLinks(prev.featured_links)];
      updated[index] = { ...updated[index], thumbnail_file: file };
      return { ...prev, featured_links: updated };
    });
  };

  const removeFeaturedLinkThumbnail = (index: number) => {
    setData((prev) => {
      const updated = [...parseFeaturedLinks(prev.featured_links)];
      updated[index] = {
        ...updated[index],
        thumbnail_file: undefined,
        image: undefined,
        thumbnail_url: undefined,
        image_url: undefined,
      };
      return { ...prev, featured_links: updated };
    });
  };

  // Only one link can be featured-first at a time — setting it clears the flag
  // on every other link; clicking the active one again un-sets it.
  const toggleFeaturedLinkFeatured = (index: number) => {
    setData((prev) => {
      const links = parseFeaturedLinks(prev.featured_links);
      const nextValue = !links[index]?.is_featured;
      return {
        ...prev,
        featured_links: links.map((link, i) => ({
          ...link,
          is_featured: i === index ? nextValue : false,
        })),
      };
    });
  };

  // Persists a new order immediately via the dedicated reorder endpoint —
  // only meaningful in edit mode, once the card already exists server-side.
  // In create mode there's nothing to reorder yet; the final order still
  // goes out with the rest of the data on submit via buildFormData.
  const persistFeaturedLinksOrder = async (links: FeaturedLink[]) => {
    if (mode !== "edit" || !cardId) return;
    try {
      const token = localStorage.getItem("GlamlinkaccessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      // This endpoint only accepts PUT + a real JSON body — it does not
      // parse a multipart "featured_links" field as JSON the way the main
      // create/update endpoint does, and it has no way to accept new image
      // files at all (confirmed directly against the API). So a pending,
      // not-yet-uploaded thumbnail_file is irrelevant here — always send
      // whatever image URL is already live on the server for that link;
      // the new file only goes out — via featured_link_images — on the
      // next full "Save Changes" submit (see buildFormData in
      // GlamCardForm.tsx).
      await fetch(`${API_URL}businessCard/${cardId}/featured-links/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token || "",
        },
        body: JSON.stringify({
          featured_links: links
            .filter((link) => link?.url?.trim())
            .map((link, index) => ({
              title: link?.title?.trim() || "",
              url: link.url.trim(),
              image: link?.image ?? link?.thumbnail_url ?? link?.image_url ?? null,
              is_featured: link?.is_featured === true,
              sort_order: index + 1,
            })),
        }),
      });
    } catch (err) {
      // Non-fatal — the order still saves with the rest of the form on
      // submit, so a transient failure here just means it isn't
      // reflected on the live card until then.
      console.error("Failed to persist featured links order:", err);
    }
  };

  const reorderFeaturedLinks = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setData((prev) => {
      const links = [...parseFeaturedLinks(prev.featured_links)];
      const [moved] = links.splice(fromIndex, 1);
      links.splice(toIndex, 0, moved);
      const reordered = links.map((link, i) => ({ ...link, sort_order: i }));
      persistFeaturedLinksOrder(reordered);
      return { ...prev, featured_links: reordered };
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
          <div className="relative min-w-0 flex-1">
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
            className={`rounded-lg px-5 text-sm font-medium transition ${data.specialties.length >= 5 ||
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
                className="text-xs text-[#24bbcb] hover:underline font-medium"
              >
                + Add Instagram
              </button>
            </div>
            <div className="space-y-2">
              {getHandles().map((value, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                  <span className="text-xs text-gray-400 w-full sm:w-24 sm:shrink-0">
                    {idx === 0 ? "Instagram" : `Instagram ${idx}`}
                  </span>
                  <input
                    className={`${inputClass} min-w-0 flex-1 ${idx === 0 && errors?.instagram ? errorInputClass : ""}`}
                    placeholder="@yourusername or full URL"
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
              className={inputClass}
              placeholder="@yourprofile or full URL"
              value={data.social_media?.linkedin || ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  social_media: {
                    ...prev.social_media,
                    linkedin: formatLinkedIn(e.target.value),
                  },
                }))
              }
            />
          </div>

          {/* YouTube */}
          <div>
            <label className={labelClass}>YouTube</label>
            <input
              className={inputClass}
              placeholder="@yourchannel or full URL"
              value={data.social_media?.youtube || ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  social_media: {
                    ...prev.social_media,
                    youtube: formatYouTube(e.target.value),
                  },
                }))
              }
            />
          </div>

          {/* Facebook */}
          <div>
            <label className={labelClass}>Facebook</label>
            <input
              className={inputClass}
              placeholder="@yourpage or full URL"
              value={data.social_media?.facebook || ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  social_media: {
                    ...prev.social_media,
                    facebook: formatFacebook(e.target.value),
                  },
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
              className="flex-none rounded-lg bg-[#24bbcb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f9aa3]"
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
                      className={`${inputClass} min-w-0 flex-1`}
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

      {/* Featured Links */}
      <div className="space-y-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-semibold text-gray-800">Featured Links</label>
            <p className="mt-1 text-xs text-gray-500">
              Shop your favorites, promote a package, or share anything else you want
              clients to find fast — shown as clickable cards on your Access page.
            </p>
          </div>
          <button
            type="button"
            onClick={addFeaturedLink}
            className="flex-none rounded-lg bg-[#23AEB8] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f9aa3]"
          >
            + Add Featured Link
          </button>
        </div>
        <div className="space-y-3">
          {parseFeaturedLinks(data?.featured_links).map((link, index) => {
            const previewSrc =
              featuredLinkPreviews[link.id] || link.image || link.thumbnail_url || link.image_url;
            return (
              <div
                key={link.id}
                draggable
                onDragStart={() => setDraggedFeaturedLinkIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedFeaturedLinkIndex !== null) {
                    reorderFeaturedLinks(draggedFeaturedLinkIndex, index);
                  }
                  setDraggedFeaturedLinkIndex(null);
                }}
                onDragEnd={() => setDraggedFeaturedLinkIndex(null)}
                className={`flex flex-col gap-2 rounded-lg border bg-white p-3 ${link.is_featured ? "border-[#23AEB8] ring-1 ring-[#23AEB8]/30" : "border-gray-200"
                  }`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className="mt-3 cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
                    title="Drag to reorder"
                  >
                    <GripVertical className="h-4 w-4" />
                  </span>

                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    {previewSrc ? (
                      <img src={previewSrc} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <ImagePlus className="h-5 w-5" />
                      </div>
                    )}
                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 opacity-0 transition hover:bg-black/40 hover:opacity-100">
                      <ImagePlus className="h-4 w-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setFeaturedLinkThumbnail(index, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {previewSrc && (
                      <button
                        type="button"
                        onClick={() => removeFeaturedLinkThumbnail(index)}
                        title="Remove thumbnail"
                        className="absolute -right-1 -top-1 rounded-full bg-white p-0.5 text-gray-500 shadow hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* Everything to the right of the drag handle/thumbnail lives in
                      one column, so the URL field and checkbox line up with the
                      title input above them instead of needing a guessed margin. */}
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className={`${inputClass} flex-1 min-w-0`}
                        placeholder="Title (e.g. Shop My Skincare Favorites)"
                        value={link.title}
                        onChange={(e) => updateFeaturedLink(index, "title", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeFeaturedLink(index)}
                        className="flex-none rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                    <input
                      type="url"
                      className={inputClass}
                      placeholder="https://example.com/shop"
                      value={link.url}
                      onChange={(e) => updateFeaturedLink(index, "url", e.target.value)}
                    />
                    <label className="flex w-fit cursor-pointer items-center gap-1.5 text-xs font-medium text-gray-600 select-none">
                      <input
                        type="checkbox"
                        checked={!!link.is_featured}
                        onChange={() => toggleFeaturedLinkFeatured(index)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-[#23AEB8] focus:ring-[#23AEB8]"
                      />
                      Feature this link first
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
          {parseFeaturedLinks(data?.featured_links).length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
              No featured links yet. Click "Add Featured Link" to get started.
            </div>
          )}
        </div>
      </div>

    

      <div id="field-preferred_booking_methods">
        <div className="flex items-center gap-2 relative">
          <label className={labelClass}>Ways To Connects</label>
        </div>

        <div
          className={`mt-3 rounded-lg p-1 ${errors?.preferred_booking_methods ? "ring-1 ring-red-500" : ""}`}
          style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }}
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
                  className={inputClass}
                  placeholder="e.g. By appointment only • Cash/Card accepted"
                  value={item}
                  onChange={(e) => updateInfo(i, e.target.value)}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addInfo();
              }
            }}
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