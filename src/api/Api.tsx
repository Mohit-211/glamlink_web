import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { API_URL } from "@/lib/config";
import type { OwnerEducation, OwnerMedia } from "@/lib/api/profileContent";
import { handleSignedOut } from "@/lib/auth";
import {
  clearSession,
  getAccessToken,
  getSessionState,
  peekAccessToken,
  refreshSession,
  sessionReady,
  setSession,
  type TokenPayload,
} from "@/lib/session";
import { cardTokenHeader } from "@/lib/cardToken";

declare module "axios" {
  interface AxiosRequestConfig {
    /** The call needs a signed-in account: wait for the session, and send the
     *  person to sign in if there is none. */
    requireAuth?: boolean;
    /** Guests make this call too (with a card token), but a signed-in owner must
     *  send their access token: wait for the session to be restored first. */
    withSession?: boolean;
    /** Internal: this request was already retried after a refresh. */
    _retried?: boolean;
  }
}

const isBrowser = typeof window !== "undefined";

/** The browser API client. Exported for the feature modules in src/api/ (directory.ts). */
export const api = axios.create({
  baseURL: API_URL,
});

/* The access token lives in memory (lib/session). Calls that need sign-in, and
   the purchase calls (`withSession`), wait for the session to be restored on
   page load. A signed-in person's calls always carry a fresh token: a stale one
   is refreshed first. Other calls from someone signed out go without one. */
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (!isBrowser) return config;
  let token = peekAccessToken();
  if (!token) {
    let { status } = getSessionState();
    if (status === "loading" && (config.requireAuth || config.withSession)) ({ status } = await sessionReady());
    if (config.requireAuth || status === "signed-in") token = await getAccessToken();
  }
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

/** 401s that a fresh access token can fix: it ran out, or it went unsent while stale. */
const RETRY_AFTER_REFRESH = new Set(["SESSION_EXPIRED", "SIGN_IN_REQUIRED", "CARD_TOKEN_REQUIRED"]);

/* A 401 the access token can fix: refresh once and retry. SIGN_IN_REQUIRED and
   CARD_TOKEN_REQUIRED are retried only for someone signed in (a guest's card
   token is what is missing then). If the refresh fails, the person is signed out. */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config as AxiosRequestConfig | undefined;
    const status = error?.response?.status;
    const code = error?.response?.data?.code;
    if (!isBrowser || !config || status !== 401) return Promise.reject(error);

    if (RETRY_AFTER_REFRESH.has(code) && !config._retried) {
      let session = getSessionState();
      if (session.status === "loading") session = await sessionReady();
      if (code === "SESSION_EXPIRED" || session.status === "signed-in") {
        const token = await refreshSession();
        if (token) {
          config._retried = true;
          config.headers = { ...(config.headers as any), Authorization: `Bearer ${token}` };
          return api.request(config);
        }
      }
    }
    if ((code === "SESSION_EXPIRED" || code === "SIGN_IN_REQUIRED") && config.requireAuth) {
      handleSignedOut();
    }
    return Promise.reject(error);
  }
);


