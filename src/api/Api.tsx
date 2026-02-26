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

/* ================= GET BUSINESS CARD BY SLUG ================= */

export const getBusinessCardBySlug = async (slug: string) => {
  try {
    const response = await api.get(
      `businessCard/getBusinessCard/${slug}`
    );

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

export const getBusinessProfile = async () => {
  const response = await api.get("businessCard/getAllProfiles");
  return response.data;
};