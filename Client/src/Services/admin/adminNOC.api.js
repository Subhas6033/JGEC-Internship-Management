import { apiClient } from "../api/apiClient";

// Adjust if adminNocRoutes is mounted somewhere else in your Express app.
const BASE = "/admin/noc-management";

// Backend responses are wrapped by apiClientRES: { statusCode, data, message }.
// Every function below returns the inner payload only.
const payloadOf = (response) => response?.data?.data ?? response?.data ?? null;

// GET /admin/noc/pending?page=&limit=&search=&department=
export const fetchPendingNocs = async (params = {}) =>
  payloadOf(await apiClient.get(`${BASE}/pending`, { params }));

// GET /admin/noc/stats
export const fetchNocStats = async () =>
  payloadOf(await apiClient.get(`${BASE}/stats`));

// GET /admin/noc/:applicationId
export const fetchNocDetails = async (applicationId) =>
  payloadOf(await apiClient.get(`${BASE}/${applicationId}`));

// POST /admin/noc/:applicationId/approve
export const approveAndSendNoc = async (applicationId) =>
  payloadOf(await apiClient.post(`${BASE}/${applicationId}/approve`));

// POST /admin/noc/bulk-approve  { applicationIds: [] }
export const bulkApproveAndSendNocs = async (applicationIds) =>
  payloadOf(await apiClient.post(`${BASE}/bulk-approve`, { applicationIds }));
