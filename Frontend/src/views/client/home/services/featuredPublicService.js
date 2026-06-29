import api from "../../../../services/api";

export const getFeaturedPublic = () => api.get("/featured");
