import { apiRequest } from "./apiClient";

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    query.set(key, value);
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

export const getVehicles = (params = {}) => {
  const query = buildQuery(params);
  return apiRequest(`/api/vehicles${query}`);
};

export const getVehicleById = (id) => {
  return apiRequest(`/api/vehicles/${id}`);
};

export const createVehicle = (payload) => {
  return apiRequest("/api/vehicles", { method: "POST", body: payload, auth: true });
};

export const updateVehicle = (id, payload) => {
  return apiRequest(`/api/vehicles/${id}`, { method: "PUT", body: payload, auth: true });
};

export const deleteVehicle = (id) => {
  return apiRequest(`/api/vehicles/${id}`, { method: "DELETE", auth: true });
};

export const uploadVehicleImages = (id, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  return apiRequest(`/api/vehicles/${id}/images`, {
    method: "POST",
    body: formData,
    auth: true,
    isForm: true
  });
};
