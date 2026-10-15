import React from "react";
import { GlamCardFormData } from "../types";

interface SectionProps {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
}

const sectionClass =
  "space-y-6 rounded-xl border border-border bg-card p-4 sm:p-6";

const inputClass =
  "w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

const buttonClass =
  "flex-none sm:min-w-[120px] rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition";

const removeButtonClass =
  "flex-none text-destructive text-sm font-medium hover:underline";

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
      <div className="flex items-center justify-between gap-3">
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
          <p className="text-sm text-muted-foreground/80">
            No business hours added yet.
          </p>
        )}

        {businessHours.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 sm:gap-3"
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