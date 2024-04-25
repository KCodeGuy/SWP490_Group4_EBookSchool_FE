// contains common methods

export const countDuplicateItemsInArray = (arr) => {
  // Count occurrences of each key
  const counts = arr.reduce((acc, { key }) => {
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Convert counts object to array of objects with key and count
  return Object.keys(counts).map((key) => ({ key, count: counts[key] }));
};
