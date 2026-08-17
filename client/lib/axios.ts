import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/services/auth.service";

let refreshPromise: Promise<string> | null = null;

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url ?? "";

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      useAuthStore.getState().accessToken &&
      !url.includes("/auth/refresh") &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/register")
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = authService
          .refresh()
          .then((token) => {
            useAuthStore.getState().setAccessToken(token);
            return token;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        const accessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch {
        useAuthStore.getState().clearSession();
        if (typeof window !== "undefined") {
          window.location.replace("/login");
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
