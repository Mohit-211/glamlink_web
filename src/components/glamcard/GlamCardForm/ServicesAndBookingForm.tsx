import React, { useState } from "react";
import { GlamCardFormData } from "./types";

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

const ServicesAndBookingForm: React.FC<Props> = ({ data, setData }) => {
  if (!data) return null;

  const [specialtyInput, setSpecialtyInput] = useState("");
  const [infoInput, setInfoInput] = useState("");

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

  return (
    <section className={sectionClass}>
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Services & Booking</h2>
        <p className="text-sm text-gray-500">
          Your specialties and how clients can reach you
        </p>
      </header>

      {/* Primary Specialty */}
      <div>
        <label className={labelClass}>Primary Specialty *</label>
        <input
          className={inputClass}
          placeholder="e.g. Hair Styling, Nails, Makeup..."
          value={data.primary_specialty || ""}
          onChange={(e) =>
            setData((prev) => ({ ...prev, primary_specialty: e.target.value }))
          }
        />
      </div>

      {/* Specialties */}
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
            className={`rounded-lg px-5 text-sm font-medium transition ${
              data.specialties.length >= 5 || !specialtyInput.trim()
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
          >
            + Add
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Max 5 specialties (showing your expertise)
        </p>

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
        <p className="mt-1 text-xs text-gray-500">
          Example: glamqueen_indore → glamlink.net/glamqueen_indore
        </p>
      </div>

      {/* Social Media */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Website</label>
          <input
            className={inputClass}
            placeholder="https://yourwebsite.com"
            value={data.website || ""}
            onChange={(e) =>
              setData((prev) => ({ ...prev, website: e.target.value }))
            }
          />
        </div>

        <div>
          <label className={labelClass}>Instagram</label>
          <input
            className={inputClass}
            placeholder="@yourusername or full URL"
            value={data.social_media?.instagram || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                social_media: {
                  ...prev.social_media,
                  instagram: formatInstagram(e.target.value),
                },
              }))
            }
          />
        </div>
      </div>

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

      {/* Preferred Booking Method */}
      <div>
        <label className={labelClass}>Preferred Booking Method</label>

        <select
          className={inputClass}
          value={data.preferred_booking_method || ""}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              preferred_booking_method: e.target.value,
              booking_link:
                e.target.value === "Go_to_Booking_Link"
                  ? prev.booking_link
                  : "",
            }))
          }
        >
          <option value="">Select booking method...</option>
          <option value="Go_to_Booking_Link">Go to Booking Link</option>
          {/* Add more options later if needed: WhatsApp, DM, Phone, etc. */}
        </select>

        <p className="mt-1 text-xs text-gray-500">
          How clients should book appointments with you
        </p>

        {data.preferred_booking_method === "Go_to_Booking_Link" && (
          <div className="mt-4">
            <label className={labelClass}>Booking Link</label>
            <input
              type="url"
              className={inputClass}
              placeholder="https://booksy.com/yourprofile or calendly.com/..."
              value={data.booking_link || ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  booking_link: e.target.value,
                }))
              }
            />
            <p className="mt-1 text-xs text-gray-500">
              Clients will be redirected here to book
            </p>
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
                  className="text-red-600 hover:text-red-800 text-xl "
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

        <p className="text-xs text-gray-500">
          Key details clients should know before contacting you
        </p>
      </div>
    </section>
  );
};

export default ServicesAndBookingForm;
