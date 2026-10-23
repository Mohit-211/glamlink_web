import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { API_URL } from "@/lib/config";
import { handleSignedOut } from "@/lib/auth";
import {
  clearSession,
  getAccessToken,
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
    /** Internal: this request was already retried after a refresh. */
    _retried?: boolean;
  }
}

const isBrowser = typeof window !== "undefined";

const api = axios.create({
  baseURL: API_URL,
});

/* The access token lives in memory (lib/session). Calls that need sign-in wait
   for the session to be restored on page load; every other call sends the token
   when there is a fresh one, so optional-auth routes show the person's view. */
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (!isBrowser) return config;
  let token = peekAccessToken();
  if (!token && config.requireAuth) {
    await sessionReady();
    token = await getAccessToken();
  }
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

/* 401 SESSION_EXPIRED: the access token ran out or the session ended. Refresh
   once and retry; if the refresh fails too, the person is signed out. */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config as AxiosRequestConfig | undefined;
    const status = error?.response?.status;
    const code = error?.response?.data?.code;
    if (!isBrowser || !config || status !== 401) return Promise.reject(error);

    if (code === "SESSION_EXPIRED" && !config._retried) {
      const token = await refreshSession();
      if (token) {
        config._retried = true;
        config.headers = { ...(config.headers as any), Authorization: `Bearer ${token}` };
        return api.request(config);
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
    headers: cardTokenHeader(cardId),
  });
  return data;
};
export const reorderFeaturedLinks = async (cardId: string | number, featured_links: unknown[]) => {
  const { data } = await api.put(
    `businessCard/${cardId}/featured-links/reorder`,
    { featured_links },
    { headers: cardTokenHeader(cardId) }
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
/** Plans with prices for whoever asks: a guest passes their draft card for personal prices. */
export const getAccessPlans = async (businessCardId?: string | number | null) => {
  const { data } = await api.get("access/plans", {
    params: businessCardId ? { business_card_id: businessCardId } : undefined,
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
    headers: cardTokenHeader(payload.business_card_id),
  });
  return data;
};
export const quoteCheckout = async (payload: {
  business_card_id: number | string;
  plan_type: string;
  rate_id?: string;
}) => {
  const { data } = await api.post("access/checkout/quote", payload, {
    headers: cardTokenHeader(payload.business_card_id),
  });
  return data;
};
export const payCheckout = async (checkoutId: number | string, businessCardId: number | string) => {
  const { data } = await api.post(`access/checkout/${checkoutId}/pay`, {}, {
    headers: cardTokenHeader(businessCardId),
  });
  return data;
};
export const getCheckout = async (checkoutId: number | string, businessCardId: number | string) => {
  const { data } = await api.get(`access/checkout/${checkoutId}`, {
    headers: cardTokenHeader(businessCardId),
  });
  return data;
};
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
    headers: cardTokenHeader(payload?.business_card_id),
  });
  return data;
};
export const EditAddressWithoutTokenAPI = async (addressId: number | string, payload: any) => {
  const { data } = await api.put(`order/editAddress-public/${addressId}`, payload, {
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
export const getProfilesApi = async (params: {
  type?: "individual" | "brand";
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await api.get("profiles", { params });
  return data;
};
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
// A form: tagline, about, website, social (JSON), profile_image and images (the cover) as files
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
export const findGoogleBusiness = async (q: string) => {
  const { data } = await api.get("directory/google/search", { params: { q } });
  return data;
};
export const getGooglePlaceForm = async (placeId: string) => {
  const { data } = await api.get(`directory/google/places/${encodeURIComponent(placeId)}`);
  return data;
};
// The directory form: kept as sent for admins to review (photos as profile_image and images).
export const submitDirectoryApplication = async (formData: FormData) => {
  const { data } = await api.post("directory/applications", formData);
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
