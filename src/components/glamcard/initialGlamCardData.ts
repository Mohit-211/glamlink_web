import { GlamCardFormData } from "./GlamCardForm/types";

export const initialGlamCardData: GlamCardFormData = {
  name: "Sophia Martinez",
  professional_title: "Master Hair Stylist & Colorist",
  email: "sophia@luxebeauty.com",
  phone: "123-456-7890",
  business_name: "Luxe Beauty Studio",
  bio: "Award-winning stylist with 8+ years of experience.",

  primary_specialty: "Hair Styling & Color",
  specialties: [],

  // gallery_meta: [],
  custom_handle: "luxebeauty",
  website: "https://luxebeauty.com",

  social_media: {},
  preferred_booking_method: "instagram",
  important_info: ["Deposit required to secure booking"],

  business_hour: [
    { day: "Monday", open_time: "09:00", close_time: "17:00", closed: false },
    { day: "Tuesday", open_time: "09:00", close_time: "17:00", closed: false },
    { day: "Wednesday", open_time: "09:00", close_time: "17:00", closed: false },
    { day: "Thursday", open_time: "09:00", close_time: "17:00", closed: false },
    { day: "Friday", open_time: "09:00", close_time: "17:00", closed: false },
    { day: "Saturday", open_time: "", close_time: "", closed: true },
    { day: "Sunday", open_time: "", close_time: "", closed: true },
  ],
  locations: [],

  elite_setup: false,

  gallery_meta: [],
  profile_image: undefined,
  images: [],
  booking_link: "",
  offer_promotion: undefined,
  promotion_details:"",
  excites_about_glamlink: [],
  biggest_pain_points: [],
  profileImage: undefined
};
