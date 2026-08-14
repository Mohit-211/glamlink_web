import { BOOKING_METHODS, GlamCardFormData } from "./GlamCardForm/types";

const profileImgUrl =
  "https://node.glamlink.net/images/profile_image-1786443475610.jpg";
const galleryImg1Url =
  "https://node.glamlink.net/images/images-1786443475619.jpg";
const galleryImg2Url =
  "https://node.glamlink.net/images/images-1786443475614.jpg";
/* ================= HELPER ================= */
async function urlToFile(
  url: string,
  filename: string
): Promise<File> {
  const res = await fetch(url);
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
  const [profile_image, img1, img2] =
    await Promise.all([
      urlToFile(
        profileImgUrl,
        "profile_image-1786443475610.jpg"
      ),
      urlToFile(
        galleryImg1Url,
        "images-1786443475619.jpg"
      ),
      urlToFile(
        galleryImg2Url,
        "images-1786443475614.jpg"
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
    images: [img1, img2],
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
    ],
    /* ================= MARKETING ================= */
    elite_setup: false,
    offer_promotion: undefined,
    promotion_details: "",
    excites_about_glamlink: [],
    biggest_pain_points: [],
  };
}