import React from "react";
import { GlamCardFormData, BusinessHour } from "../types";

interface SectionProps {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
}

const sectionClass = "space-y-6 rounded-xl border border-gray-200 bg-white p-6";
const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200";

const BusinessHoursSection: React.FC<SectionProps> = ({ data, setData }) => {
  const updateHour = (index: number, updates: Partial<BusinessHour>) => {
    setData((prev) => {
      const hours = [...prev.business_hour];
      hours[index] = { ...hours[index], ...updates };
      return { ...prev, business_hour: hours };
    });
  };

  return (
    <section className={sectionClass}>
      <h3 className="text-lg font-semibold">Business Hours</h3>

      {data.business_hour.map((hour, i) => (
        <div key={hour.day} className="flex items-center gap-4">
          <span className="w-24 font-medium">{hour.day}</span>

          <input
            type="time"
            className={inputClass}
            style={{ width: "140px" }}
            value={hour.open_time}
            onChange={(e) => updateHour(i, { open_time: e.target.value })}
          />

          <span className="text-gray-500">–</span>

          <input
            type="time"
            className={inputClass}
            style={{ width: "140px" }}
            value={hour.close_time}
            onChange={(e) => updateHour(i, { close_time: e.target.value })}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={hour.closed}
              onChange={(e) => updateHour(i, { closed: e.target.checked })}
            />
            Closed
          </label>
        </div>
      ))}
    </section>
  );
};

export default BusinessHoursSection;