/* ============================= */
/* 📌 Categories */
/* ============================= */
export const getCategories = async () => {
  const { data } = await api.get("journalCategory");
  return data;
};
export const getAllCategories = async () => {
  const { data } = await api.get("businessCard/getAllCategories");
  return data;
};
/* ============================= */
/* 📌 Blogs */
/* ============================= */
export const getAllBlogs = async () => {
  const { data } = await api.get("journal");
  return data;
};
export const getTypeBlogs = async (type: string) => {
  const { data } = await api.get(`discover/${type}`);
  return data;
};
export const getBlogsById = async (id: string | number) => {
  const { data } = await api.get(`journal/findJournalById/${id}`);
  return data;
};
export const getBlogsByCategoryId = async (category_id: string | number) => {
  const { data } = await api.get(`journal/${category_id}`);
  return data;
};
/* ============================= */
/* 📌 Topics */
/* ============================= */
export const getAllTopics = async () => {
  const { data } = await api.get("journal/topic");
  return data;
};
export const getTopicById = async (id: string | number) => {
  const { data } = await api.get(`journal/topic/${id}`);
  return data;
};
export const getTopicParagraphs = async (id: string | number) => {
  const { data } = await api.get(`journal/topic/${id}/paragraphs`);
  return data;
};
/* ============================= */
/* 📌 Podcast */
/* ============================= */
export const getAllPodcast = async () => {
  const { data } = await api.get("podcast-schedule/list");
  return data;
};
export const submitGuestApplication = async (payload: {
  name: string;
  businessName: string;
  website: string;
  instagram: string;
  email: string;
  phone: string;
}) => {
  const { data } = await api.post("guest-application/create", payload);
  return data;
};
/* ============================= */
/* 📌 Business Card (public) */
/* ============================= */
export const getBusinessCardBySlug = async (slug: string) => {
  const { data } = await api.get(`businessCard/getBusinessCard/${slug}`);
  return data;
};
/** Accepted, public cards (the directory, the marketplace, featured profiles). */
export const getBusinessProfile = async () => {
  const { data } = await api.get("businessCard/getAllProfiles");
  return data;
};
/* ============================= */
/* 📌 Nearby professionals (Google Places) */
/* ============================= */
export const GetProfessionalListApi = async () => {
  const { data } = await api.get("user/nearby/map/professional/list");
  return data;
};
export const GetPlaceDetailsApi = async (place_id: string) => {
  const { data } = await api.get(`user/google-locations/details/${place_id}`);
  return data;
};
/* ============================= */
/* 📌 Directories */
/* ============================= */
export const GetAllCategoryApi = async () => {
  const { data } = await api.get("businessCard/getAllDirectories");
  return data;
};
export const GetProfilesByDirectory = async (category_id: string | number) => {
  const { data } = await api.get(`businessCard/getProfilesByDirectory/${category_id}`);
  return data;
};
/* ============================= */
/* 📌 States and cities */
/* ============================= */
export const getAllStates = async () => {
  const { data } = await api.get("country/233");
  return data;
};
export const getCitiesByState = async (state_id: string | number) => {
  const numericId = typeof state_id === "number" ? state_id : parseInt(state_id, 10);
  if (!numericId || Number.isNaN(numericId)) return { data: [] };
  try {
    const { data } = await api.get(`state/${numericId}`);
    return data;
  } catch (error) {
    console.error("Failed to fetch cities for state_id:", numericId, error);
    return { data: [] };
  }
};

/* ============================= */
/* 📌 Auth */
/* ============================= */
// Calls that set or use the refresh cookie need withCredentials, and the
// website identifies itself so the API issues a website session.
const withCookie = { withCredentials: true } as const;
const WEBSITE = { client: "website" } as const;

export const registerUser = async (payload: {
  name: string;
  email: string;
  mobile?: string;
  password: string;
  confirm_password: string;
  turnstile_token?: string;
}) => {
  const { data } = await api.post("user/auth/register", { ...payload, ...WEBSITE }, withCookie);
  return data;
};
/** Signs in and stores the session. Answers the signed-in user. */
export const loginUser = async (payload: { email: string; password: string }) => {
  const { data } = await api.post(
    "user/auth/login",
    { ...payload, ...WEBSITE },
    { ...withCookie, headers: { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone } }
  );
  setSession(data.data as TokenPayload);
  return data;
};
/** Opens the link from the verification email; the person is signed in. */
export const verifyEmail = async (token: string) => {
  const { data } = await api.post("user/auth/verify-email", { token, ...WEBSITE }, withCookie);
  setSession(data.data as TokenPayload);
  return data;
};
export const resendVerification = async (email: string) => {
  const { data } = await api.post("user/auth/resend-verification", { email });
  return data;
};
export const forgotPasswordApi = async (payload: { email: string }) => {
  const { data } = await api.post("user/auth/forgot-password", payload);
  return data;
};
/** Sets a new password from an email link (forgot password, or the Access welcome email). */
export const resetPasswordApi = async (payload: {
  token: string;
  password: string;
  confirm_password: string;
}) => {
  const { data } = await api.post("user/auth/reset-password", payload);
  return data;
};
export const LogoutUser = async () => {
  try {
    const { data } = await api.post("user/auth/logout", {}, { ...withCookie, requireAuth: true });
    return data;
  } finally {
    clearSession();
  }
};
export const ChangePassword = async (payload: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}) => {
  const { data } = await api.post("user/auth/change-password", payload, { requireAuth: true });
  return data;
};
export const userProfile = async () => {
  const { data } = await api.get("user/profile", { requireAuth: true });
  return data;
};

