import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { BOOKING_METHODS, FieldErrors, GlamCardFormData } from "./types";
import BasicInfoForm from "./BasicInfoForm";
import MediaAndProfileForm from "../MediaAndProfileForm";
import SpecialOfferForm from "./SpecialOfferForm";
import ServicesAndBookingForm from "./ServicesAndBookingForm";
import { useRouter } from "next/navigation";
import { saveFormDataToSession } from "./Formdatasessionstorage";
import { createCard, createGuestCard, updateCard } from "@/api/Api";
import { readApiError } from "@/lib/apiError";
import { saveCardToken } from "@/lib/cardToken";
import { loginHref } from "@/lib/auth";
import { useSession } from "@/lib/useSession";
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
  /** Edit mode: whether the owner may change photos, video and offers (Access Pro,
   *  or a card that is not live yet). Details can always be edited. */
  proAccess?: boolean;
}
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Digits only — no letters, spaces, or symbols (+, -, parens, etc).
const PHONE_DIGITS_REGEX = /^\d+$/;
const isValidPhone = (value: string) =>
  PHONE_DIGITS_REGEX.test(value) && value.length >= 7 && value.length <= 15;
// API field names (INVALID_CARD details.field) that the form tracks under another key.
const FIELD_ALIASES: Record<string, string> = {
  preferred_booking_method: "preferred_booking_methods",
  videos: "images",
  video_thumbnails: "images",
};
const GlamCardForm: React.FC<Props> = ({
  data,
  setData,
  mode = "create",
  cardId,
  onSuccess,
  onCancel,
  proAccess = true,
}) => {
  const isEdit = mode === "edit";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const session = useSession();
  // Set when a signed-in professional already has a card (409 CARD_EXISTS).
  const [existingCardId, setExistingCardId] = useState<number | null>(null);
  // Tracks which required fields currently fail validation, so the relevant
  // inputs can be outlined in red instead of the user only seeing a toast.
  // Populated by validateData() below (and by the API's INVALID_CARD answer);
  // cleared per-field as the section components call clearError().
  const [errors, setErrors] = useState<FieldErrors>({});
  const clearError = (key: string) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };
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
      toast.info(firstMessage);
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
    // Featured Links — new thumbnail Files go in "featured_link_images" (in
    // order), and "featured_links" carries a matching JSON array where
    // image_index points a link at its file's position in that array (null
    // when the link has no new image attached). For a link that already had
    // an image and isn't getting a new one (the common "edit" case — just
    // touching the title/url/order of an existing link), its persisted
    // image URL is carried forward via "image" so it doesn't get lost —
    // without this, an edit-and-save with no new upload would strip the
    // image from every existing link.
    const featuredLinksRaw: any[] = Array.isArray(data.featured_links)
      ? data.featured_links
      : [];
    const featuredLinksFiltered = featuredLinksRaw.filter((link) => link?.url?.trim());
    const featuredLinksPayload = featuredLinksFiltered.map((link, index) => ({
      title: link?.title?.trim() || "",
      url: link.url.trim(),
      image_index: null as number | null,
      image:
        link?.thumbnail_file instanceof File
          ? null
          : link?.image ?? link?.thumbnail_url ?? link?.image_url ?? null,
      sort_order: index + 1,
      is_featured: link?.is_featured === true,
    }));
    let featuredImageIndex = 0;
    featuredLinksFiltered.forEach((link, index) => {
      if (link?.thumbnail_file instanceof File) {
        formData.append("featured_link_images", link.thumbnail_file);
        featuredLinksPayload[index].image_index = featuredImageIndex;
        featuredImageIndex++;
      }
    });
    if (data.featured_links !== undefined) {
      formData.append("featured_links", JSON.stringify(featuredLinksPayload));
    }
    const jsonFields = [
      "business_hour",
      "other_links",
      "important_info",
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
      "website",
      "promotion_details",
      "color_code",
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
    // A guest's details are kept for this tab so sign-in can prefill the email
    // if the API says the email already has an account.
    if (session.status !== "signed-in") saveFormDataToSession(formData);
    handleSubmit(formData);
  };

  /** Shows the API's refusal of a card field under that field. */
  const showFieldError = (field: string, message: string) => {
    const key = FIELD_ALIASES[field] ?? field;
    setErrors((prev) => ({ ...prev, [key]: message }));
    toast.error(message);
    document.getElementById(`field-${key}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = async (formData: FormData, replace = false) => {
    const newVideoItems = (data.images ?? [])
      .map((file, index) => ({ file, meta: data.gallery_meta?.[index], index }))
      .filter(
        ({ file }) => file instanceof File && (file as File).type.startsWith("video/")
      );
    for (const { meta, index } of newVideoItems) {
      if (!meta?.thumbnail_file) {
        toast.error(`Please upload a thumbnail for video #${index + 1}.`);
        return;
      }
    }
    if (replace) formData.set("replace", "true");
    try {
      setLoading(true);

      if (isEdit && cardId) {
        const result = await updateCard(cardId, formData);
        toast.success(result?.message || "Your card is updated.");
        onSuccess?.(result?.data ?? result);
        return;
      }

      if (session.status === "signed-in") {
        // The card belongs to the signed-in professional; choose a plan next.
        const result = await createCard(formData);
        router.push(`/pricing?businessCardId=${result?.data?.business_card_id}`);
        return;
      }

      // A guest's card is a hidden draft until a plan is chosen or paid. The
      // card token proves this browser made it, for the purchase calls.
      const result = await createGuestCard(formData);
      const created = result?.data ?? {};
      const businessCardId = created.business_card_id;
      if (created.card_token) saveCardToken(businessCardId, created.card_token);
      const pricing = `/pricing?businessCardId=${businessCardId}`;
      if (created.next_step === "sign_in") {
        // The email already has a Glamlink account: sign in, then the draft is
        // claimed for that account on the pricing page.
        toast.info("This email already has a Glamlink account. Sign in to continue.");
        router.push(loginHref(`${pricing}&claim=1`));
        return;
      }
      router.push(pricing);
    } catch (error) {
      const { code, message, details } = readApiError(error);
      if (code === "INVALID_CARD" && details?.field) {
        showFieldError(String(details.field), message);
      } else if (code === "CARD_EXISTS") {
        setExistingCardId(Number(details?.card_id) || null);
      } else if (code === "UPGRADE_REQUIRED") {
        toast.error(
          details?.feature === "special_offers"
            ? "Special offers are part of Access Pro. Upgrade to run one."
            : details?.feature === "edit_details"
              ? "Editing your card is part of Access Pro. Upgrade to make changes."
              : "Changing photos and video is part of Access Pro. Upgrade to refresh them."
        );
      } else if (code === "TOO_MANY_REQUESTS") {
        toast.error("Too many cards were created from this connection. Please try again in an hour.");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="lg:h-[90dvh] lg:overflow-y-auto lg:pr-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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
              locked={isEdit && !proAccess}
            />
            <ServicesAndBookingForm
              data={data}
              setData={setData}
              errors={errors}
              clearError={clearError}
              mode={mode}
              cardId={cardId}
            />
            {isEdit && <SpecialOfferForm data={data} setData={setData} locked={!proAccess} />}
            <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row">
              {isEdit && onCancel && (
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 py-3 rounded-full font-medium border border-border text-muted-foreground hover:bg-secondary transition disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <div className="flex-1 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-primary">
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
      {existingCardId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-large">
            <h2 className="text-lg font-semibold">You already have an Access card</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Each person has one card. Edit the one you have, or replace it with this one: the new card keeps
              your public link, QR code, keychain and plan.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => router.push("/dashboard")} className="btn-outline flex-1">
                Edit my card
              </button>
              <button
                type="button"
                onClick={() => {
                  setExistingCardId(null);
                  handleSubmit(buildFormData(), true);
                }}
                className="btn-primary flex-1"
              >
                Replace it
              </button>
            </div>
            <button
              type="button"
              onClick={() => setExistingCardId(null)}
              className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default GlamCardForm;