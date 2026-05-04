import { GlamCardFormData } from "./GlamCardForm/types";

import profileImg from "../../../public/fashion/pexels-decembrenell-3317434.jpg";
import galleryImg1 from "../../../public/fashion/pexels-element5-973403.jpg";
import galleryImg2 from "../../../public/fashion/pexels-pixabay-38554.jpg";
import galleryImg3 from "../../../public/fashion/pexels-pixabay-159780.jpg";

/* ================= HELPER ================= */
async function urlToFile(url: string, filename: string): Promise<File> {
  const fullUrl =
    typeof window !== "undefined"
      ? window.location.origin + url
      : url;

  const res = await fetch(fullUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
}

/* ================= MAIN ================= */
export async function initialGlamCardData(): Promise<GlamCardFormData> {
  // prevent SSR crash
  if (typeof window === "undefined") {
    return {} as GlamCardFormData;
  }

  const [profile_image, img1, img2, img3] = await Promise.all([
    urlToFile(profileImg.src, "pexels-decembrenell-3317434.jpg"),
    urlToFile(galleryImg1.src, "pexels-element5-973403.jpg"),
    urlToFile(galleryImg2.src, "pexels-pixabay-38554.jpg"),
    urlToFile(galleryImg3.src, "pexels-pixabay-159780.jpg"),
  ]);

  return {
    /* BASIC INFO */
    name: "Sophia Martinez",
    professional_title: "Master Hair Stylist & Colorist",
    email: "sophia@luxebeauty.com",
    phone: "123-456-7890",
    booking_phone: "123-456-7890", // ✅ FIXED

    business_name: "Luxe Beauty Studio",
    bio: "Award-winning stylist with 8+ years of experience specializing in balayage, lived-in color, and transformative hair makeovers.",

    /* SPECIALTIES */
    primary_specialty: "Hair Styling & Color",
    specialties: ["Balayage", "Color Correction", "Bridal Styling", "Extensions"],

    /* HANDLES */
    custom_handle: "luxebeauty",
    instagram_handle: "luxebeauty", // ✅ FIXED

    website: "https://luxebeauty.com",

    social_media: {
      instagram: "https://instagram.com/luxebeauty",
    },

    /* BOOKING */
    preferred_booking_method: "instagram",
    booking_link: "",
    important_info: ["Deposit required to secure booking"],

    /* HOURS */
    business_hour: [
      { note: "Mon-Fri: 10am - 7pm" },
      { note: "Sat: 10am - 5pm" },
      { note: "Sun: Closed" },
    ],

    /* LOCATION */
    locations: [
      {
        id: "location-1",
        label: "Luxe Beauty Studio - Las Vegas",
        location_type: "exact_address",
        address: "7575 S Rainbow Blvd UNIT 107, Las Vegas, NV 89139, USA",
        city: "Las Vegas",
        area: "Southwest",
        state: "NV",
        business_name: "Luxe Beauty Studio",
        phone: "123-456-7890",
        description: "Located in SW Las Vegas near Rainbow Blvd",
        isPrimary: true,
        isOpen: true,
      },
    ],

    /* MEDIA */
    profile_image,
    images: [img1, img2, img3],

    gallery_meta: [
      {
        id: "sample-1",
        caption: "Stunning Balayage Transformation",
        is_thumbnail: true,
        sort_order: 0,
      },
      {
        id: "sample-2",
        caption: "Color Correction Result",
        is_thumbnail: false,
        sort_order: 1,
      },
      {
        id: "sample-3",
        caption: "Bridal Styling",
        is_thumbnail: false,
        sort_order: 2,
      },
    ],

    /* MARKETING */
    elite_setup: false,
    offer_promotion: undefined,
    promotion_details: "",

    excites_about_glamlink: [],
    biggest_pain_points: [],
  };
}