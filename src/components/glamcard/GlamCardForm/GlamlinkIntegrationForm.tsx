import React from "react";
import { GlamCardFormData } from "./types";

interface Props {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
}

const sectionClass =
  "space-y-6 rounded-xl border border-gray-200 bg-white p-6";

const labelClass = "text-sm font-medium text-gray-700";

const excitementOptions = [
  "Clients ability to discover pros nearby and check out their services, work, reviews, etc",
  "Seamless booking inside Glamlink either in app or goes directly to your booking link",
  "Pro shops & e-commerce",
  "The Glamlink Edit magazine & spotlights",
  "AI powered discovery & smart recommendations (coming soon)",
  "Community & networking with other pros",
];

const painPointOptions = [
  "Posting but no conversions",
  "DMs - too much back and forth",
  "No shows",
  "Juggling too many platforms (booking, social media, e-commerce, etc)",
  "Inventory/aftercare not tied to treatments",
  "Client notes/consents all over the place",
  "Finding new clients",
  "None of the above",
];

const GlamlinkIntegrationForm: React.FC<Props> = ({ data, setData }) => {
  if (!data) return null;

  const toggleArrayValue = (
    key: "excites_about_glamlink" | "biggest_pain_points",
    value: string
  ) => {
    setData(prev => {
      const arr = prev[key] || [];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value],
      };
    });
  };

  return (
    <section className={sectionClass}>
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Glamlink Integration</h2>
        <p className="text-sm text-gray-500">
          Help us understand your needs and how we can best support your business
        </p>
      </header>

      {/* ================= EXCITEMENT ================= */}
      <div className="space-y-3">
        <label className={labelClass}>
          What excites you about Glamlink? *
          <span className="ml-1 text-xs text-gray-400">(Select at least 1)</span>
        </label>

        <div className="space-y-2">
          {excitementOptions.map(item => (
            <label
              key={item}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={data?.excites_about_glamlink?.includes(item)}
                onChange={() =>
                  toggleArrayValue("excites_about_glamlink", item)
                }
              />
              {item}
            </label>
          ))}
        </div>

        {data?.excites_about_glamlink?.length === 0 && (
          <div className="rounded-md bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
            Minimum 1 selection required
          </div>
        )}
      </div>

      {/* ================= PAIN POINTS ================= */}
      <div className="space-y-3">
        <label className={labelClass}>
          Biggest pain points *
          <span className="ml-1 text-xs text-gray-400">(Select at least 1)</span>
        </label>

        <div className="grid gap-2 sm:grid-cols-2">
          {painPointOptions.map(item => (
            <label
              key={item}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={data?.biggest_pain_points?.includes(item)}
                onChange={() =>
                  toggleArrayValue("biggest_pain_points", item)
                }
              />
              {item}
            </label>
          ))}
        </div>

        {data?.biggest_pain_points?.length === 0 && (
          <div className="rounded-md bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
            Minimum 1 selection required
          </div>
        )}
      </div>

      {/* ================= PROMOTION ================= */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={data.offer_promotion}
          onChange={e =>
            setData(prev => ({
              ...prev,
              offer_promotion: e.target.checked,
            }))
          }
        />
        I would like to offer a promotion with my digital card
      </label>

      {/* ================= ELITE SETUP ================= */}
      <label className="flex items-start gap-2 rounded-lg border border-gray-300 p-4 text-sm">
        <input
          type="checkbox"
          checked={data.elite_setup}
          onChange={e =>
            setData(prev => ({
              ...prev,
              elite_setup: e.target.checked,
            }))
          }
        />
        <span>
          <strong>The Elite Setup (Recommended):</strong> I agree to let the
          Glamlink Concierge Team build my professional profile and digital
          business card using my existing public social media content. We'll
          curate your first clips, photo albums, and service menu so you can
          launch instantly.
        </span>
      </label>
    </section>
  );
};

export default GlamlinkIntegrationForm;
