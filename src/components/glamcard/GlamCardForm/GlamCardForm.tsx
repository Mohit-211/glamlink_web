import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import SuccessModal from "@/components/SuccessModal";
import { GlamCardFormData } from "./types";
import BasicInfoForm from "./BasicInfoForm";
import MediaAndProfileForm from "../MediaAndProfileForm";
import GlamlinkIntegrationForm from "./GlamlinkIntegrationForm";
import ServicesAndBookingForm from "./ServicesAndBookingForm";
import { useRouter } from "next/navigation";
interface Props {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
}
const FORM_STORAGE_KEY = "glamcard_form_draft";
const GlamCardForm: React.FC<Props> = ({ data, setData }) => {

const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // Restore form data from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem(
      FORM_STORAGE_KEY
    );
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setData(parsed);
        localStorage.removeItem(FORM_STORAGE_KEY);
      } catch (error) {
        console.error(error);
      }
    }
  }, [setData]);
  const DEMO_VALUES = {
    name: "Sophia Martinez",
    professional_title: "Master Hair Stylist & Colorist",
    email: "sophia@luxebeauty.com",
    phone: "123-456-7890",
    booking_phone: "123-456-7890",
    business_name: "Luxe Beauty Studio",
    primary_specialty: "Hair Styling & Color",
    custom_handle: "luxebeauty",
    website: "https://luxebeauty.com",
  };
  const checkAuthAndSubmit = () => {
    const token = localStorage.getItem("GlamlinkaccessToken");

    if (!token) {
      Modal.confirm({
        title: "Login Required",
        content:
          "Please login first to create your GlamCard and save your business profile.",
        okText: "Login Now",
        cancelText: "Cancel",
        centered: true,
        onOk: () => {
          handleLogin();
        },
      });

      return;
    }

    handleSubmit();
  };
  const handleLogin = () => {
    localStorage.setItem(
      FORM_STORAGE_KEY,
      JSON.stringify(data)
    );

    localStorage.setItem(
      "postLoginRedirect",
      "/apply/digital-card"
    );

    window.location.href = "/login";
  };
  const handleSubmit = async () => {
    console.log("FINAL DATA 👉", data);
    /* ================= REQUIRED VALIDATION ================= */
    if (!data.name?.trim()) {
      alert("Please enter your Name");
      return;
    }
    if (!data.professional_title?.trim()) {
      alert("Please enter your Professional Title");
      return;
    }
    if (!data.email?.trim()) {
      alert("Please enter your Email");
      return;
    }
    if (!data.phone?.trim()) {
      alert("Please enter your Phone Number");
      return;
    }
    if (!data.business_name?.trim()) {
      alert("Please enter your Business Name");
      return;
    }
    if (!data.bio?.trim()) {
      alert("Please enter your Bio");
      return;
    }
    if (!data.primary_specialty?.trim()) {
      alert("Please select your Primary Specialty");
      return;
    }
    if (!data.custom_handle?.trim()) {
      alert("Please enter your Custom Handle");
      return;
    }
    if (!data.website?.trim()) {
      alert("Please enter your Website");
      return;
    }
    if (!Array.isArray(data.preferred_booking_methods) || data.preferred_booking_methods.length === 0) {
      alert("Please select Preferred Booking Method");
      return;
    }
    if (!data.profile_image) {
      alert("Please upload Profile Image");
      return;
    }
    if (!data.images?.length) {
      alert("Please upload Gallery Images");
      return;
    }
    if (!data.specialties?.length) {
      alert("Please add at least one Specialty");
      return;
    }
    if (!data.locations?.length) {
      alert("Please add a Location");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      if (data.profile_image) {
        formData.append("profile_image", data.profile_image);
      }
      data.images?.forEach((file) => {
        if (file instanceof File && file.type.startsWith("video/")) return;
        formData.append("images", file);
      });
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
      const videoItems = data.images
        ?.map((file, index) => ({
          file,
          meta: data.gallery_meta?.[index],
          index,
        }))
        .filter(({ file }) => file instanceof File && file.type.startsWith("video/"));
      for (const { meta, index } of videoItems ?? []) {
        if (!meta?.thumbnail_file) {
          alert(`Please upload a thumbnail for video #${index + 1}.`);
          setLoading(false);
          return;
        }
      }
      videoItems?.forEach(({ file, meta }) => {
        formData.append("videos", file);
        formData.append("video_thumbnails", meta!.thumbnail_file!);
      });
      if (data.social_media) {
        formData.append("social_media", JSON.stringify(data.social_media));
      }
      const jsonFields = [
        "business_hour",
        "other_links",
        "important_info",
        "excites_about_glamlink",
        "biggest_pain_points",
        "specialties",
        "locations",
      ] as const;
      jsonFields.forEach((field) => {
        const value = data[field];
        if (value !== undefined) {
          formData.append(field, JSON.stringify(value));
        }
      });
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
        "primary_specialty",
        "custom_handle",
        "website",
        "promotion_details",
      ] as const;
      primitiveFields.forEach((field) => {
        const value = data[field];
        if (value !== undefined && value !== null) {
          formData.append(field, String(value));
        }
      });
      formData.append("is_phone_visible", String(data.is_phone_visible ?? true));
      const token = localStorage.getItem("GlamlinkaccessToken");
      const res = await fetch("https://node.glamlink.net:5000/api/v1/businessCard/createBusinessCard", {
        method: "POST",
        headers: {
          "x-access-token": token || "",
          role_id: String(7),
        },
        body: formData,
      });
  if (!res.ok) {
  throw new Error("Failed to create GlamCard");
}

await res.json();

setShowSuccess(true);

setTimeout(() => {
  router.push("/dashboard");
}, 2000);
    } catch (error) {
      console.error("ERROR 👉", error);
      alert("Failed to create Business Card");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>

      <div className="h-[90dvh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="space-y-10 pb-6">
          <BasicInfoForm data={data} setData={setData} />

          <MediaAndProfileForm
            data={data}
            setData={setData}
          />

          <ServicesAndBookingForm
            data={data}
            setData={setData}
          />

          <GlamlinkIntegrationForm
            data={data}
            setData={setData}
          />

          <div
            className="mt-10 rounded-full text-sm font-semibold text-white shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #23aeb8 0%, #53bec6 50%, #5cc2d6 100%)",
            }}
          >
            <button
              onClick={checkAuthAndSubmit}
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create Business Card"}
            </button>
          </div>
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </>
  )

};
export default GlamCardForm;