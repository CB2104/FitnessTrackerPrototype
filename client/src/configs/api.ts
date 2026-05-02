import axios, { AxiosError } from "axios";
import { getStoredToken, removeStoredToken } from "../utils/auth";
const baseURL = import.meta.env.VITE_STRAPI_API_URL;

if (!baseURL) {
  throw new Error("VITE_STRAPI_API_URL is not defined. Check your .env file.");
}

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeStoredToken();
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);

export default api;
