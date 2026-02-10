import React, { useState } from "react";

import SuccessModal from "@/components/SuccessModal";
import { GlamCardFormData } from "./types";
import BasicInfoForm from "./BasicInfoForm";
import MediaAndProfileForm from "../MediaAndProfileForm";
import GlamlinkIntegrationForm from "./GlamlinkIntegrationForm";
import ServicesAndBookingForm from "./ServicesAndBookingForm";

interface Props {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
}

const GlamCardForm: React.FC<Props> = ({ data, setData }) => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    console.log("FINAL DATA 👉", data);

    try {
      setLoading(true);

      const formData = new FormData();

      /* ================= PROFILE IMAGE ================= */
      if (data.profile_image) {
        formData.append("profile_image", data.profile_image);
      }

      /* ================= GALLERY IMAGES ================= */
      data.images?.forEach(file => {
        formData.append("images", file);
      });

      /* ================= GALLERY META ================= */
      if (data.gallery_meta?.length) {
        formData.append(
          "gallery_meta",
          JSON.stringify(
            data.gallery_meta.map(({ caption, is_thumbnail, sort_order }) => ({
              caption,
              is_thumbnail,
              sort_order,
            }))
          )
        );
      }

      /* ================= STRINGIFY OBJECTS / ARRAYS ================= */
      const jsonFields = [
        "business_hour",
        "social_media",
        "important_info",
        "excites_about_glamlink",
        "biggest_pain_points",
        "specialties",
        "locations"
      ] as const;

      jsonFields.forEach(field => {
        const value = data[field];
        if (value !== undefined) {
          formData.append(field, JSON.stringify(value));
        }
      });

      /* ================= PRIMITIVE FIELDS ================= */
      const primitiveFields = [
        "name",
        "email",
        "phone",
        "business_name",
        "professional_title",
        "bio",
        "preferred_booking_method",
        "booking_link",
        "offer_promotion",
        "elite_setup",
      ] as const;

      primitiveFields.forEach(field => {
        const value = data[field];
        if (value !== undefined && value !== null) {
          formData.append(field, String(value));
        }
      });

      const res = await fetch(
        "https://node.glamlink.net:5000/api/v1/businessCard",
        {
          method: "POST",
          body: formData, // ✅ DO NOT set Content-Type
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create GlamCard");
      }

      await res.json();
      setShowSuccess(true);
    } catch (error) {
      console.error("ERROR 👉", error);
      alert("Failed to create Business Card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-[calc(90dvh)] overflow-y-auto pr-3">
        <div className="space-y-10">
          <BasicInfoForm data={data} setData={setData} />
          <MediaAndProfileForm data={data} setData={setData} />
          <ServicesAndBookingForm data={data} setData={setData} />
          <GlamlinkIntegrationForm data={data} setData={setData} />

          <div
            className="mt-10 rounded-full text-sm font-semibold text-white shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #23aeb8 0%, #53bec6 50%, #5cc2d6 100%)",
            }}
          >
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Business Card"}
            </button>
          </div>
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
};

export default GlamCardForm;
