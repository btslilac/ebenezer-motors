const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://ebenezer-motors-main.vercel.app").replace(/\/$/, "");

const buildUrl = (path) => {
  if (path.startsWith("http")) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    return { message: text };
  }
};

export const apiRequest = async (path, options = {}) => {
  const {
    method = "GET",
    body,
    headers = {},
    auth = false,
    isForm = false
  } = options;

  const finalHeaders = { ...headers };
  if (auth) {
    const token = localStorage.getItem("adminToken");
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }
  if (!isForm && body) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers: finalHeaders,
    body: isForm ? body : body ? JSON.stringify(body) : undefined
  });

  const payload = await parseResponse(response);
  if (!response.ok) {
    const message = payload?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return payload;
};
