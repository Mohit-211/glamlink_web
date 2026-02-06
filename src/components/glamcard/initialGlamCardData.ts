import { GlamCardFormData } from "./GlamCardForm/types";

export const initialGlamCardData: GlamCardFormData = {
  name: "Sophia Martinez",
  professional_title: "Master Hair Stylist & Colorist",
  email: "sophia@luxebeauty.com",
  phone: "123-456-7890",
  business_name: "Luxe Beauty Studio",
  bio: "Award-winning stylist with 8+ years of experience.",

  primary_specialty: "Hair Styling & Color",
  specialties: ["Balayage", "Color Correction", "Bridal Styling"],

  // gallery_meta: [],
  custom_handle: "luxebeauty",
  website: "https://luxebeauty.com",

  social_media: {},
  preferred_booking_method: "instagram",
  important_info: ["Deposit required to secure booking"],

  business_hours: [
    { day: "Monday", open_time: "09:00", close_time: "17:00" },
    { day: "Tuesday", open_time: "09:00", close_time: "17:00" },
    { day: "Wednesday", open_time: "09:00", close_time: "17:00" },
    { day: "Thursday", open_time: "09:00", close_time: "17:00" },
    { day: "Friday", open_time: "09:00", close_time: "17:00" },
    { day: "Saturday", open_time: "", close_time: "" },
    { day: "Sunday", open_time: "", close_time: "" },
  ],
  locations: [],

  promo: false,
  eliteSetup: true,
  excitement: [],
  painPoints: [],
  gallery_meta: []
};
