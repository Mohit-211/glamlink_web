import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
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
  /** "create" (default) shows the create flow; "edit" adapts submit/validation/UI for updating an existing card */
  mode?: "create" | "edit";
  /** required when mode === "edit" */
  cardId?: string | number;
  /** called with the API response after a successful edit save (instead of redirecting) */
  onSuccess?: (result: any) => void;
  /** shown as a Cancel action when mode === "edit" */
  onCancel?: () => void;
}

const FORM_STORAGE_KEY = "glamcard_form_draft";

const GlamCardForm: React.FC<Props> = ({
  data,
  setData,
  mode = "create",
  cardId,
  onSuccess,
  onCancel,
}) => {
  const isEdit = mode === "edit";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Restore form data from localStorage on mount (create flow only — edit loads from server data via props)
  useEffect(() => {
    if (isEdit) return;
    const storedData = localStorage.getItem(FORM_STORAGE_KEY);
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setData(parsed);
        localStorage.removeItem(FORM_STORAGE_KEY);
      } catch (error) {
        console.error(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setData, isEdit]);

  const checkAuthAndSubmit = () => {
    const token = localStorage.getItem("GlamlinkaccessToken");

    if (!token) {
      if (isEdit) {
        alert("Your session has expired. Please log in again.");
        return;
      }
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
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem("postLoginRedirect", "/apply/digital-card");
    window.location.href = "/login";
  };

  const handleSubmit = async () => {
    console.log("FINAL DATA 👉", data);

    /* ================= REQUIRED VALIDATION ================= */
    if (!data.name?.trim()) return alert("Please enter your Name");
    if (!data.professional_title?.trim())
      return alert("Please enter your Professional Title");
    if (!data.email?.trim()) return alert("Please enter your Email");
    if (!data.phone?.trim()) return alert("Please enter your Phone Number");
    if (!data.business_name?.trim())
      return alert("Please enter your Business Name");
    if (!data.bio?.trim()) return alert("Please enter your Bio");
    if (!data.primary_specialty?.trim())
      return alert("Please select your Primary Specialty");
    if (!data.custom_handle?.trim())
      return alert("Please enter your Custom Handle");
    if (!data.website?.trim()) return alert("Please enter your Website");
    if (
      !Array.isArray(data.preferred_booking_methods) ||
      data.preferred_booking_methods.length === 0
    )
      return alert("Please select Preferred Booking Method");
    if (!data.profile_image) return alert("Please upload Profile Image");
    if (!data.images?.length) return alert("Please upload Gallery Images");
    if (!data.specialties?.length)
      return alert("Please add at least one Specialty");
    if (!data.locations?.length) return alert("Please add a Location");

    try {
      setLoading(true);
      const formData = new FormData();

      // Profile image: only send if a NEW file was picked. If it's still the
      // existing string URL (edit mode, untouched), don't re-upload it.
      if (data.profile_image instanceof File) {
        formData.append("profile_image", data.profile_image);
      }

      // Gallery images/videos: split into new File uploads vs existing URLs
      const newImageFiles = (data.images ?? []).filter(
        (file): file is File =>
          file instanceof File && !file.type.startsWith("video/")
      );
      const newVideoItems = (data.images ?? [])
        .map((file, index) => ({ file, meta: data.gallery_meta?.[index], index }))
        .filter(
          ({ file }) => file instanceof File && (file as File).type.startsWith("video/")
        );
      const existingImageUrls = (data.images ?? []).filter(
        (file: unknown): file is string => typeof file === "string"
      );

      newImageFiles.forEach((file) => formData.append("images", file));

      if (isEdit && existingImageUrls.length) {
        // NOTE: confirm this field name matches what updateBusinessCard expects
        formData.append("existing_images", JSON.stringify(existingImageUrls));
      }

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

      for (const { meta, index } of newVideoItems) {
        if (!meta?.thumbnail_file) {
          alert(`Please upload a thumbnail for video #${index + 1}.`);
          setLoading(false);
          return;
        }
      }
      newVideoItems.forEach(({ file, meta }) => {
        formData.append("videos", file);
        formData.append("video_thumbnails", meta!.thumbnail_file!);
      });

      if (data.social_media) {
        formData.append("social_media", JSON.stringify(data.social_media));
      }

      // preferred_booking_methods is an array (multi-select) in the form
      // state, but the backend expects it under the singular key
      // "preferred_booking_method" — still as a JSON array, not a single
      // string. Handle it separately from jsonFields since the form-state
      // key and the API key differ.
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

      if (data.preferred_booking_methods !== undefined) {
        formData.append(
          "preferred_booking_method",
          JSON.stringify(data.preferred_booking_methods)
        );
      }

      const primitiveFields = [
        "name",
        "email",
        "phone",
        "business_name",
        "professional_title",
        "bio",
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
      const endpoint = isEdit
        ? `https://node.glamlink.net:5000/api/v1/businessCard/updateBusinessCard/${cardId}`
        : "https://node.glamlink.net:5000/api/v1/businessCard/createBusinessCard";

      const res = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "x-access-token": token || "",
          role_id: String(7),
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(
          isEdit ? "Failed to update GlamCard" : "Failed to create GlamCard"
        );
      }

      const result = await res.json();

      if (isEdit) {
        message.success(result?.message || "GlamCard updated successfully!");
        onSuccess?.(result?.data ?? result);
      } else {
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("ERROR 👉", error);
      message.error(
        isEdit ? "Failed to update Business Card" : "Failed to create Business Card"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-[90dvh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="space-y-10 pb-6">
          <BasicInfoForm data={data} setData={setData} />

          <MediaAndProfileForm data={data} setData={setData} />

          <ServicesAndBookingForm data={data} setData={setData} />

          <GlamlinkIntegrationForm data={data} setData={setData} />

          <div className="mt-10 flex gap-3">
            {isEdit && onCancel && (
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 py-3 rounded-full font-medium border border-border text-muted-foreground hover:bg-secondary transition disabled:opacity-50"
              >
                Cancel
              </button>
            )}
            <div
              className="flex-1 rounded-full text-sm font-semibold text-white shadow-lg"
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
                  ? isEdit
                    ? "Saving..."
                    : "Creating..."
                  : isEdit
                  ? "Save Changes"
                  : "Create Business Card"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {!isEdit && (
        <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
      )}
    </>
  );
};

export default GlamCardForm;