/* ============================= */
/* 📌 Access card: create, edit, own */
/* ============================= */
/** A guest's card: a hidden draft. Answers `business_card_id`, `card_token`, `next_step`. */
export const createGuestCard = async (formData: FormData) => {
  const { data } = await api.post("businessCard", formData);
  return data;
};
/** A signed-in professional's card. 409 CARD_EXISTS while they have one, unless `replace`. */
export const createCard = async (formData: FormData) => {
  const { data } = await api.post("businessCard/createBusinessCard", formData, { requireAuth: true });
  return data;
};
/** Owner edit (signed in), or a guest's draft (card token). */
export const updateCard = async (cardId: string | number, formData: FormData) => {
  const { data } = await api.put(`businessCard/updateBusinessCard/${cardId}`, formData, {
    withSession: true,
    headers: cardTokenHeader(cardId),
  });
  return data;
};
export const reorderFeaturedLinks = async (cardId: string | number, featured_links: unknown[]) => {
  const { data } = await api.put(
    `businessCard/${cardId}/featured-links/reorder`,
    { featured_links },
    { withSession: true, headers: cardTokenHeader(cardId) }
  );
  return data;
};
/** Moves a guest's draft to the signed-in account (needs both the access token and the card token). */
export const claimCard = async (cardId: string | number, replace = false) => {
  const { data } = await api.post(
    `access/cards/${cardId}/claim`,
    replace ? { replace: true } : {},
    { requireAuth: true, headers: cardTokenHeader(cardId) }
  );
  return data;
};
export const getMyBusinessCardForDashboard = async () => {
  const { data } = await api.get("businessCard/getMyBusinessCard", { requireAuth: true });
  return data;
};

/* ============================= */
/* 📌 Access plans, checkout, subscription */
/* ============================= */
// The purchase calls carry the card token (a guest) and, for a signed-in owner,
// the access token (`withSession`): an owner holds no card token.

/** Plans with prices for whoever asks: a guest passes their draft card for personal prices. */
export const getAccessPlans = async (businessCardId?: string | number | null) => {
  const { data } = await api.get("access/plans", {
    params: businessCardId ? { business_card_id: businessCardId } : undefined,
    withSession: true,
    headers: cardTokenHeader(businessCardId),
  });
  return data;
};
interface SelectPlanPayload {
  business_card_id: number | string;
  plan_type: string;
}
export const SelectPlanAPI = async (payload: SelectPlanPayload) => {
  const { data } = await api.post("businessCard/select-plan", payload, {
    withSession: true,
    headers: cardTokenHeader(payload.business_card_id),
  });
  return data;
};
/** A quote for a plan, kept as a checkout. Answers the card's pending checkout for the same plan, or 409
 *  CHECKOUT_IN_PROGRESS `{checkout_id}` while a payment for the card is processing or has gone through. */
export const quoteCheckout = async (payload: {
  business_card_id: number | string;
  plan_type: string;
  rate_id?: string;
}) => {
  const { data } = await api.post("access/checkout/quote", payload, {
    withSession: true,
    headers: cardTokenHeader(payload.business_card_id),
  });
  return data;
};
/** Starts paying a checkout: `{client_secret, publishable_key}`, or `{paid: true}` when nothing is due. */
export const payCheckout = async (checkoutId: number | string, businessCardId: number | string) => {
  const { data } = await api.post(`access/checkout/${checkoutId}/pay`, {}, {
    withSession: true,
    headers: cardTokenHeader(businessCardId),
  });
  return data;
};
/** The checkout as it stands (the API asks Stripe while it waits): its status, the client secret while it can
 *  still be paid, and the card once paid. */
export const getCheckout = async (checkoutId: number | string, businessCardId: number | string) => {
  const { data } = await api.get(`access/checkout/${checkoutId}`, {
    withSession: true,
    headers: cardTokenHeader(businessCardId),
  });
  return data;
};
/** The person's Access Pro seat, or null. `past_due`: the last renewal failed. */
export const getAccessSubscription = async () => {
  const { data } = await api.get("access/subscription", { requireAuth: true });
  return data;
};
/** Ends Access Pro at the end of the paid month. */
export const cancelAccessSubscription = async () => {
  const { data } = await api.post("access/subscription/cancel", {}, { requireAuth: true });
  return data;
};
export const resumeAccessSubscription = async () => {
  const { data } = await api.post("access/subscription/resume", {}, { requireAuth: true });
  return data;
};
/** Stripe's billing page (update the card, see invoices): `{url}`, or 404 NO_CUSTOMER before a first payment. */
export const openBillingPortal = async (returnUrl: string) => {
  const { data } = await api.post("access/billing-portal", { return_url: returnUrl }, { requireAuth: true });
  return data;
};

