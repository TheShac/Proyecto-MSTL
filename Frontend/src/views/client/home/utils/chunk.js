export const chunk = (arr = [], size = 4) => {
  if (!Array.isArray(arr) || size <= 0) return [];
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
};
