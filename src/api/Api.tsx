import axios from "axios";
const api = axios.create({
  baseURL: "https://node.glamlink.net:5000/api/v1/",
});
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("GlamlinkaccessToken");
  }
  return null;
};
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
export const getMyBusinessCard = async () => {
  const { data } = await api.get(
    "businessCard/getMyBusinessCard",
    {
      headers: {
        "x-access-token": getToken(),
      },
    }
  );
  return data;
};
/* ============================= */
/* 📌 Blogs */
/* ============================= */
export const getAllBlogs = async () => {
  const { data } = await api.get("journal");
  return data;
};
export const getTypeBlogs = async (type: String) => {
  const { data } = await api.get(`discover/${type}`);
  return data;
};
export const getBlogsById = async (id: string | number) => {
  const { data } = await api.get(
    `journal/findJournalById/${id}`
  );
  return data;
};
export const getBlogsByCategoryId = async (
  category_id: string | number
) => {
  const { data } = await api.get(
    `journal/${category_id}`
  );
  return data;
};
/* ============================= */
/* 📌 Podcast */
/* ============================= */
export const getAllPodcast = async () => {
  const { data } = await api.get(
    "podcast-schedule/list"
  );
  return data;
};
/* ============================= */
/* 📌 Business Card */
/* ============================= */
export const getBusinessCardBySlug = async (
  slug: string
) => {
  try {
    const { data } = await api.get(
      `businessCard/getBusinessCard/${slug}`
    );
    return data;
  } catch (error) {
    console.error("Business Card API Error:", error);
    throw error;
  }
};
/* ============================= */
/* 📌 Search Business Card */
/* ============================= */
export const searchBusinessCard = async (params: {
  search?: string;

}) => {
  const { data } = await api.get(
    "businessCard/search",
    { params }
  );
  return data;
};
/* ============================= */
/* 📌 Profiles */
/* ============================= */
export const getBusinessProfile = async () => {
  const { data } = await api.get(
    "businessCard/getAllProfiles"
  );
  return data;
};
/* ============================= */
/* 📌 Nearby Beauticians */
/* ============================= */
export const GetBeauticianListApi = async () => {
  const { data } = await api.get(
    "user/nearby/map/beautician/list"
  );
  return data;
};
/* ============================= */
/* 📌 Directories */
/* ============================= */
export const GetAllCategoryApi = async () => {
  const { data } = await api.get(
    "businessCard/getAllDirectories"
  );
  return data;
};
export const GetProfilesByDirectory = async (
  category_id: string | number
) => {
  const { data } = await api.get(
    `businessCard/getProfilesByDirectory/${category_id}`
  );
  return data;
};
/* ============================= */
/* 📌 Beautician Details */
/* ============================= */
export const GetBeauticianListDetailsApi = async (
  place_id: string
) => {
  try {
    const { data } = await api.get(
      `user/google-locations/details/${place_id}`
    );
    return data;
  } catch (error) {
    console.error(
      "Beautician Details API Error:",
      error
    );
    throw error;
  }
};
/* ============================= */
/* 📌 States */
/* ============================= */
export const getAllStates = async () => {
  try {
    const { data } = await api.get("country/233");
    return data;
  } catch (error) {
    console.error("Get States API Error:", error);
    throw error;
  }
};
/* ============================= */
/* 📌 Cities */
/* ============================= */
export const getCitiesByState = async (state_id: string | number) => {
  if (!state_id) {
    return { data: [] };
  }
  // If already a number, use it directly
  if (typeof state_id === 'number') {
    try {
      const { data } = await api.get(`state/${state_id}`);
      return data;
    } catch (error) {
      console.error("Failed to fetch cities for state_id:", state_id, error);
      return { data: [] };
    }
  }
  // Try to parse as numeric string first
  const numericId = parseInt(state_id, 10);
  if (!isNaN(numericId)) {
    try {
      const { data } = await api.get(`state/${numericId}`);
      return data;
    } catch (error) {
      console.error("Failed to fetch cities for state_id:", numericId, error);
      return { data: [] };
    }
  }
  // If not numeric, it might be a state abbreviation or name - log and return empty
  console.warn(`State value "${state_id}" is not numeric. Please ensure state is stored as numeric ID.`);
  return { data: [] };
};
/* ============================= */
/* 📌 Auth - Register */
/* ============================= */
export const registerUser = async (payload: {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirm_password: string;
}) => {
  const { data } = await api.post(
    "user/auth/register",
    payload,
    {
      headers: {
        role_id: 7,
      },
    }
  );
  return data;
};
export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const { data } = await api.post(
    "user/auth/login",
    payload,
    {
      headers: {
        role_id: "7",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
    }
  );
  return data;
};
export const LogoutUser = async () => {
  const { data } = await api.get("user/auth/logout", {
    headers: {
      "x-access-token": getToken(),
      role_id: "7",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
  return data;
};
export const sendOtp = async (payload: {
  email: string;
  type: string;
}) => {
  const { data } = await api.post(
    "user/auth/otp",
    payload,
    {
      headers: {
        role_id: "7",
      },
    }
  );
  return data;
};
export const verifyOtp = async (payload: {
  email: string;
  otp: string;
  type: string;
}) => {
  try {
    console.log("Verify OTP Payload:", payload);
    const response = await api.post(
      "user/auth/verify-otp",
      payload,
      {
        headers: {
          role_id: "7",
          timezone:
            Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      }
    );
    console.log("Verify OTP Success:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Verify OTP Failed");
    console.error("Status:", error?.response?.status);
    console.error("Response:", error?.response?.data);
    console.error("Payload:", payload);
    throw error;
  }
};
export const ChangePassword = async (payload: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}) => {
  const { data } = await api.post(
    "user/auth/reset-password",
    payload,
    {
      headers: {
        "x-access-token": getToken(),
      },
    }
  );
  return data;
};
/* ============================= */
/* 📌 Single Business Card For Dashboard */
/* ============================= */
export const getMyBusinessCardForDashboard = async () => {
  const { data } = await api.get(
    `businessCard/getMyBusinessCard`,
    {
      headers: {
        "x-access-token": getToken(),
      },
    }
  );
  return data;
};
/* ============================= */
/* 📌 Address APIs */
/* ============================= */
// Add New Address
export const addNewAddress = async (payload: any) => {
  const { data } = await api.post(
    "order/addNewAddress",
    payload,
    {
      headers: {
        "x-access-token": getToken(),
      },
    }
  );
  return data;
};
// Get All User Addresses
export const getAllUserAddress = async () => {
  const { data } = await api.get(
    "order/getAllUserAddress",
    {
      headers: {
        "x-access-token": getToken(),
      },
    }
  );
  return data;
};
// Edit Address
export const editAddress = async (
  addressId: string | number,
  payload: any
) => {
  const { data } = await api.put(
    `order/editAddress/${addressId}`,
    payload,
    {
      headers: {
        "x-access-token": getToken(),
      },
    }
  );
  return data;
};
// Delete Address
export const deleteAddress = async (
  addressId: string | number
) => {
  const { data } = await api.post(
    `order/deleteAddress/${addressId}`,
    null, // body
    {
      headers: {
        "x-access-token": getToken(),
      },
    }
  );
  return data;
};
export const addShippingAddress = async (payload: any) => {
  const { data } = await api.post(
    "businessCard/shipping-rate",
    payload,
    {
      headers: {
        "x-access-token": getToken(),
      },
    }
  );
  return data;
};
export const SelectAddressApi = async (payload: any) => {
  const { data } = await api.post(
    "businessCard/select-address",
    payload,
    {
      headers: {
        "x-access-token": getToken(),
      },
    }
  );
  return data;
};
export const CreateSubscription = async (payload: any) => {
  const { data } = await api.post(
    "businessCard/create-subscription",
    payload,
    {
      headers: {
        "x-access-token": getToken(),
      },
    }
  );
  return data;
};
export const getPaymenthistory = async () => {
  const { data } = await api.get(
    "businessCard/payment-history",
    {
      headers: {
        "x-access-token": getToken(),
      },
    }
  );
  return data;
};
export const userProfile = async () => {
  const { data } = await api.get(
    "user/profile",
    {
      headers: {
        "x-access-token": getToken(),
      },
    }
  );
  return data;
};