/* ============================= */
/* 📌 Addresses */
/* ============================= */
// Delivery addresses are checked with Shippo before they are saved; the answer
// carries `corrected: true` and `original_address` when Shippo changed it.
export const addNewAddress = async (payload: any) => {
  const { data } = await api.post("order/addNewAddress", payload, { requireAuth: true });
  return data;
};
export const addNewAddressWithoutToken = async (payload: any) => {
  const { data } = await api.post("order/addNewAddress-public", payload, {
    withSession: true,
    headers: cardTokenHeader(payload?.business_card_id),
  });
  return data;
};
export const EditAddressWithoutTokenAPI = async (addressId: number | string, payload: any) => {
  const { data } = await api.put(`order/editAddress-public/${addressId}`, payload, {
    withSession: true,
    headers: cardTokenHeader(payload?.business_card_id),
  });
  return data;
};
export const getAllUserAddress = async () => {
  const { data } = await api.get("order/getAllUserAddress", { requireAuth: true });
  return data;
};
export const editAddress = async (addressId: string | number, payload: any) => {
  const { data } = await api.put(`order/editAddress/${addressId}`, payload, { requireAuth: true });
  return data;
};
export const deleteAddress = async (addressId: string | number) => {
  const { data } = await api.post(`order/deleteAddress/${addressId}`, null, { requireAuth: true });
  return data;
};

/* ============================= */
/* 📌 Payments */
/* ============================= */
export const getPaymenthistory = async () => {
  const { data } = await api.get("businessCard/payment-history", { requireAuth: true });
  return data;
};


/* ============================= */
/* 📌 Reference data */
/* ============================= */
export const userSpecialtiesApi = async () => {
  const { data } = await api.get("profession?page=1&limit=1000&sortBy=asc");
  return data;
};

