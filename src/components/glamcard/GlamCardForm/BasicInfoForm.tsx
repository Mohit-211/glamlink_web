import React from "react";
import { nanoid } from "nanoid";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  GlamCardFormData,
  BusinessHour,
  Location as BusinessLocation,
} from "./types";

/* ================= PROPS ================= */

interface Props {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
}

/* ================= STYLES ================= */

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm " +
  "text-gray-900 placeholder-gray-400 transition " +
  "focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200";

const labelClass = "text-sm font-medium text-gray-700";
const sectionClass =
  "space-y-6 rounded-xl border border-gray-200 bg-white p-6";

/* ================= HELPERS ================= */

const createEmptyLocation = (index: number): BusinessLocation => ({
  id: nanoid(),
  label: `Location ${index + 1}`,
  type: "exact",
  address: "",
  city: "",
  state: "",
  business_name: "",
  phone: "",
  description: "",
  isPrimary: index === 0,
  isOpen: true,
});

/* ================= COMPONENT ================= */

const BasicInfoForm: React.FC<Props> = ({ data, setData }) => {
  if (!data) return null;

  const updateHour = (
    index: number,
    updates: Partial<BusinessHour>
  ) => {
    setData(prev => {
      const hours = [...prev.business_hours];
      hours[index] = { ...hours[index], ...updates };
      return { ...prev, business_hours: hours };
    });
  };

  const addLocation = () => {
    setData(prev => ({
      ...prev,
      locations: [
        ...prev.locations,
        createEmptyLocation(prev.locations.length),
      ],
    }));
  };

  const updateLocation = (
    id: string,
    updates: Partial<BusinessLocation>
  ) => {
    setData(prev => ({
      ...prev,
      locations: prev.locations.map(loc =>
        loc.id === id ? { ...loc, ...updates } : loc
      ),
    }));
  };

  const removeLocation = (id: string) => {
    setData(prev => {
      let remaining = prev.locations.filter(l => l.id !== id);

      if (remaining.length && !remaining.some(l => l.isPrimary)) {
        remaining = remaining.map((l, i) =>
          i === 0 ? { ...l, isPrimary: true } : l
        );
      }

      return { ...prev, locations: remaining };
    });
  };

  return (
    <div className="space-y-10">
      {/* BASIC INFO */}
      <section className={sectionClass}>
        <h2 className="text-lg font-semibold">Basic Information</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Full Name *</label>
            <input
              className={inputClass}
              value={data.name}
              onChange={e =>
                setData(prev => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div>
            <label className={labelClass}>Professional Title *</label>
            <input
              className={inputClass}
              value={data.professional_title}
              onChange={e =>
                setData(prev => ({
                  ...prev,
                  professional_title: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className={labelClass}>Email *</label>
            <input
              type="email"
              className={inputClass}
              value={data.email}
              onChange={e =>
                setData(prev => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          <div>
            <label className={labelClass}>Phone *</label>
            <input
              className={inputClass}
              value={data.phone}
              onChange={e =>
                setData(prev => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Professional Bio</label>
            <div className="rounded-lg border border-gray-300 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-200">
              <CKEditor
                editor={ClassicEditor as any}
                data={data.bio}
                onChange={(_, editor) =>
                  setData(prev => ({
                    ...prev,
                    bio: editor.getData(),
                  }))
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className={sectionClass}>
        <h3 className="text-lg font-semibold">Business Locations *</h3>

        <div className="space-y-4">
          {data.locations.map((loc, index) => (
            <div key={loc.id} className="rounded-lg border bg-white">
              <button
                type="button"
                onClick={() =>
                  updateLocation(loc.id, { isOpen: !loc.isOpen })
                }
                className="flex w-full justify-between bg-yellow-50 px-4 py-3 text-left"
              >
                <div className="font-medium">
                  #{index + 1} {loc.label}
                  {loc.isPrimary && (
                    <span className="ml-2 rounded-full bg-yellow-200 px-2 py-0.5 text-xs">
                      ⭐ Primary
                    </span>
                  )}
                </div>
              </button>

              {loc.isOpen && (
                <div className="space-y-5 p-4">
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        checked={loc.type === "exact"}
                        onChange={() =>
                          updateLocation(loc.id, { type: "exact" })
                        }
                      />
                      Exact Address
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        checked={loc.type === "city"}
                        onChange={() =>
                          updateLocation(loc.id, { type: "city" })
                        }
                      />
                      City Only
                    </label>
                  </div>

                  {data.locations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLocation(loc.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete location
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addLocation}
          className="mt-4 w-full rounded-lg border border-dashed py-3 text-sm font-medium hover:bg-gray-50"
        >
          + Add Location
        </button>
      </section>

      {/* BUSINESS HOURS */}
      <section className={sectionClass}>
        <h3 className="text-lg font-semibold">Business Hours</h3>

        <div className="space-y-3">
          {data.business_hours.map((hour, i) => (
            <div
              key={hour.day}
              className="flex items-center gap-4 rounded-lg bg-gray-50 p-4"
            >
              <span className="w-24 font-medium">{hour.day}</span>

              <input
                type="time"
                className={inputClass}
                value={hour.open_time}
                onChange={e =>
                  updateHour(i, { open_time: e.target.value })
                }
              />

              <input
                type="time"
                className={inputClass}
                value={hour.close_time}
                onChange={e =>
                  updateHour(i, { close_time: e.target.value })
                }
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BasicInfoForm;
