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
  lat: undefined,
  lng: undefined,
  isSet: false,
  business_name: "",
  phone: "",
  description: "",
  isPrimary: index === 0,
  isOpen: true,
});

/* ================= COMPONENT ================= */

const BasicInfoForm: React.FC<Props> = ({ data, setData }) => {
  if (!data) return null;

  const updateHour = (index: number, updates: Partial<BusinessHour>) => {
    setData(prev => {
      const hours = [...prev.business_hour];
      hours[index] = { ...hours[index], ...updates };
      return { ...prev, business_hour: hours };
    });
  };

  const addLocation = () => {
    setData(prev => ({
      ...prev,
      locations: [...prev.locations, createEmptyLocation(prev.locations.length)],
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
        remaining[0].isPrimary = true;
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
              onChange={e => setData(p => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div>
            <label className={labelClass}>Professional Title *</label>
            <input
              className={inputClass}
              value={data.professional_title}
              onChange={e =>
                setData(p => ({ ...p, professional_title: e.target.value }))
              }
            />
          </div>

          <div>
            <label className={labelClass}>Email *</label>
            <input
              type="email"
              className={inputClass}
              value={data.email}
              onChange={e => setData(p => ({ ...p, email: e.target.value }))}
            />
          </div>

          <div>
            <label className={labelClass}>Phone *</label>
            <input
              className={inputClass}
              value={data.phone}
              onChange={e => setData(p => ({ ...p, phone: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Professional Bio</label>
            <CKEditor
              editor={ClassicEditor as any}
              data={data.bio}
              onChange={(_, editor) =>
                setData(p => ({ ...p, bio: editor.getData() }))
              }
            />
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className={sectionClass}>
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Business Locations *</h3>
          <span className="text-sm text-gray-500">
            ({data.locations.length} of 30)
          </span>
        </div>

        {data.locations.map((loc, index) => (
          <div key={loc.id} className="rounded-lg border overflow-hidden">

            {/* HEADER */}
            <div className="flex justify-between bg-yellow-50 px-4 py-3">
              <div>
                <p className="font-medium">
                  #{index + 1} {loc.label}
                  {loc.isPrimary && (
                    <span className="ml-2 rounded-full bg-yellow-200 px-2 text-xs">
                      ⭐ Primary
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {loc.address || "No address set"}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    updateLocation(loc.id, { isOpen: !loc.isOpen })
                  }
                >
                  {loc.isOpen ? "▲" : "▼"}
                </button>

                {data.locations.length > 1 && (
                  <button
                    onClick={() => removeLocation(loc.id)}
                    className="text-red-500"
                  >
                    🗑
                  </button>
                )}
              </div>
            </div>

            {/* BODY */}
            {loc.isOpen && (
              <div className="space-y-5 p-5">

                {/* TYPE */}
                <div className="flex gap-6">
                  <label>
                    <input
                      type="radio"
                      checked={loc.type === "exact"}
                      onChange={() =>
                        updateLocation(loc.id, { type: "exact" })
                      }
                    /> Exact Address
                  </label>

                  <label>
                    <input
                      type="radio"
                      checked={loc.type === "city"}
                      onChange={() =>
                        updateLocation(loc.id, { type: "city" })
                      }
                    /> City Only
                  </label>
                </div>

                {/* LABEL */}
                <input
                  className={inputClass}
                  value={loc.label}
                  onChange={e =>
                    updateLocation(loc.id, { label: e.target.value })
                  }
                />

                {/* EXACT ADDRESS */}
                {loc.type === "exact" && (
                  <>
                    <div className="flex gap-3">
                      <input
                        className={inputClass}
                        value={loc.address}
                        onChange={e =>
                          updateLocation(loc.id, { address: e.target.value })
                        }
                        placeholder="Start typing address..."
                      />
                      <button
                        className="rounded-lg bg-teal-500 px-4 text-white"
                        onClick={() =>
                          updateLocation(loc.id, {
                            isSet: true,
                            lat: 36.1699,
                            lng: -115.1398,
                            description: `Business location: ${loc.address}`,
                          })
                        }
                      >
                        Use Address
                      </button>
                    </div>

                    {loc.isSet && (
                      <>
                        <div className="rounded-lg bg-green-50 p-4 text-sm">
                          <p className="font-medium text-green-700">
                            ✔ Location Set
                          </p>
                          <p>{loc.address}</p>
                          <p className="text-xs">
                            Coordinates: {loc.lat}, {loc.lng}
                          </p>
                        </div>

                        <iframe
                          title="map"
                          height="200"
                          className="w-full rounded-lg border"
                          src={`https://maps.google.com/maps?q=${loc.lat},${loc.lng}&z=15&output=embed`}
                        />
                      </>
                    )}
                  </>
                )}

                {/* BUSINESS INFO */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className={inputClass}
                    placeholder="Business Name"
                    value={loc.business_name}
                    onChange={e =>
                      updateLocation(loc.id, {
                        business_name: e.target.value,
                      })
                    }
                  />

                  <input
                    className={inputClass}
                    placeholder="Phone"
                    value={loc.phone}
                    onChange={e =>
                      updateLocation(loc.id, { phone: e.target.value })
                    }
                  />
                </div>

                {/* DESCRIPTION */}
                <textarea
                  rows={3}
                  className={inputClass}
                  value={loc.description}
                  onChange={e =>
                    updateLocation(loc.id, {
                      description: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addLocation}
          className="w-full rounded-lg border border-dashed py-3"
        >
          + Add Location
        </button>
      </section>

      {/* BUSINESS HOURS */}
      <section className={sectionClass}>
        <h3 className="text-lg font-semibold">Business Hours</h3>

        {data.business_hour.map((hour, i) => (
          <div key={hour.day} className="flex gap-4">
            <span className="w-24">{hour.day}</span>
            <input
              type="time"
              className={inputClass}
              value={hour.open_time}
              onChange={e => updateHour(i, { open_time: e.target.value })}
            />
            <input
              type="time"
              className={inputClass}
              value={hour.close_time}
              onChange={e => updateHour(i, { close_time: e.target.value })}
            />
            <label>
              <input
                type="checkbox"
                checked={hour.closed}
                onChange={e => updateHour(i, { closed: e.target.checked })}
              /> Closed
            </label>
          </div>
        ))}
      </section>
    </div>
  );
};

export default BasicInfoForm;