/* ============================= */
/* 📌 Contact Us */
/* ============================= */
export const contactUs = async (payload: {
  name: string;
  subject: string;
  email: string;
  message: string;
  mobile: string;
}) => {
  const { data } = await api.post("contactUs", payload);
  return data;
};
/* ============================= */
/* 📌 Partnership Inquiry */
/* ============================= */
export const partnershipInquiry = async (payload: {
  name: string;
  company_brand: string;
  email: string;
  website_instagram: string;
  interested_in: string[];
  message: string;
}) => {
  const { data } = await api.post("partnership-inquiry", payload);
  return data;
};
/* ============================= */
/* 📌 Newsletter and feature requests */
/* ============================= */
// `source` names the form: "popup", "footer", "podcast" (the podcast's Notify me).
export const subscribeNewsletter = async (payload: {
  email: string;
  first_name?: string;
  last_name?: string;
  source: string;
}) => {
  const { data } = await api.post("newsletter/subscribe", payload);
  return data;
};
// "Apply for Feature": every field is required, as on the form.
export const submitFeatureRequest = async (payload: {
  name: string;
  specialty: string;
  email: string;
  phone: string;
  city: string;
  interest: string;
}) => {
  const { data } = await api.post("feature-request", payload);
  return data;
};
/* ============================= */
/* 📌 Ads */
/* ============================= */
// Only the ads to show now: active and inside their dates.
export const getAds = async () => {
  const { data } = await api.get("ads", { params: { live: true } });
  return data;
};
export const trackAdEvent = async (payload: { ad_id: number; type: "impression" | "click" }) => {
  const { data } = await api.post("ads/track", payload);
  return data;
};
/* ============================= */
/* 📌 Professional and brand pages */
/* ============================= */
export const trackProfileEventApi = async (
  slug: string,
  payload: {
    event_type: string;
    event_target?: string | null;
    visitor_id?: string;
    session_id?: string;
  }
) => {
  const { data } = await api.post(`profiles/${encodeURIComponent(slug)}/events`, payload);
  return data;
};
/* ============================= */
/* 📌 The owner's page and products (dashboard) */
/* ============================= */
// { user_id, slug, page, visible, hidden_because, public }
export const getMyProfile = async () => {
  const { data } = await api.get("my/profile", { requireAuth: true });
  return data;
};
// A form: tagline, about, intro, category, shipping, website, social (JSON); profile_image (the logo), images (the
// cover) and about_image as files, or image / cover_image / about_image "" to remove one
export const updateMyProfile = async (formData: FormData) => {
  const { data } = await api.put("my/profile", formData, { requireAuth: true });
  return data;
};
export const getMyProfileAnalytics = async (params?: { from?: string; to?: string }) => {
  const { data } = await api.get("my/profile/analytics", { params, requireAuth: true });
  return data;
};
export const getMyProducts = async (params?: { page?: number; limit?: number }) => {
  const { data } = await api.get("my/products", { params, requireAuth: true });
  return data;
};
// A form: title, short_description, description, category, brand, price, link, status; the cover as `images`
export const createMyProduct = async (formData: FormData) => {
  const { data } = await api.post("my/products", formData, { requireAuth: true });
  return data;
};
export const updateMyProduct = async (id: number | string, formData: FormData) => {
  const { data } = await api.put(`my/products/${id}`, formData, { requireAuth: true });
  return data;
};
export const deleteMyProduct = async (id: number | string) => {
  const { data } = await api.delete(`my/products/${id}`, { requireAuth: true });
  return data;
};
/* ============================= */
/* 📌 The owner's Media & Images and Education (dashboard) */
/* ============================= */
// Every answer comes in the API's envelope; `data` holds what each comment names.
export interface ApiAnswer<T> {
  success?: boolean;
  message?: string;
  data: T;
}
export interface OwnerRows<T> {
  count: number;
  rows: T[];
}
/** Reports how much of a request's upload has gone, from 0 to 1. */
export type UploadProgress = (fraction: number) => void;
const uploadProgress = (onProgress?: UploadProgress): AxiosRequestConfig =>
  onProgress
    ? { onUploadProgress: (e) => onProgress(Math.min(1, e.progress ?? (e.total ? e.loaded / e.total : 0))) }
    : {};

