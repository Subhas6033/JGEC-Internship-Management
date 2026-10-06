export const getDisplayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }
  return value;
};

export const formatDate = (date) => {
  if (!date) return "Not available";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }
  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};
