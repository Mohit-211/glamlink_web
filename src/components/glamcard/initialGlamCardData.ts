import { nanoid } from "nanoid";
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
    primary_specialty: "Hair Stylist",
    specialties: ["Hair Styling", "Makeup", "Skincare", "Nails"],
    /* ================= HANDLES ================= */
    custom_handle: "yourhandle",
    instagram_handle: "yourhandle",
    website: "https://example.com",
    /* ================= SOCIAL ================= */
    social_media: {
      instagram: "https://instagram.com/yourhandle",
      facebook: "https://facebook.com/yourhandle",
      linkedin: "https://linkedin.com/in/yourhandle",
      youtube: "https://youtube.com/@yourhandle",
      tiktok: "https://tiktok.com/@yourhandle",
    },
    other_links: [{ title: "My Portfolio", url: "https://example.com/portfolio" }],
    preferred_booking_methods: [BOOKING_METHODS.LINK, BOOKING_METHODS.CALL],
    booking_link: "https://example.com/book",
    important_info: [
      "Add your important information here.",
    ],
    /* ================= BUSINESS HOURS ================= */
    business_hour: [
      { note: "Mon–Fri: 9:00 AM – 6:00 PM" },
      { note: "Sat: 10:00 AM – 4:00 PM" },
      { note: "Sun: Closed" },
    ],
    /* ================= LOCATION ================= */
    locations: [
      {
        id: nanoid(),
        label: "Location 1",
        location_type: "exact_address",
        address: "123 Main Street",
        area: "Downtown",
        city: "Los Angeles",
        state: "CA",
        phone: "1234567890",
        description: "Our main studio location.",
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
    offer_promotion: true,
    promotion_details: "20% off first booking for new clients.",
    excites_about_glamlink: ["Reaching new clients", "Easy online booking"],
    biggest_pain_points: ["Finding new clients", "Managing appointments"],
  };
}