// { count, rows: OwnerMedia[] }: the owner's items in order, hidden ones too
export const getMyMedia = async (params?: { page?: number; limit?: number }) => {
  const { data } = await api.get<ApiAnswer<OwnerRows<OwnerMedia>>>("my/profile/media", { params, requireAuth: true });
  return data;
};
// A form: `images` (at most 20 a request) and/or `videos` with `video_thumbnails` (the same order, at most 10), plus
// `captions` (JSON, images then videos). { rows }: the items added
export const addMyMedia = async (formData: FormData, onProgress?: UploadProgress) => {
  const { data } = await api.post<ApiAnswer<{ rows: OwnerMedia[] }>>("my/profile/media", formData, {
    requireAuth: true,
    ...uploadProgress(onProgress),
  });
  return data;
};
// A YouTube or Vimeo link. { rows }
export const addMyMediaLink = async (payload: { url: string; caption?: string }) => {
  const { data } = await api.post<ApiAnswer<{ rows: OwnerMedia[] }>>("my/profile/media", payload, { requireAuth: true });
  return data;
};
// Copies the Access card's gallery items not imported yet. { rows }
export const importMyCardMedia = async () => {
  const { data } = await api.post<ApiAnswer<{ rows: OwnerMedia[] }>>("my/profile/media/import-card", {}, { requireAuth: true });
  return data;
};
// The item
export const updateMyMedia = async (id: number, payload: { caption?: string; alt?: string }) => {
  const { data } = await api.put<ApiAnswer<OwnerMedia>>(`my/profile/media/${id}`, payload, { requireAuth: true });
  return data;
};
// The full order: every id. { ok: true }
export const reorderMyMedia = async (ids: number[]) => {
  const { data } = await api.put<ApiAnswer<{ ok: boolean }>>("my/profile/media/order", { ids }, { requireAuth: true });
  return data;
};
export const deleteMyMedia = async (id: number) => {
  const { data } = await api.delete<ApiAnswer<{ deleted: boolean }>>(`my/profile/media/${id}`, { requireAuth: true });
  return data;
};
// { count, rows: OwnerEducation[] }: the owner's posts in order, drafts too
export const getMyEducation = async (params?: { page?: number; limit?: number }) => {
  const { data } = await api.get<ApiAnswer<OwnerRows<OwnerEducation>>>("my/profile/education", { params, requireAuth: true });
  return data;
};
// One post, with its `body`
export const getMyEducationItem = async (id: number) => {
  const { data } = await api.get<ApiAnswer<OwnerEducation>>(`my/profile/education/${id}`, { requireAuth: true });
  return data;
};
// A form: kind ("video" | "article"), title, summary, status ("published" | "draft"), body (articles' HTML),
// video_url (YouTube or Vimeo) or `videos` + `video_thumbnails` files (videos), the cover as an `images` file or a
// `cover_image` link ("" removes it). The post
export const createMyEducation = async (formData: FormData, onProgress?: UploadProgress) => {
  const { data } = await api.post<ApiAnswer<OwnerEducation>>("my/profile/education", formData, {
    requireAuth: true,
    ...uploadProgress(onProgress),
  });
  return data;
};
// The same fields as creating one, each optional. The post
export const updateMyEducation = async (id: number, formData: FormData, onProgress?: UploadProgress) => {
  const { data } = await api.put<ApiAnswer<OwnerEducation>>(`my/profile/education/${id}`, formData, {
    requireAuth: true,
    ...uploadProgress(onProgress),
  });
  return data;
};
// The full order: every id. { ok: true }
export const reorderMyEducation = async (ids: number[]) => {
  const { data } = await api.put<ApiAnswer<{ ok: boolean }>>("my/profile/education/order", { ids }, { requireAuth: true });
  return data;
};
export const deleteMyEducation = async (id: number) => {
  const { data } = await api.delete<ApiAnswer<{ deleted: boolean }>>(`my/profile/education/${id}`, { requireAuth: true });
  return data;
};
/** One picture for a blog post's body (`images`). Answers its link. */
export const uploadMyProfileImage = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append("images", file);
  const { data } = await api.post<ApiAnswer<{ location?: string }> & { location?: string }>("my/profile/uploads", form, {
    requireAuth: true,
  });
  const location = data?.data?.location ?? data?.location;
  if (!location) throw new Error("The picture didn't upload. Please try again.");
  return location;
};
/* ============================= */
/* 📌 Directory */
/* ============================= */
// Live Access cards and approved applications, nearest first when a place is given.
export const searchDirectory = async (params: {
  lat?: number;
  lng?: number;
  location?: string;
  q?: string;
  specialty?: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await api.get("directory/search", { params });
  return data;
};
// Google's listings near a place; the photos come through the API, so no key reaches the browser.
export const getGoogleListings = async (params: {
  lat?: number;
  lng?: number;
  location?: string;
  type?: string;
  q?: string;
}) => {
  const { data } = await api.get("directory/google", { params });
  return data;
};
// A Google listing as form fields: "Claim This Profile" prefills the Access form from it.
export const getGooglePlaceForm = async (placeId: string) => {
  const { data } = await api.get(`directory/google/places/${encodeURIComponent(placeId)}`);
  return data;
};
/* ============================= */
/* 📌 Access Card Analytics */
/* ============================= */
export const trackAccessCardEventApi = async (payload: {
  business_card_id: number;
  event_type: string;
  event_target: string | null;
  visitor_id: string;
  session_id: string;
  metadata: Record<string, unknown>;
}) => {
  const { data } = await api.post("access-card/analytics/event", payload);
  return data;
};
// Date params are YYYY-MM-DD; omit them to use the backend's default range.
export interface AccessCardAnalyticsParams {
  from?: string;
  to?: string;
}
const tz = () => ({ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
export const getAccessCardAnalytics = async (
  businessCardId: number | string,
  params?: AccessCardAnalyticsParams
) => {
  const { data } = await api.get(`access-card/analytics/${businessCardId}`, {
    params,
    requireAuth: true,
    headers: tz(),
  });
  return data;
};
export const getAccessCardAnalyticsEvents = async (
  businessCardId: number | string,
  params?: AccessCardAnalyticsParams
) => {
  const { data } = await api.get(`access-card/analytics/${businessCardId}/events`, {
    params,
    requireAuth: true,
    headers: tz(),
  });
  return data;
};
