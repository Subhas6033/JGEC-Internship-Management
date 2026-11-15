import { useEffect, useState } from "react";

export const PAGE_SIZES = [10, 20, 50];
export const DEFAULT_PAGE_SIZE = 10;

export const SORT_OPTIONS = [
  { label: "Newest first", value: "createdAt:desc" },
  { label: "Oldest first", value: "createdAt:asc" },
  { label: "Recently updated", value: "updatedAt:desc" },
  { label: "Name A–Z", value: "organisationName:asc" },
  { label: "Name Z–A", value: "organisationName:desc" },
  { label: "Location A–Z", value: "organisationLocation:asc" },
];

export const parseSort = (value = "createdAt:desc") => {
  const [sortBy, order] = value.split(":");
  return { sortBy, order };
};

/** Delays a fast-changing value (like a search box) before it hits the API. */
export const useDebouncedValue = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
};

const EMPTY_PAGINATION = {
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  total: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
};

/**
 * Normalises GET /organisations:
 * { data: { organisations, pagination, stats, filters: { locations } } }
 * A plain array response still works (single page, no stats).
 */
export const extractOrganisationsPage = (response) => {
  const content = response?.data ?? response ?? {};
  const list = Array.isArray(content) ? content : content.organisations;
  const organisations = Array.isArray(list) ? list : [];

  return {
    organisations,
    pagination: content.pagination ?? {
      ...EMPTY_PAGINATION,
      limit: organisations.length || DEFAULT_PAGE_SIZE,
      total: organisations.length,
    },
    stats: content.stats ?? null,
    locations: Array.isArray(content.filters?.locations)
      ? content.filters.locations
      : [],
  };
};

export const getErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again.",
) => error?.response?.data?.message || error?.message || fallback;

export const formatDate = (
  value,
  options = { day: "2-digit", month: "short", year: "numeric" },
) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", options);
};

export const formatDateTime = (value) =>
  formatDate(value, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/** "https://www.iitm.ac.in/about" → "iitm.ac.in" */
export const getHostname = (site) => {
  if (!site) return "";
  try {
    return new URL(
      /^https?:\/\//i.test(site) ? site : `https://${site}`,
    ).hostname.replace(/^www\./, "");
  } catch {
    return site;
  }
};

export const toAbsoluteUrl = (site) =>
  !site ? "" : /^https?:\/\//i.test(site) ? site : `https://${site}`;
