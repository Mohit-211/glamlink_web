import { BOOKING_METHODS, GlamCardFormData } from "./GlamCardForm/types";
import profileImg from "../../../public/fashion/pexels-decembrenell-3317434.jpg";
import galleryImg1 from "../../../public/fashion/pexels-element5-973403.jpg";
import galleryImg2 from "../../../public/fashion/pexels-pixabay-38554.jpg";
import galleryImg3 from "../../../public/fashion/pexels-pixabay-159780.jpg";
/* ================= HELPER ================= */
async function urlToFile(
  url: string,
  filename: string
): Promise<File> {
  const fullUrl =
    typeof window !== "undefined"
      ? window.location.origin + url
      : url;
  const res = await fetch(fullUrl);
  const blob = await res.blob();
  return new File([blob], filename, {
    type: blob.type,
  });
}
/* ================= MAIN ================= */
export async function initialGlamCardData(): Promise<GlamCardFormData> {
  // Prevent SSR crash
  if (typeof window === "undefined") {
    return {} as GlamCardFormData;
  }
  const [profile_image, img1, img2, img3] =
    await Promise.all([
      urlToFile(
        profileImg.src,
        "pexels-decembrenell-3317434.jpg"
      ),
      urlToFile(
        galleryImg1.src,
        "pexels-element5-973403.jpg"
      ),
      urlToFile(
        galleryImg2.src,
        "pexels-pixabay-38554.jpg"
      ),
      urlToFile(
        galleryImg3.src,
        "pexels-pixabay-159780.jpg"
      ),
    ]);
  return {
    /* ================= BASIC INFO ================= */
    name: "John Doe",
    professional_title: "Your Profession",
    email: "example@email.com",
    phone: "1234567890",
    booking_phone: "1234567890",
    bio: `
    <p>Enter your bio here.</p>
   
  `,
  is_phone_visible: true,
    business_name: "Your Business Name",
    /* ================= SPECIALTIES ================= */
    primary_specialty: "Your Specialty",
    specialties: [
      
    ],
    /* ================= HANDLES ================= */
    custom_handle: "yourhandle",
    instagram_handle: "yourhandle",
    website: "https://example.com",
    /* ================= SOCIAL ================= */
    social_media: {
      instagram: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      tiktok: "",
    },
    other_links: [],
    preferred_booking_methods: [],
    booking_link: "",
    important_info: [
      "Add your important information here.",
    ],
    /* ================= BUSINESS HOURS ================= */
    business_hour: [],
    /* ================= LOCATION ================= */
    locations: [
      {
        id: "location-1",
        label: "Main Office",
        location_type: "exact_address",
        address: "123 Sample Street",
        city: "Sample City",
        state: "Sample State",
        area: "Sample Area",
        phone: "1234567890",
        description: "Replace with your business address.",
        isPrimary: true,
        isOpen: true,
      },
    ],
    /* ================= IMAGES ================= */
    profile_image,
    images: [img1, img2, img3],
    gallery_meta: [
      {
        id: "1",
        caption: "Sample Image 1",
        is_thumbnail: true,
        sort_order: 0,
      },
      {
        id: "2",
        caption: "Sample Image 2",
        is_thumbnail: false,
        sort_order: 1,
      },
      {
        id: "3",
        caption: "Sample Image 3",
        is_thumbnail: false,
        sort_order: 2,
      },
    ],
    /* ================= MARKETING ================= */
    elite_setup: false,
    offer_promotion: undefined,
    promotion_details: "",
    excites_about_glamlink: [],
    biggest_pain_points: [],
  };
}