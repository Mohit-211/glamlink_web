import axios from "axios";

const api = axios.create({
  baseURL: "https://node.glamlink.net:5000/api/v1/",
});
// Get Categories
export const getCategories = async () => {
  const response = await api.get("journalCategory");
  return response.data;
};
// Get All Blogs
export const getAllBlogs = async () => {
  const response = await api.get("journal");
  return response.data;
};

// find blogs by id
export const getBlogsById = async (id: any) => {
  const response = await api.get(`journal/findJournalById/${id}`);
  return response.data;
};

// find Blog by Category id
export const getBlogsByCategpryId = async (category_id: any) => {
  const response = await api.get(`journal/${category_id}`);
  return response.data;
};


