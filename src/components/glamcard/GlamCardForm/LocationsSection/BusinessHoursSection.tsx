import React from "react";
import { GlamCardFormData } from "../types";

interface SectionProps {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
}

const sectionClass =
  "space-y-6 rounded-xl border border-gray-200 bg-white p-6";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200";

const buttonClass =
  "rounded-lg bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600";

const removeButtonClass =
  "text-red-500 text-sm font-medium hover:underline";

const BusinessHoursSection: React.FC<SectionProps> = ({
  data,
  setData,
}) => {
  const businessHours = data.business_hour || [];

  const handleAddNote = () => {
    setData((prev) => ({
      ...prev,
      business_hour: [...(prev.business_hour || []), { note: "" }],
    }));
  };

  const handleNoteChange = (index: number, value: string) => {
    const updated = [...businessHours];
    updated[index].note = value;

    setData((prev) => ({
      ...prev,
      business_hour: updated,
    }));
  };

  const handleRemoveNote = (index: number) => {
    const updated = businessHours.filter((_, i) => i !== index);

    setData((prev) => ({
      ...prev,
      business_hour: updated,
    }));
  };

  return (
    <section className={sectionClass}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Business Hours</h3>

        <button
          type="button"
          onClick={handleAddNote}
          className={buttonClass}
        >
          + Add
        </button>
      </div>

      <div className="space-y-4">
        {businessHours.length === 0 && (
          <p className="text-sm text-gray-400">
            No business hours added yet.
          </p>
        )}

        {businessHours.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="e.g. Mon-Fri: 10am - 7pm"
              className={inputClass}
              value={item.note || ""}
              onChange={(e) =>
                handleNoteChange(index, e.target.value)
              }
            />

            <button
              type="button"
              onClick={() => handleRemoveNote(index)}
              className={removeButtonClass}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BusinessHoursSection;