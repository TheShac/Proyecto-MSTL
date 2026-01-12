import axios from "axios";

const API_FEATURED = "http://localhost:3000/api/featured";

export const getFeaturedPublic = async () => {
  const { data } = await axios.get(API_FEATURED);
  return data;
};
