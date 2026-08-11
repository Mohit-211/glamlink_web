import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import { Loader2 } from "lucide-react";
import SuccessModal from "@/components/SuccessModal";
import { BOOKING_METHODS, FieldErrors, GlamCardFormData } from "./types";
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
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Digits only — no letters, spaces, or symbols (+, -, parens, etc).
const PHONE_DIGITS_REGEX = /^\d+$/;
const isValidPhone = (value: string) =>
  PHONE_DIGITS_REGEX.test(value) && value.length >= 7 && value.length <= 15;
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
  const token = localStorage.getItem("GlamlinkaccessToken");
  // Tracks which required fields currently fail validation, so the relevant
  // inputs can be outlined in red instead of the user only seeing a toast.
  // Populated by validateData() below; cleared per-field as the section
  // components call clearError() once the user fixes that field.
  const [errors, setErrors] = useState<FieldErrors>({});
  const clearError = (key: string) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

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
  // Restore form data from localStorage on mount (create flow only — edit loads from server data via props).
  //
  // The draft in FORM_STORAGE_KEY is ONLY meant to survive the intentional
  // "logged out -> save draft -> redirect to /login -> come back" flow
  // (see handleLogin below, which sets postLoginRedirect right before
  // saving the draft). We use that flag to distinguish "we just came back
  // from login" from "the user simply refreshed the page" — on a plain
  // reload there's no reason to silently repopulate the form with
  // whatever was last saved, possibly from a much earlier session, so we
  // clear it instead of restoring it.
  useEffect(() => {
    if (isEdit) return;
    const cameFromLoginRedirect =
      localStorage.getItem("postLoginRedirect") === "/apply/digital-card";
    const storedData = localStorage.getItem(FORM_STORAGE_KEY);
    if (cameFromLoginRedirect && storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setData(parsed);
      } catch (error) {
        console.error(error);
      }
    }
    // Either way, clear both keys now: if we just consumed the draft, it's
    // no longer needed; if this was a plain reload, we don't want a stale
    // draft or redirect flag lingering around for next time.
    localStorage.removeItem(FORM_STORAGE_KEY);
    localStorage.removeItem("postLoginRedirect");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setData, isEdit]);
  /* ================= REQUIRED VALIDATION =================
     Pulled out so it can run before we even check for login,
     without needing to touch handleSubmit's flow. */
  const validateData = (): boolean => {
    const newErrors: FieldErrors = {};
    let firstMessage = "";
    let firstKey = "";
    const fail = (key: string, msg: string) => {
      newErrors[key] = msg;
      if (!firstMessage) {
        firstMessage = msg;
        firstKey = key;
      }
    };

    if (!data.name?.trim()) fail("name", "Please enter your Name");
    if (!data.professional_title?.trim())
      fail("professional_title", "Please enter your Professional Title");
    if (!data.email?.trim()) fail("email", "Please enter your Email");
    else if (!EMAIL_REGEX.test(data.email.trim()))
      fail("email", "Please enter a valid Email address");
    // Phone is only required when it's set to show on the card — matches
    // the conditional "Phone number is required." hint under the field in
    // BasicInformationSection (and the "Show phone number on card" toggle).
   if ((data.is_phone_visible ?? true) && !data.phone?.trim()) {
  fail("phone", "Please enter your Phone Number");
} else if (
  (data.is_phone_visible ?? true) &&
  data.phone?.trim() &&
  !/^\d{10}$/.test(data.phone.trim())
) {
  fail("phone", "Phone Number must contain exactly 10 digits");
}
    if (!data.business_name?.trim())
      fail("business_name", "Please enter your Business Name");
    if (!data.bio?.trim()) fail("bio", "Please enter your Bio");
    if (
      !Array.isArray(data.preferred_booking_methods) ||
      data.preferred_booking_methods.length === 0
    ) {
      fail("preferred_booking_methods", "Please select Preferred Booking Method");
    }
    // "Go to Website" needs somewhere to send clients — either a dedicated
    // booking link, or the website URL it falls back to (see the Booking
    // Link field in ServicesAndBookingForm).
    if (
      data.preferred_booking_methods?.includes(BOOKING_METHODS.LINK) &&
      !data.booking_link?.trim() &&
      !data.website?.trim()
    ) {
      fail("booking_link", "Please enter a Booking Link or Website");
    }
    // "DM on Instagram" needs a handle to actually DM.
    if (
      data.preferred_booking_methods?.includes(BOOKING_METHODS.INSTAGRAM) &&
      !data.social_media?.instagram?.trim()
    ) {
      fail("instagram", "Please enter your Instagram handle");
    }
    if (!data.profile_image) fail("profile_image", "Please upload Profile Image");
    if (!data.images?.length) fail("images", "Please upload Gallery Images");
    if (!data.specialties?.length)
      fail("specialties", "Please add at least one Specialty");
    if (!data.locations?.length) fail("locations", "Please add a Location");

    setErrors(newErrors);
    if (firstMessage) {
      message.info(firstMessage);
      document
        .getElementById(`field-${firstKey}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  };
  /* ================= BUILD FORM DATA =================
     Pulled out of handleSubmit so it can run — and get stored to
     sessionStorage — regardless of whether the user is logged in. */
  const buildFormData = (): FormData => {
    const formData = new FormData();
    if (data.profile_image instanceof File) {
      formData.append("profile_image", data.profile_image);
    }
    const images: (File | string)[] = data.images ?? [];
    const meta = data.gallery_meta ?? [];
    const newImageEntries = images
      .map((file, index) => ({ file, meta: meta[index], index }))
      .filter(
        (entry): entry is { file: File; meta: typeof meta[number]; index: number } =>
          entry.file instanceof File && !(entry.file as File).type.startsWith("video/")
      );
    const newVideoItems = images
      .map((file, index) => ({ file, meta: meta[index], index }))
      .filter(
        (entry): entry is { file: File; meta: typeof meta[number]; index: number } =>
          entry.file instanceof File && (entry.file as File).type.startsWith("video/")
      );
    const existingImageEntries = images
      .map((file, index) => ({ file, meta: meta[index], index }))
      .filter((entry) => !(entry.file instanceof File));
    const getExistingId = (file: any): string | undefined =>
      typeof file === "string" ? file : file?.id ?? file?.file_uri ?? file?.url;
    newImageEntries.forEach(({ file }) => formData.append("images", file));
    if (isEdit) {
      formData.append(
        "existing_image_ids",
        JSON.stringify(existingImageEntries.map(({ file }) => getExistingId(file)))
      );
    }
    // Send metadata split the SAME way, in the SAME order as the image
    // arrays above, so index i in each meta array corresponds to index i
    // in its matching image array.
    const stripMeta = (m: any) => ({
      caption: m?.caption,
      is_thumbnail: m?.is_thumbnail,
      sort_order: m?.sort_order,
    });
    if (newImageEntries.length) {
      formData.append(
        "new_images_gallery_meta",
        JSON.stringify(newImageEntries.map(({ meta }) => stripMeta(meta)))
      );
    }
    if (existingImageEntries.length) {
      formData.append(
        "existing_images_gallery_meta",
        JSON.stringify(existingImageEntries.map(({ meta }) => stripMeta(meta)))
      );
    }
    newVideoItems.forEach(({ file, meta }) => {
      formData.append("videos", file);
      if (meta?.thumbnail_file) {
        formData.append("video_thumbnails", meta.thumbnail_file);
      }
    });
    const existingVideoEntries = images
      .map((file, index) => ({ file, meta: meta[index], index }))
      .filter(
        (entry) =>
          !(entry.file instanceof File) &&
          (entry.meta as any)?.file_type === "video"
      );
    if (isEdit) {
      formData.append(
        "existing_video_ids",
        JSON.stringify(existingVideoEntries.map(({ file }) => getExistingId(file)))
      );
    }
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
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const token = localStorage.getItem("GlamlinkaccessToken");
      const endpoint = isEdit
        ? `${API_URL}/businessCard/updateBusinessCard/${cardId}`
        : token
          ? `${API_URL}/businessCard/createBusinessCard`
          : `${API_URL}/businessCard`;
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
  const errorData = await res.json().catch(() => null);

  throw new Error(
    errorData?.message ||
      errorData?.error ||
      (isEdit ? "Failed to update GlamCard" : "Failed to create GlamCard")
  );
}
      const result = await res.json();
      if (isEdit) {
        message.success(result?.message || "GlamCard updated successfully!");
        onSuccess?.(result?.data ?? result);
      } else {
        // New user -> straight to plan selection with the new card's id.
        if (result?.data?.user_exists === false) {
          const businessCardId = result?.data?.business_card_id;
          router.push(`/pricing?businessCardId=${businessCardId}`);
          return;
        }
        // Existing user -> normal success popup -> dashboard.
        setPostSuccessAction("dashboard");
        setShowSuccess(true);
        setTimeout(advanceAfterSuccess, 6000);
      }
    } catch (error) {
      console.error("ERROR 👉", error);
      // message.error(
      //   isEdit ? "Failed to update Business Card" : "Failed to create Business Card"
      // );
      message.error(error instanceof Error ? error.message : "An unexpected error occurred.");
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
            className={`space-y-10 pb-6 transition-opacity duration-150 ${loading ? "pointer-events-none opacity-50" : ""
              }`}
          >
            <BasicInfoForm
              data={data}
              setData={setData}
              errors={errors}
              clearError={clearError}
            />
            <MediaAndProfileForm
              data={data}
              setData={setData}
              errors={errors}
              clearError={clearError}
            />
            <ServicesAndBookingForm
              data={data}
              setData={setData}
              errors={errors}
              clearError={clearError}
            />
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
          title="Your Access Card has been created successfully!"
        //           message="
        // Your Access Card is currently under review. Once approved, we'll email you with instructions to access your account and view your Access Card.
        // "
        />
      )}

      {/* {!isEdit && (
        <Modal
          open={isAuthModalOpen}
          onCancel={() => setAuthStep(null)}
          footer={null}
          centered
          width={480}
          destroyOnHidden
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
      )} */}
    </>
  );
};
export default GlamCardForm;