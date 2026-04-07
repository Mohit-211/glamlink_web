import axios from "axios";

const api = axios.create({
  baseURL: "https://node.glamlink.net:5000/api/v1/",
});

// =============================
// 📌 Get Categories
// =============================
export const getCategories = async () => {
  const response = await api.get("journalCategory");
  return response.data;
};

export const getallCategories = async () => {
  const response = await api.get("businessCard/getAllCategories");
  return response.data;
};
// =============================
// 📌 Get All Blogs
// =============================
export const getAllBlogs = async () => {
  const response = await api.get("journal");
  return response.data;
};
// =============================
// 📌 Get Blog By ID
// =============================
export const getBlogsById = async (id: any) => {
  const response = await api.get(`journal/findJournalById/${id}`);
  return response.data;
};
// =============================
// 📌 Get Blog By Category ID
// =============================
export const getBlogsByCategpryId = async (category_id: any) => {
  const response = await api.get(`journal/${category_id}`);
  return response.data;
};

// =============================
// 📌 Get Business Card By Slug
// =============================
export const getBusinessCardBySlug = async (slug: string) => {
  console.log(slug,"==>")
  try {
    const response = await api.get(`businessCard/getBusinessCard/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// =============================
// 📌 🔥 Search Business Card
// =============================
export const searchBusinessCard = async (params: {
  specialty?: string;
  location?: string;
  name?: string;
}) => {
  const response = await api.get("businessCard/search", {
    params: params,
  });
  return response.data;
};

// =============================
// 📌 Get Business Profiles
// =============================
export const getBusinessProfile = async () => {
  const response = await api.get("businessCard/getAllProfiles");
  return response.data;
};

// =============================
// 📌 Get Nearby Beauticians
// =============================
export const GetBeauticianListApi = async () => {
  const res = await api.get("user/nearby/map/beautician/list");
  return res.data;
};

// =============================
// 📌 Get All Directories (Categories)
// =============================
export const GetAllCategoryApi = async () => {
  const res = await api.get("businessCard/getAllDirectories");
  return res.data;
};

// =============================
// 📌 Get Profiles By Directory
// =============================
export const GetProfilesByDirectory = async (category_id: any) => {
  const res = await api.get(
    `businessCard/getProfilesByDirectory/${category_id}`
  );
  return res.data;
};

// =============================
// 📌 Get Beautician Details (Google Place)
// =============================
export const GetBeauticianListDetailsApi = async (place_id: string) => {
  try {
    const res = await api.get(
      `user/google-locations/details/${place_id}`
    );
    return res.data;
  } catch (error) {
    console.error("Beautician Details API Error:", error);
    throw error;
  }
};

// =============================
// 🆕 📌 Get All States
// =============================
export const getAllStates = async () => {
  try {
    const res = await api.get("state");
    return res.data;
  } catch (error) {
    console.error("Get States API Error:", error);
    throw error;
  }
};

// =============================
// 🆕 📌 Get Cities By State ID
// =============================
export const getCitiesByState = async (state_id: any) => {
  try {
    const res = await api.get(`state/${state_id}`);
    return res.data;
  } catch (error) {
    console.error("Get Cities API Error:", error);
    throw error;
  }
};
