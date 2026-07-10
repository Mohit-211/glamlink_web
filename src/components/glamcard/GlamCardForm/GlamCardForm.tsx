import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import { Loader2 } from "lucide-react";
import SuccessModal from "@/components/SuccessModal";

import { GlamCardFormData } from "./types";
import BasicInfoForm from "./BasicInfoForm";
import MediaAndProfileForm from "../MediaAndProfileForm";
import GlamlinkIntegrationForm from "./GlamlinkIntegrationForm";
import ServicesAndBookingForm from "./ServicesAndBookingForm";
import { useRouter } from "next/navigation";
import { saveFormDataToSession } from "./Formdatasessionstorage";
import VerifyOtp from "@/components/AuthPage/VerifyOtp";
import Register from "@/components/AuthPage/Register";
import Login from "@/components/AuthPage/Login";
import { SubscriptionPaymentModal } from "../../Dashboard/SubscriptionPay";

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

// "payment" is intentionally NOT rendered inside the register/otp/login
// Modal below — it's shown via its own SubscriptionPaymentModal instance so
// the two modals never stack on top of one another.
type AuthStep = "register" | "otp" | "login" | "payment" | null;

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

  // Auth flow state — shown when a card is created for a user who doesn't
  // have a Glamlink login yet (result.data.user_login === false).
  // Flow: register -> otp -> login -> (payment, if pending)
  const [authStep, setAuthStep] = useState<AuthStep>(null);
  const [createdCardEmail, setCreatedCardEmail] = useState<string>("");

  // What should happen once the success popup is dismissed. We always show
  // the "your card was created" popup first now — this just decides what
  // comes after it: straight to the dashboard, or into the register flow
  // for users who don't have a Glamlink login yet.
  const [postSuccessAction, setPostSuccessAction] = useState<
    "dashboard" | "register" | null
  >(null);

  // Owned here (not by Login) so the payment modal survives the
  // register/otp/login Modal closing and doesn't stack two modals at once.
  const [pendingCardId, setPendingCardId] = useState<string | number | null>(
    null
  );

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

  /* ================= REQUIRED VALIDATION =================
     Pulled out so it can run before we even check for login,
     without needing to touch handleSubmit's flow. */
  const validateData = (): boolean => {
    if (!data.name?.trim()) {
      alert("Please enter your Name");
      return false;
    }
    if (!data.professional_title?.trim()) {
      alert("Please enter your Professional Title");
      return false;
    }
    if (!data.email?.trim()) {
      alert("Please enter your Email");
      return false;
    }
    if (!data.phone?.trim()) {
      alert("Please enter your Phone Number");
      return false;
    }
    if (!data.business_name?.trim()) {
      alert("Please enter your Business Name");
      return false;
    }
    if (!data.bio?.trim()) {
      alert("Please enter your Bio");
      return false;
    }
    if (!data.primary_specialty?.trim()) {
      alert("Please select your Primary Specialty");
      return false;
    }
    if (!data.custom_handle?.trim()) {
      alert("Please enter your Custom Handle");
      return false;
    }
    if (!data.website?.trim()) {
      alert("Please enter your Website");
      return false;
    }
    if (
      !Array.isArray(data.preferred_booking_methods) ||
      data.preferred_booking_methods.length === 0
    ) {
      alert("Please select Preferred Booking Method");
      return false;
    }
    if (!data.profile_image) {
      alert("Please upload Profile Image");
      return false;
    }
    if (!data.images?.length) {
      alert("Please upload Gallery Images");
      return false;
    }
    if (!data.specialties?.length) {
      alert("Please add at least one Specialty");
      return false;
    }
    if (!data.locations?.length) {
      alert("Please add a Location");
      return false;
    }
    return true;
  };

  /* ================= BUILD FORM DATA =================
     Pulled out of handleSubmit so it can run — and get stored to
     sessionStorage — regardless of whether the user is logged in. */
  const buildFormData = (): FormData => {
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

    newVideoItems.forEach(({ file, meta }) => {
      formData.append("videos", file);
      if (meta?.thumbnail_file) {
        formData.append("video_thumbnails", meta.thumbnail_file);
      }
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

    return formData;
  };

  const checkAuthAndSubmit = () => {
    if (!validateData()) return;

    const formData = buildFormData();

    // Session storage is only a hand-off mechanism for the logged-out ->
    // login -> resume-submit flow (see the useEffect above that reads
    // FORM_STORAGE_KEY on mount, and handleLogin below). A logged-in user
    // never needs that hand-off, so don't write their data to session
    // storage at all in that case.
    const token = localStorage.getItem("GlamlinkaccessToken");
    if (!token) {
      saveFormDataToSession(formData);
    }

    // if (!token) {
    //   if (isEdit) {
    //     alert("Your session has expired. Please log in again.");
    //     return;
    //   }
    //   Modal.confirm({
    //     title: "Login Required",
    //     content:
    //       "Please login first to create your GlamCard and save your business profile.",
    //     okText: "Login Now",
    //     cancelText: "Cancel",
    //     centered: true,
    //     onOk: () => {
    //       handleLogin();
    //     },
    //   });
    //   return;
    // }

    handleSubmit(formData);
  };

  // Fires once the success popup is dismissed, whether that's via its own
  // auto-close timer or a user clicking a close/"see your card" button
  // inside it. Guarded by postSuccessAction so it's safe to fire twice
  // (e.g. once from the timeout below and once from onClose).
  const advanceAfterSuccess = () => {
    setShowSuccess(false);
    setPostSuccessAction((current) => {
      if (current === "register") {
        setAuthStep("register");
      } else if (current === "dashboard") {
        router.push("/dashboard");
      }
      return null;
    });
  };

  const handleLogin = () => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem("postLoginRedirect", "/apply/digital-card");
    window.location.href = "/login";
  };

  const handleSubmit = async (formData: FormData) => {
    console.log("FINAL DATA 👉", data);

    // newVideoItems thumbnail check still needs to run before the actual
    // network call — kept here since it can short-circuit with a UI alert.
    const newVideoItems = (data.images ?? [])
      .map((file, index) => ({ file, meta: data.gallery_meta?.[index], index }))
      .filter(
        ({ file }) => file instanceof File && (file as File).type.startsWith("video/")
      );
    for (const { meta, index } of newVideoItems) {
      if (!meta?.thumbnail_file) {
        alert(`Please upload a thumbnail for video #${index + 1}.`);
        return;
      }
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("GlamlinkaccessToken");
      const endpoint = isEdit
        ? `https://node.glamlink.net:5000/api/v1/businessCard/updateBusinessCard/${cardId}`
        : token
          ? "https://node.glamlink.net:5000/api/v1/businessCard/createBusinessCard"
          : "https://node.glamlink.net:5000/api/v1/businessCard";

      const res = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "x-access-token": token || "",
          role_id: String(7),
        },
        body: formData,
      });

      console.log(res, "res====");

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
        // Create flow: always show the "your card was created" success
        // popup first. What happens after it closes depends on whether
        // this user already has a Glamlink login:
        // - user_login === false -> walk them into register -> otp -> login
        // - otherwise -> just send them to the dashboard to see their card
        if (result?.data?.user_login === false) {
          setCreatedCardEmail(result?.data?.email ?? "");
          setPostSuccessAction("register");
        } else {
          setPostSuccessAction("dashboard");
        }
        setShowSuccess(true);
        setTimeout(advanceAfterSuccess, 2000);
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

  // register/otp/login share one Modal; "payment" is deliberately excluded
  // so it renders via its own SubscriptionPaymentModal instance below,
  // instead of stacking on top of this one.
  const isAuthModalOpen =
    authStep === "register" || authStep === "otp" || authStep === "login";

  return (
    <>
      <div className="h-[90dvh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {/* Wrapping container gives the fields a clearly-intentional
            "disabled while saving" look (dimmed + no pointer events + a
            centered spinner) instead of just going quiet with no
            explanation, which read as the page being frozen/broken. */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 z-10 bg-background/70">
              <div className="sticky top-1/2 -translate-y-1/2 mx-auto flex w-fit flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {isEdit ? "Saving changes..." : "Creating your business card..."}
                </span>
              </div>
            </div>
          )}

          <div
            aria-busy={loading}
            className={`space-y-10 pb-6 transition-opacity duration-150 ${
              loading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <BasicInfoForm data={data} setData={setData} />
            <MediaAndProfileForm data={data} setData={setData} />
            <ServicesAndBookingForm data={data} setData={setData} />
            {/* <GlamlinkIntegrationForm data={data} setData={setData} /> */}

            <div className="mt-10 flex gap-3">
              {isEdit && onCancel && (
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 py-3 rounded-full font-medium border border-border text-muted-foreground hover:bg-secondary transition disabled:opacity-50 cursor-pointer"
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
                  className="w-full py-3 rounded-lg font-medium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
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
      </div>

      {!isEdit && (
        <SuccessModal
          open={showSuccess}
          onClose={advanceAfterSuccess}
          title="Business card created"
          message="Your business card was created successfully. See your card to finish setting it up."
        />
      )}

     
      {!isEdit && (
        <Modal
          open={isAuthModalOpen}
          onCancel={() => setAuthStep(null)}
          footer={null}
          centered
          width={480}
          destroyOnClose
        >
          {authStep === "register" && (
            <Register
              onSuccess={(email) => {
                setCreatedCardEmail(email);
                setAuthStep("otp");
              }}
            />
          )}
          {authStep === "otp" && (
            <VerifyOtp
              email={createdCardEmail}
              onSuccess={() => setAuthStep("login")}
            />
          )}
          {authStep === "login" && (
            <Login
              onSuccess={() => {
                setAuthStep(null);
                router.push("/dashboard");
              }}
              onNeedsVerification={(email) => {
                setCreatedCardEmail(email);
                setAuthStep("otp");
              }}
              onPaymentRequired={(businessCardId) => {
                // Close this Modal and hand off to our own
                // SubscriptionPaymentModal instance below, instead of
                // letting Login render its internal fallback modal.
                setPendingCardId(businessCardId);
                setAuthStep("payment");
              }}
            />
          )}
        </Modal>
      )}

      {/* Payment modal — owned here (not by Login) so it doesn't stack on
          top of the register/otp/login Modal above. */}
      {!isEdit && (
        <SubscriptionPaymentModal
          open={authStep === "payment"}
          onClose={() => setAuthStep(null)}
          onSuccess={() => {
            setAuthStep(null);
            router.push("/dashboard");
          }}
          businessCardId={pendingCardId}
          onGoToAddresses={() => {
            setAuthStep(null);
            router.push("/dashboard?tab=addresses");
          }}
        />
      )}
    </>
  );
};

export default GlamCardForm;