import React, { useState } from "react";
import { GlamCardFormData } from "./types";

interface Props {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
}

const sectionClass =
  "space-y-6 rounded-xl border border-gray-200 bg-white p-6";
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

    setData(prev => ({
      ...prev,
      specialties: [...prev.specialties, specialtyInput.trim()],
    }));
    setSpecialtyInput("");
  };

  const removeSpecialty = (index: number) => {
    setData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  };

  const addInfo = () => {
    if (!infoInput.trim()) return;
    setData(prev => ({
      ...prev,
      important_info: [...prev.important_info, infoInput.trim()],
    }));
    setInfoInput("");
  };

  const removeInfo = (index: number) => {
    setData(prev => ({
      ...prev,
      important_info: prev.important_info.filter((_, i) => i !== index),
    }));
  };
const formatInstagram = (value: string) => {
  if (!value) return "";
  if (value.startsWith("http")) return value;
  return `https://instagram.com/${value.replace("@", "")}`;
};

const formatTikTok = (value: string) => {
  if (!value) return "";
  if (value.startsWith("http")) return value;
  return `https://tiktok.com/@${value.replace("@", "")}`;
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
          placeholder="Hair Styling, Nails, Makeup, etc."
          value={data.primary_specialty}
          onChange={e =>
            setData(prev => ({ ...prev, primary_specialty: e.target.value }))
          }
        />
      </div>

      {/* Specialties */}
      <div className="space-y-2">
        <label className={labelClass}>Specialties</label>

        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="e.g., Balayage, Keratin Treatments"
            value={specialtyInput}
            onChange={e => setSpecialtyInput(e.target.value)}
          />
          <button
            type="button"
            onClick={addSpecialty}
            className="rounded-lg bg-gray-200 px-4 text-sm font-medium hover:bg-gray-300"
          >
            + Add
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Maximum 5 specialties showcasing your expertise
        </p>

        <div className="flex flex-wrap gap-2">
          {data.specialties.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700"
            >
              {item}
              <button
                type="button"
                onClick={() => removeSpecialty(i)}
                className="text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Custom Handle */}
      <div>
        <label className={labelClass}>Claim Your Custom Handle</label>
        <input
          className={inputClass}
          placeholder="This will be used for your Glamlink Profile"
          value={data.custom_handle}
          onChange={e =>
            setData(prev => ({ ...prev, custom_handle: e.target.value }))
          }
        />
      </div>

      {/* Website + Instagram */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Website</label>
          <input
            className={inputClass}
            placeholder="https://yourwebsite.com"
            value={data.website}
            onChange={e =>
              setData(prev => ({ ...prev, website: e.target.value }))
            }
          />
        </div>

       <div>
  <label className={labelClass}>Instagram</label>
  <input
    className={inputClass}
    placeholder="@yourusername or full URL"
    value={data.social_media.instagram || ""}
    onChange={e =>
      setData(prev => ({
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

      {/* TikTok */}
     <div>
  <label className={labelClass}>TikTok</label>
  <input
    className={inputClass}
    placeholder="@yourusername or full URL"
    value={data.social_media.tiktok || ""}
    onChange={e =>
      setData(prev => ({
        ...prev,
        social_media: {
          ...prev.social_media,
          tiktok: formatTikTok(e.target.value),
        },
      }))
    }
  />
</div>


      {/* Booking Method */}
      <div>
        <label className={labelClass}>Preferred Booking Method</label>
        <select
          className={inputClass}
          value={data.preferred_booking_method}
          onChange={e =>
            setData(prev => ({ ...prev, preferred_booking_method: e.target.value }))
          }
        >
          <option value="">Select booking method...</option>
          <option value="dm">Instagram / DM</option>
          <option value="website">Website Booking</option>
          <option value="phone">Phone / Text</option>
          <option value="third-party">Third-party App</option>
        </select>

        <p className="mt-1 text-xs text-gray-500">
          How clients should book appointments with you
        </p>
      </div>

      {/* Important Info */}
      <div className="space-y-2">
        <label className={labelClass}>Important Info</label>

        {data.important_info.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input className={inputClass} value={item} disabled />
            <button
              type="button"
              onClick={() => removeInfo(i)}
              className="text-red-500"
            >
              ×
            </button>
          </div>
        ))}

        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="e.g., By appointment only"
            value={infoInput}
            onChange={e => setInfoInput(e.target.value)}
          />
          <button
            type="button"
            onClick={addInfo}
            className="rounded-lg bg-gray-200 px-4 text-sm font-medium hover:bg-gray-300"
          >
            + Add
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Key information clients should know
        </p>
      </div>
    </section>
  );
};

export default ServicesAndBookingForm;
