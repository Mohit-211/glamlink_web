import React, { useState } from "react";
import BasicInfoForm from "./BasicInfoForm";
import MediaAndProfileForm from "./MediaAndProfileForm";
import ServicesAndBookingForm from "./ServicesAndBookingForm";
import GlamlinkIntegrationForm from "./GlamlinkIntegrationForm";
import SuccessModal from "@/components/SuccessModal";
import { GlamCardFormData } from "./types";

/* ================= TYPES ================= */




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

      const res = await fetch(
        "https://node.glamlink.net:5000/api/v1/businessCard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
console.log(res,"res")
      if (!res.ok) {
        throw new Error("Failed to create GlamCard");
      }

      await res.json();
      setShowSuccess(true); // ✅ OPEN MODAL
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

      {/* ✅ SUCCESS MODAL */}
      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
      
    </>
  );
};

export default GlamCardForm;
