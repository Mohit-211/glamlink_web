import axios from "axios";

const api = axios.create({
  baseURL: "https://node.glamlink.net:5000/api/v1/",
});

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
  specialty?: string;
  location?: string;
  name?: string;
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
    const { data } = await api.get("state");
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
  try {
    const { data } = await api.get("city", {
      params: {
        state_id,
      },
    });

    return data;
  } catch (error) {
    console.error("Get Cities API Error:", error);
    throw error;
  }
};