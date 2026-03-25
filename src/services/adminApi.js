import { apiRequest } from "./apiClient";

export const adminLogin = (payload) => {
  return apiRequest("/api/admin/login", { method: "POST", body: payload });
};

export const adminRegister = (payload) => {
  return apiRequest("/api/admin/register", { method: "POST", body: payload });
};

export const fetchAdminProfile = () => {
  return apiRequest("/api/admin/me", { auth: true });
};

export const fetchContacts = () => {
  return apiRequest("/api/contacts", { auth: true });
};

export const updateContact = (id, payload) => {
  return apiRequest(`/api/contacts/${id}`, { method: "PATCH", body: payload, auth: true });
};

export const fetchTradeIns = () => {
  return apiRequest("/api/trade-ins", { auth: true });
};

export const updateTradeIn = (id, payload) => {
  return apiRequest(`/api/trade-ins/${id}`, { method: "PATCH", body: payload, auth: true });
};

export const fetchHireRequests = () => {
  return apiRequest("/api/hire-requests", { auth: true });
};

export const updateHireRequest = (id, payload) => {
  return apiRequest(`/api/hire-requests/${id}`, { method: "PATCH", body: payload, auth: true });
};

// ── Financing Clients ─────────────────────────────────────────────────────────
export const fetchFinancingClients = () =>
  apiRequest("/api/financing/clients", { auth: true });

export const createFinancingClient = (payload) =>
  apiRequest("/api/financing/clients", { method: "POST", body: payload });

export const updateFinancingClient = (id, payload) =>
  apiRequest(`/api/financing/clients/${id}`, { method: "PATCH", body: payload, auth: true });

// ── Financing Records ─────────────────────────────────────────────────────────
export const fetchFinancingRecords = () =>
  apiRequest("/api/financing/records", { auth: true });

export const createFinancingRecord = (payload) =>
  apiRequest("/api/financing/records", { method: "POST", body: payload, auth: true });

export const updateFinancingRecord = (id, payload) =>
  apiRequest(`/api/financing/records/${id}`, { method: "PATCH", body: payload, auth: true });

export const addFinancingPayment = (recordId, payload) =>
  apiRequest(`/api/financing/records/${recordId}/payments`, { method: "POST", body: payload, auth: true });
