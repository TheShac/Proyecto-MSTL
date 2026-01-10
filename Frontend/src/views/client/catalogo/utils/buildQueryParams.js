export const buildQueryParams = (params) => {
  const clean = {};

  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value !== "" && value !== null && value !== undefined) {
      clean[key] = value;
    }
  });

  return clean;
};
