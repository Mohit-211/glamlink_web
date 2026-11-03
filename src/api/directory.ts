import { api } from "./Api";

/**
 * Glamlink's own professionals in the directory (GET /directory/search with type=individual).
 * Brands have their own list (/brands), so the nearby search leaves them out.
 */
export const searchDirectoryProfessionals = async (params: {
  lat?: number;
  lng?: number;
  location?: string;
  q?: string;
  specialty?: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await api.get("directory/search", { params: { ...params, type: "individual" } });
  return data;
};
