const mobilePrefix = "+91";

/**
 * Normalizes mobile number by adding +91 prefix and removing non-digits
 * @param {string} value - Raw mobile number value
 * @returns {string} - Normalized mobile number with +91 prefix
 */
export const normalizeMobileNumber = (value) => {
  const digits = String(value || "").replace(/\D/g, "");

  if (!digits) return "";

  return `${mobilePrefix}${digits}`;
};
