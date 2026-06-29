import api from "../../../../services/api";

export const getOffersPublic = (limit = 12) =>
  api.get("/offers", { params: { limit } });
