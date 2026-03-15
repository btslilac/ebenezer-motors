import { apiRequest } from "./apiClient";

export const submitContactMessage = (payload) => {
  return apiRequest("/api/contacts", { method: "POST", body: payload });
};

export const submitTradeIn = (payload) => {
  return apiRequest("/api/trade-ins", { method: "POST", body: payload });
};

export const submitHireRequest = (payload) => {
  return apiRequest("/api/hire-requests", { method: "POST", body: payload });
};
